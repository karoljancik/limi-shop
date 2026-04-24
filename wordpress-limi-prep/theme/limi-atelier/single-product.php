<?php

declare(strict_types=1);

get_header();
?>
<div class="page-shell page-spacing">
    <?php while (have_posts()) : the_post(); ?>
        <a class="back-link" href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>">← Spat do obchodu</a>

        <div class="product-detail-layout">
            <div class="card product-detail-media">
                <?php
                global $product;
                if ($product) {
                    echo $product->get_image('large');
                }
                ?>
            </div>

            <div class="product-detail-copy">
                <p class="eyebrow">Detail produktu</p>
                <div class="product-detail__headline">
                    <span class="product-detail__badge">LIMI</span>
                    <h1 class="product-detail-title"><?php the_title(); ?></h1>
                </div>
                <p class="product-detail-price"><?php echo $product ? wp_kses_post($product->get_price_html()) : ''; ?></p>

                <div class="product-info-card">
                    <div class="product-info-card__row">
                        <span class="product-info-card__label">Dostupnost</span>
                        <span class="product-info-card__value">
                            <?php echo $product && $product->is_in_stock() ? 'Skladom' : 'Na objednavku'; ?>
                        </span>
                    </div>
                    <div class="product-info-card__row">
                        <span class="product-info-card__label">Kategoria</span>
                        <span class="product-info-card__value"><?php echo wc_get_product_category_list(get_the_ID()); ?></span>
                    </div>
                </div>

                <div class="section-text"><?php the_excerpt(); ?></div>
                <div class="product-detail-actions">
                    <?php woocommerce_template_single_add_to_cart(); ?>
                </div>
            </div>
        </div>

        <section class="product-story page-spacing-small">
            <div class="product-story__tabs">
                <span class="product-story__tab is-active">Popis</span>
                <span class="product-story__tab">Detaily</span>
            </div>

            <div class="product-story__grid">
                <div class="card product-story__copy">
                    <div class="product-story__lead"><?php the_excerpt(); ?></div>
                    <div class="section-text"><?php the_content(); ?></div>
                </div>
                <div class="card product-story__facts">
                    <div>
                        <p class="eyebrow">Dalsi krok</p>
                        <ul class="product-story__list">
                            <li>Napojit realne galerie a custom product meta.</li>
                            <li>Doplnit varianty obrazkov do product gallery.</li>
                            <li>Zladit detail produktu s aktualnym storefront contentom.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    <?php endwhile; ?>
</div>
<?php
get_footer();
