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
            <span class="site-header__brand-text"><?php echo esc_html(limi_atelier_theme_mod('limi_brand_tagline', 'Nálepky pre malé ruky a veľkú fantáziu')); ?></span>
        </a>

        <div class="site-header__nav-wrapper">
             <div class="lang-switcher">
                <span class="lang-tab <?php echo get_locale() === 'sk_SK' ? 'is-active' : ''; ?>">SK</span>
                <span class="lang-tab <?php echo get_locale() === 'en_US' ? 'is-active' : ''; ?>">EN</span>
             </div>

            <nav class="site-header__nav" aria-label="<?php esc_attr_e('Main navigation', 'limi-atelier'); ?>">
                <a class="site-header__nav-link" href="<?php echo esc_url($home_url); ?>"><?php echo get_locale() === 'en_US' ? 'Home' : 'Domov'; ?></a>
                <a class="site-header__nav-link" href="<?php echo esc_url($shop_url); ?>"><?php echo get_locale() === 'en_US' ? 'Shop' : 'Obchod'; ?></a>
                <a class="site-header__nav-link" href="<?php echo esc_url($contact_url); ?>"><?php echo get_locale() === 'en_US' ? 'Contact' : 'Kontakt'; ?></a>
                <a class="site-header__cta" href="<?php echo esc_url($shop_url); ?>"><?php echo get_locale() === 'en_US' ? 'Discover stickers' : 'Objaviť nálepky'; ?></a>
            </nav>
        </div>
    </div>
</header>

<main class="site-main">
