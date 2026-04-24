<?php

declare(strict_types=1);

get_header();
?>
<div class="page-shell page-spacing">
    <div class="section-stack">
        <div class="section-copy">
            <p class="eyebrow">LIMI Atelier</p>
            <h1 class="section-title section-title--page"><?php bloginfo('name'); ?></h1>
            <p class="section-text">
                Zakladna fallback sablona pre WordPress pripravu custom LIMI temy.
            </p>
        </div>

        <?php if (have_posts()) : ?>
            <div class="content-list">
                <?php while (have_posts()) : the_post(); ?>
                    <article class="card content-card">
                        <h2 class="product-card__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                        <div class="section-text"><?php the_excerpt(); ?></div>
                    </article>
                <?php endwhile; ?>
            </div>
        <?php else : ?>
            <div class="card content-card">
                <p><?php esc_html_e('Zatial tu nie je obsah.', 'limi-atelier'); ?></p>
            </div>
        <?php endif; ?>
    </div>
</div>
<?php
get_footer();
