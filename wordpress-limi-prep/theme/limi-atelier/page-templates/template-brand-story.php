<?php
/**
 * Template Name: Brand Story
 */

declare(strict_types=1);

get_header();
?>
<div class="page-shell page-spacing">
    <section class="story-hero card">
        <div class="story-hero__copy">
            <p class="eyebrow">Pribeh znacky</p>
            <h1 class="section-title section-title--page"><?php the_title(); ?></h1>
            <div class="section-text">
                <?php the_content(); ?>
            </div>
        </div>
        <div class="story-hero__visual">
            <div class="story-hero__placeholder">Sem pride lifestyle foto alebo brand ilustracia.</div>
        </div>
    </section>

    <section class="page-spacing-small story-panels">
        <article class="card story-panel">
            <p class="eyebrow">Vizualny smer</p>
            <h2 class="product-card__title">Jemny, hravy, premium</h2>
            <p class="section-text">Tu mozes neskor vlozit text o style znacky, ilustraciach a produkte.</p>
        </article>
        <article class="card story-panel">
            <p class="eyebrow">Pre WordPress implementaciu</p>
            <h2 class="product-card__title">Pripravene bloky</h2>
            <p class="section-text">Tato sablona je pripraveny zaklad pre custom obsahovu stranku mimo shopu.</p>
        </article>
    </section>
</div>
<?php
get_footer();
