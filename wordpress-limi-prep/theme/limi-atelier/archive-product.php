<?php

declare(strict_types=1);

get_header();

$is_en = get_locale() === 'en_US';
?>
<div class="page-shell page-spacing">
    <div class="section-stack">
        <div class="section-copy">
            <p class="eyebrow"><?php echo $is_en ? 'Shop' : 'Obchod'; ?></p>
            <h1 class="section-title section-title--page"><?php woocommerce_page_title(); ?></h1>
            <p class="section-text"><?php echo $is_en ? 'Discover our collection of 3D stickers for kids.' : 'Objav našu kolekciu 3D nálepiek pre deti.'; ?></p>
        </div>

        <?php if (woocommerce_product_loop()) : ?>
            <div class="woocommerce-limi-grid">
                <?php
                while (have_posts()) :
                    the_post();
                    global $product;
                    ?>
                    <article <?php wc_product_class('card product-card', $product); ?>>
                        <a class="product-card__media" href="<?php the_permalink(); ?>">
                            <?php echo $product ? $product->get_image('large') : ''; ?>
                        </a>
                        <div class="product-card__body">
                            <h2 class="product-card__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                            <p class="product-card__description"><?php echo esc_html(wp_strip_all_tags(get_the_excerpt())); ?></p>
                            <div class="product-card__footer">
                                <p class="product-card__price"><?php echo $product ? wp_kses_post($product->get_price_html()) : ''; ?></p>
                                <a class="product-card__info-link" href="<?php the_permalink(); ?>#product-info"><?php echo $is_en ? 'View detail' : 'Viac o nálepke'; ?></a>
                            </div>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>
        <?php else : ?>
            <p><?php echo $is_en ? 'No products found yet.' : 'Zatiaľ tu nie sú produkty.'; ?></p>
        <?php endif; ?>
    </div>
</div>
<?php
get_footer();
