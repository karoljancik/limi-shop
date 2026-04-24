<?php

declare(strict_types=1);

get_header();

$featured_products = limi_atelier_get_featured_products();
$shop_url = limi_atelier_get_page_url_by_title('Shop', '/shop/');
$about_url = limi_atelier_get_page_url_by_title('O nas', '/o-znacke/');
?>
<div class="space-y-16 page-spacing">
    <section class="page-shell">
        <div class="hero-grid">
            <div class="hero-copy">
                <p class="eyebrow"><?php echo esc_html(limi_atelier_theme_mod('limi_home_eyebrow', 'Limi nalepky')); ?></p>
                <h1 class="hero-title"><?php echo esc_html(limi_atelier_theme_mod('limi_home_title', 'Nalepky, ktore pozyvaju do sveta malych pribehov.')); ?></h1>
                <p class="hero-text">
                    <?php echo esc_html(limi_atelier_theme_mod('limi_home_text', 'Jemne farby, mile motivy a tvorenie, pri ktorom si oddychnu deti aj rodicia.')); ?>
                </p>
                <div class="hero-actions">
                    <a class="btn-primary" href="<?php echo esc_url($shop_url); ?>"><?php echo esc_html(limi_atelier_theme_mod('limi_home_cta_primary', 'Objavit nalepky')); ?></a>
                    <a class="btn-secondary" href="<?php echo esc_url($about_url); ?>"><?php echo esc_html(limi_atelier_theme_mod('limi_home_cta_secondary', 'Pribeh znacky')); ?></a>
                </div>
            </div>

            <div class="card hero-media">
                <div class="hero-media__placeholder">
                    <span>Sem pride hero video alebo lifestyle vizual</span>
                </div>
            </div>
        </div>
    </section>

    <section class="page-shell section-stack">
        <div class="section-heading">
            <div>
                <p class="eyebrow">Vybrane produkty</p>
                <h2 class="section-title">Male svety na objavenie</h2>
            </div>
            <a class="btn-secondary" href="<?php echo esc_url($shop_url); ?>">Vsetky produkty</a>
        </div>

        <div class="product-grid product-grid--home">
            <?php foreach ($featured_products as $product) : ?>
                <article class="card product-card">
                    <a class="product-card__media" href="<?php echo esc_url(limi_atelier_get_product_url($product)); ?>">
                        <img
                            src="<?php echo esc_url(limi_atelier_get_product_image_url($product)); ?>"
                            alt="<?php echo esc_attr(limi_atelier_get_product_title($product)); ?>"
                        >
                    </a>
                    <div class="product-card__body">
                        <h3 class="product-card__title">
                            <a href="<?php echo esc_url(limi_atelier_get_product_url($product)); ?>">
                                <?php echo esc_html(limi_atelier_get_product_title($product)); ?>
                            </a>
                        </h3>
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
    </section>
</div>
<?php
get_footer();
