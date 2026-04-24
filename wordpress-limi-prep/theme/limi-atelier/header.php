<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<?php
$home_url = limi_atelier_get_page_url_by_title('Domov', '/');
$shop_url = limi_atelier_get_page_url_by_title('Shop', '/shop/');
$contact_url = limi_atelier_get_page_url_by_title('Kontakt', '/kontakt/');
?>

<header class="site-header">
    <div class="site-header__inner">
        <a class="site-header__brand" href="<?php echo esc_url($home_url); ?>">
            <?php echo limi_atelier_get_logo_markup(); ?>
            <span class="site-header__brand-text"><?php echo esc_html(limi_atelier_theme_mod('limi_brand_tagline', 'Nalepky pre male ruky a velku fantaziu')); ?></span>
        </a>

        <nav class="site-header__nav" aria-label="<?php esc_attr_e('Main navigation', 'limi-atelier'); ?>">
            <a class="site-header__nav-link" href="<?php echo esc_url($home_url); ?>">Domov</a>
            <a class="site-header__nav-link" href="<?php echo esc_url($shop_url); ?>">Obchod</a>
            <a class="site-header__nav-link" href="<?php echo esc_url($contact_url); ?>">Kontakt</a>
            <a class="site-header__cta" href="<?php echo esc_url($shop_url); ?>">Objavit nalepky</a>
        </nav>
    </div>
</header>

<main class="site-main">
