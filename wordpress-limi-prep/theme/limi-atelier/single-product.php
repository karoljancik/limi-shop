<?php

declare(strict_types=1);

get_header();
?>
<div class="page-shell page-spacing">
    <?php while (have_posts()) : the_post(); ?>
        <a class="back-link" href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>">← <?php echo get_locale() === 'en_US' ? 'Back to shop' : 'Späť do obchodu'; ?></a>

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
                <p class="eyebrow"><?php echo get_locale() === 'en_US' ? 'Product Detail' : 'Detail produktu'; ?></p>
                <div class="product-detail__headline">
                    <span class="product-detail__badge">LIMI</span>
                    <h1 class="product-detail-title"><?php the_title(); ?></h1>
                </div>
                <p class="product-detail-price"><?php echo $product ? wp_kses_post($product->get_price_html()) : ''; ?></p>

                <div class="section-text"><?php the_excerpt(); ?></div>
                
                <div class="product-detail-actions">
                    <?php woocommerce_template_single_add_to_cart(); ?>
                    <a href="#info" class="btn-soft"><?php echo get_locale() === 'en_US' ? 'More about the sticker' : 'Viac o nálepke'; ?></a>
                </div>

                <div class="product-info-card mt-6">
                    <div class="product-info-card__row">
                        <span class="product-info-card__label"><?php echo get_locale() === 'en_US' ? 'Availability' : 'Dostupnosť'; ?></span>
                        <span class="product-info-card__value <?php echo $product && $product->is_in_stock() ? 'text-green-600' : 'text-red-500 font-bold'; ?>">
                            <?php 
                            if ($product) {
                                if ($product->is_in_stock()) {
                                    echo get_locale() === 'en_US' ? 'In stock' : 'Skladom';
                                } else {
                                    echo get_locale() === 'en_US' ? 'Out of stock' : 'Nie je na sklade';
                                }
                            }
                            ?>
                        </span>
                    </div>
                    <div class="product-info-card__row">
                        <span class="product-info-card__label"><?php echo get_locale() === 'en_US' ? 'Category' : 'Kategória'; ?></span>
                        <span class="product-info-card__value"><?php echo wc_get_product_category_list(get_the_ID()); ?></span>
                    </div>
                </div>
            </div>
        </div>

        <section id="info" class="product-story page-spacing-small">
            <div class="product-story__tabs">
                <span class="product-story__tab is-active"><?php echo get_locale() === 'en_US' ? 'Description' : 'Popis'; ?></span>
                <span class="product-story__tab"><?php echo get_locale() === 'en_US' ? 'Details' : 'Detaily'; ?></span>
            </div>

            <div class="product-story__grid">
                <div class="card product-story__copy">
                    <div class="product-story__lead"><?php the_excerpt(); ?></div>
                    <div class="section-text"><?php the_content(); ?></div>
                </div>
                <div class="card product-story__facts">
                    <div>
                        <p class="eyebrow"><?php echo get_locale() === 'en_US' ? 'Why to love them' : 'Prečo si ich obľúbiť'; ?></p>
                        <ul class="product-story__list">
                             <li><?php echo get_locale() === 'en_US' ? 'Designed for children imagination' : 'Navrhnuté pre detskú fantáziu'; ?></li>
                             <li><?php echo get_locale() === 'en_US' ? 'High quality 3D materials' : 'Kvalitné 3D materiály'; ?></li>
                             <li><?php echo get_locale() === 'en_US' ? 'Easy to apply and remove' : 'Jednoduchá aplikácia a odstránenie'; ?></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    <?php endwhile; ?>
</div>
<?php
get_footer();
