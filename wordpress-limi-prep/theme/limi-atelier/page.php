<?php

declare(strict_types=1);

get_header();

$is_en = get_locale() === 'en_US';
?>
<div class="page-shell page-spacing">
    <div class="section-stack">
        <div class="section-copy">
            <p class="eyebrow"><?php bloginfo('name'); ?></p>
            <h1 class="section-title section-title--page"><?php the_title(); ?></h1>
        </div>

        <?php while (have_posts()) : the_post(); ?>
            <div class="card content-card">
                <div class="section-text">
                    <?php the_content(); ?>
                </div>
            </div>
        <?php endwhile; ?>
    </div>
</div>
<?php
get_footer();
