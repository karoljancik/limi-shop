<?php

declare(strict_types=1);

get_header();

$products = limi_atelier_get_shop_products();
?>
<div class="page-shell page-spacing">
    <div class="section-stack">
        <div class="section-copy">
            <p class="eyebrow">Obchod</p>
            <h1 class="section-title section-title--page">Limi obchod</h1>
            <p class="section-text">
                Vyber si nalepku, ktora deti vtiahne do hry a rodicom prinesie pokojne tvorive chvile.
            </p>
        </div>

        <div class="product-grid product-grid--shop">
            <?php foreach ($products as $product) : ?>
                <article class="card product-card">
                    <a class="product-card__media" href="<?php echo esc_url(limi_atelier_get_product_url($product)); ?>">
                        <img
                            src="<?php echo esc_url(limi_atelier_get_product_image_url($product)); ?>"
                            alt="<?php echo esc_attr(limi_atelier_get_product_title($product)); ?>"
                        >
                    </a>
                    <div class="product-card__body">
                        <h2 class="product-card__title">
                            <a href="<?php echo esc_url(limi_atelier_get_product_url($product)); ?>">
                                <?php echo esc_html(limi_atelier_get_product_title($product)); ?>
                            </a>
                        </h2>
                        <p class="product-card__description">
                            <?php echo esc_html(limi_atelier_get_product_description($product)); ?>
                        </p>
                        <div class="product-card__footer">
                            <p class="product-card__price"><?php echo esc_html(limi_atelier_get_product_price($product)); ?></p>
                            <a class="product-card__info-link" href="<?php echo esc_url(limi_atelier_get_product_url($product)); ?>">
                                Viac o nalepke
                            </a>
                        </div>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</div>
<?php
get_footer();
