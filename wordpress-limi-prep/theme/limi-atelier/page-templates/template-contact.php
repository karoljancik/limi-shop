<?php
/**
 * Template Name: Contact Page
 */

declare(strict_types=1);

get_header();
?>
<div class="page-shell page-spacing">
    <section class="contact-layout">
        <div class="card contact-panel">
            <p class="eyebrow">Kontakt</p>
            <h1 class="section-title section-title--page"><?php the_title(); ?></h1>
            <div class="section-text">
                <?php the_content(); ?>
            </div>
        </div>

        <div class="card contact-panel">
            <p class="eyebrow">Dalsi krok</p>
            <h2 class="product-card__title">Formular alebo social links</h2>
            <p class="section-text">Sem mozes neskor vlozit WPForms, Contact Form 7 alebo vlastny formular.</p>
            <ul class="product-story__list">
                <li>E-mail kontakt</li>
                <li>Instagram / social siete</li>
                <li>FAQ alebo obchodne otazky</li>
            </ul>
        </div>
    </section>
</div>
<?php
get_footer();
