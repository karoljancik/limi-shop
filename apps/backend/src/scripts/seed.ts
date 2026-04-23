import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => ({
      selector: { id: data.input.store_id },
      update: {
        supported_currencies: data.input.supported_currencies.map((currency) => ({
          currency_code: currency.currency_code,
          is_default: currency.is_default ?? false,
        })),
      },
    }));

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedLimiData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["sk", "cz"];

  const existingProducts = await query.graph({
    entity: "product",
    fields: ["id"],
  });

  if (existingProducts.data?.length) {
    logger.info("Seed skipped: products already exist in the database.");
    return;
  }

  logger.info("Seeding Limi store data...");

  const [store] = await storeModuleService.listStores();

  let salesChannels = await salesChannelModuleService.listSalesChannels({
    name: "Limi Storefront",
  });

  if (!salesChannels.length) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [{ name: "Limi Storefront" }],
      },
    });

    salesChannels = result;
  }

  const defaultSalesChannel = salesChannels[0];

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "eur",
          is_default: true,
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "Limi",
        default_sales_channel_id: defaultSalesChannel.id,
      },
    },
  });

  logger.info("Seeding region data...");
  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name"],
    filters: {
      name: "Slovakia",
    },
  });

  let region: any = existingRegions?.[0];

  if (!region) {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Slovakia",
            currency_code: "eur",
            countries,
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });

    region = regionResult[0];

    await createTaxRegionsWorkflow(container).run({
      input: countries.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    });
  }

  logger.info("Seeding stock location...");
  const { data: existingStockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
    filters: {
      name: "Limi Warehouse",
    },
  });

  let stockLocation: any = existingStockLocations?.[0];
  let createdStockLocation = false;

  if (!stockLocation) {
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "Limi Warehouse",
            address: {
              city: "Presov",
              country_code: "SK",
              address_1: "Slovakia",
            },
          },
        ],
      },
    });

    stockLocation = stockLocationResult[0];
    createdStockLocation = true;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  if (createdStockLocation) {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    });
  }

  let shippingProfile =
    (
      await fulfillmentModuleService.listShippingProfiles({
        type: "default",
      })
    )[0] ?? null;

  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: {
        data: [
          {
            name: "Default Shipping Profile",
            type: "default",
          },
        ],
      },
    });

    shippingProfile = result[0];
  }

  let fulfillmentSet: any = (
    await fulfillmentModuleService.listFulfillmentSets(
      { name: "Limi delivery" },
      { relations: ["service_zones"] }
    )
  )[0];

  if (!fulfillmentSet) {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "Limi delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Slovakia and Czechia",
          geo_zones: countries.map((country_code) => ({
            country_code,
            type: "country" as const,
          })),
        },
      ],
    } as any);

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    });
  }

  const existingShippingOptions = await fulfillmentModuleService.listShippingOptions({
    name: "Kurier",
  });

  if (!existingShippingOptions.length) {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Kurier",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Dorucenie za 2-3 pracovne dni.",
            code: "kurier",
          },
          prices: [{ region_id: region.id, amount: 349 }],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    });
  }

  if (createdStockLocation) {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: {
        id: stockLocation.id,
        add: [defaultSalesChannel.id],
      },
    });
  }

  logger.info("Seeding publishable API key...");
  let publishableApiKey: ApiKey | null = null;
  const { data: existingApiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "type", "title"],
    filters: {
      type: "publishable",
    },
  });

  publishableApiKey = (existingApiKeys?.[0] as ApiKey | undefined) ?? null;

  if (!publishableApiKey) {
    const {
      result: [createdApiKey],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Limi Storefront",
            type: "publishable",
            created_by: "seed-script",
          },
        ],
      },
    });

    publishableApiKey = createdApiKey as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  });

  logger.info(`Publishable API Key: ${publishableApiKey.token}`);

  logger.info("Seeding product categories...");
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  });

  const requiredCategoryNames = ["Nalepky", "Mystery", "Doplnky"];
  const missingCategories = requiredCategoryNames.filter(
    (name) => !existingCategories?.some((category) => category.name === name)
  );

  let categoryResult: any[] = existingCategories ?? [];

  if (missingCategories.length) {
    const { result: createdCategories } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: missingCategories.map((name) => ({
          name,
          is_active: true,
        })),
      },
    });

    categoryResult = [...categoryResult, ...createdCategories];
  }

  const stickerCategory = categoryResult.find((cat) => cat.name === "Nalepky")!;
  const mysteryCategory = categoryResult.find((cat) => cat.name === "Mystery")!;
  const accessoryCategory = categoryResult.find((cat) => cat.name === "Doplnky")!;

  logger.info("Seeding products...");
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Kapi Kupelne Nalepky LIMI",
          category_ids: [stickerCategory.id],
          description:
            "3D zazitkove nalepky s kupelnym motivom pre deti a dospelych. Kreativny oddych bez obrazoviek.",
          handle: "kapi-kupelne-nalepky-limi",
          weight: 150,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "/products/stickers/kapi_limi.jpg" }],
          options: [{ title: "Edition", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              sku: "LIMI-KAPI-001",
              options: {
                Edition: "Default",
              },
              prices: [{ amount: 599, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Mackova Pekaren Nalepky LIMI",
          category_ids: [stickerCategory.id],
          description:
            "Hravna 3D nalepkova sada s pekarnou, idealna ako kreativny darcek pre deti.",
          handle: "mackova-pekaren-nalepky-limi",
          weight: 150,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "/products/stickers/macko_limi.jpg" }],
          options: [{ title: "Edition", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              sku: "LIMI-PEKAREN-001",
              options: {
                Edition: "Default",
              },
              prices: [{ amount: 599, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Piggy Obchod Nalepky LIMI",
          category_ids: [stickerCategory.id],
          description:
            "Ruzova 3D zazitkova sada s obchodikom pre pokojne tvorenie a jemnu motoriku.",
          handle: "piggy-obchod-nalepky-limi",
          weight: 150,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "/products/stickers/piggy_limi.jpg" }],
          options: [{ title: "Edition", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              sku: "LIMI-PIGGY-001",
              options: {
                Edition: "Default",
              },
              prices: [{ amount: 599, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Vianocne Nalepky LIMI",
          category_ids: [stickerCategory.id],
          description:
            "Sviatocna edicia 3D nalepiek, ktora prinasa tvorivy oddych a vanocnu atmosferu.",
          handle: "vianocne-nalepky-limi",
          weight: 150,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "/products/stickers/vianoce_limi.jpg" }],
          options: [{ title: "Edition", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              sku: "LIMI-VIANOCE-001",
              options: {
                Edition: "Default",
              },
              prices: [{ amount: 699, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Mystery Nalepky LIMI",
          category_ids: [mysteryCategory.id],
          description:
            "Prekvapenie v obalke. Mystery sada prida objavovanie a zabavu ku kazdej objednavke.",
          handle: "mystery-nalepky-limi",
          weight: 120,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "/products/stickers/mystery_limi.jpg" }],
          options: [{ title: "Edition", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              sku: "LIMI-MYSTERY-001",
              options: {
                Edition: "Default",
              },
              prices: [{ amount: 599, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Pinzeta LIMI",
          category_ids: [accessoryCategory.id],
          description:
            "Pomocna pinzeta na presne lepenie drobnych detailov pri tvoreni LIMI nalepiek.",
          handle: "pinzeta-limi",
          weight: 50,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "/products/stickers/pinzety_limi.jpg" }],
          options: [{ title: "Edition", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              sku: "LIMI-PINZETA-001",
              options: {
                Edition: "Default",
              },
              prices: [{ amount: 499, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
      ],
    },
  });

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = inventoryItems.map(
    (inventoryItem) => ({
      location_id: stockLocation.id,
      stocked_quantity: 100,
      inventory_item_id: inventoryItem.id,
    })
  );

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding Limi data.");
}
