<?php

declare(strict_types=1);

get_header();

$featured_products = limi_atelier_get_featured_products();
$shop_url = limi_atelier_get_page_url_by_title('Shop', '/shop/');
$about_url = limi_atelier_get_page_url_by_title('O nás', '/o-znacke/');
$is_en = get_locale() === 'en_US';
?>
<div class="space-y-16 page-spacing">
    <section class="page-shell">
        <div class="hero-grid">
            <div class="hero-copy">
                <p class="eyebrow"><?php echo esc_html(limi_atelier_theme_mod('limi_home_eyebrow', $is_en ? 'Limi stickers' : 'Limi nálepky')); ?></p>
                <h1 class="hero-title"><?php echo esc_html(limi_atelier_theme_mod('limi_home_title', $is_en ? 'Stickers that invite to the world of small stories.' : 'Nálepky, ktoré pozývajú do sveta malých príbehov.')); ?></h1>
                <p class="hero-text">
                    <?php echo esc_html(limi_atelier_theme_mod('limi_home_text', $is_en ? 'Gentle colors, cute motifs and creation where both children and parents relax.' : 'Jemné farby, milé motívy a tvorenie, pri ktorom si oddýchnu deti aj rodičia.')); ?>
                </p>
                <div class="hero-actions">
                    <a class="btn-primary" href="<?php echo esc_url($shop_url); ?>"><?php echo esc_html(limi_atelier_theme_mod('limi_home_cta_primary', $is_en ? 'Discover stickers' : 'Objaviť nálepky')); ?></a>
                    <a class="btn-secondary" href="<?php echo esc_url($about_url); ?>"><?php echo esc_html(limi_atelier_theme_mod('limi_home_cta_secondary', $is_en ? 'Brand story' : 'Príbeh značky')); ?></a>
                </div>
            </div>

            <div class="card hero-media">
                <div class="hero-media__placeholder">
                    <span><?php echo $is_en ? 'Hero video or lifestyle visual' : 'Sem príde hero video alebo lifestyle vizuál'; ?></span>
                </div>
            </div>
        </div>
    </section>

    <section class="page-shell section-stack">
        <div class="section-heading">
            <div>
                <p class="eyebrow"><?php echo $is_en ? 'Featured products' : 'Vybrané produkty'; ?></p>
                <h2 class="section-title"><?php echo $is_en ? 'Small worlds to discover' : 'Malé svety na objavenie'; ?></h2>
            </div>
            <a class="btn-secondary" href="<?php echo esc_url($shop_url); ?>"><?php echo $is_en ? 'All products' : 'Všetky produkty'; ?></a>
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
                                <?php echo $is_en ? 'View detail' : 'Viac o nálepke'; ?>
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
