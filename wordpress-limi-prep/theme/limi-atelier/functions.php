<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

require_once get_template_directory() . '/inc/demo-content.php';
require_once get_template_directory() . '/inc/customizer.php';

function limi_atelier_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', [
        'height'      => 120,
        'width'       => 120,
        'flex-height' => true,
        'flex-width'  => true,
    ]);
    add_theme_support('woocommerce');
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'script', 'style']);

    register_nav_menus([
        'primary' => __('Primary Menu', 'limi-atelier'),
    ]);
}
add_action('after_setup_theme', 'limi_atelier_setup');

function limi_atelier_register_image_sizes(): void
{
    add_image_size('limi-product-card', 1200, 1600, true);
    add_image_size('limi-product-detail', 1400, 1800, true);
}
add_action('after_setup_theme', 'limi_atelier_register_image_sizes');

function limi_atelier_enqueue_assets(): void
{
    $theme = wp_get_theme();

    wp_enqueue_style(
        'limi-atelier-theme',
        get_template_directory_uri() . '/assets/css/theme.css',
        [],
        $theme->get('Version')
    );

    wp_enqueue_script(
        'limi-atelier-theme',
        get_template_directory_uri() . '/assets/js/theme.js',
        [],
        $theme->get('Version'),
        true
    );
}
add_action('wp_enqueue_scripts', 'limi_atelier_enqueue_assets');

function limi_atelier_is_woocommerce_active(): bool
{
    return class_exists('WooCommerce');
}

function limi_atelier_get_featured_products(): array
{
    if (limi_atelier_is_woocommerce_active()) {
        $products = wc_get_products([
            'status' => 'publish',
            'limit' => 3,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);

        if (! empty($products)) {
            return $products;
        }
    }

    return limi_atelier_demo_products();
}

function limi_atelier_get_shop_products(): array
{
    if (limi_atelier_is_woocommerce_active()) {
        $products = wc_get_products([
            'status' => 'publish',
            'limit' => 12,
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ]);

        if (! empty($products)) {
            return $products;
        }
    }

    return limi_atelier_demo_products();
}

function limi_atelier_get_product_image_url($product): string
{
    if ($product instanceof WC_Product) {
        $image_id = $product->get_image_id();

        if ($image_id) {
            $image = wp_get_attachment_image_url($image_id, 'large');

            if ($image) {
                return $image;
            }
        }
    }

    if (is_array($product) && ! empty($product['image'])) {
        return (string) $product['image'];
    }

    return get_template_directory_uri() . '/assets/images/placeholder-product.jpg';
}

function limi_atelier_get_product_title($product): string
{
    if ($product instanceof WC_Product) {
        return $product->get_name();
    }

    return (string) ($product['title'] ?? '');
}

function limi_atelier_get_product_description($product): string
{
    if ($product instanceof WC_Product) {
        return wp_strip_all_tags($product->get_short_description() ?: $product->get_description());
    }

    return (string) ($product['description'] ?? '');
}

function limi_atelier_get_product_price($product): string
{
    if ($product instanceof WC_Product) {
        return wp_strip_all_tags($product->get_price_html());
    }

    return (string) ($product['price'] ?? '');
}

function limi_atelier_get_product_url($product): string
{
    if ($product instanceof WC_Product) {
        return get_permalink($product->get_id()) ?: '#';
    }

    return (string) ($product['url'] ?? '#');
}

function limi_atelier_get_logo_markup(): string
{
    $custom_logo_id = get_theme_mod('custom_logo');

    if ($custom_logo_id) {
        return (string) wp_get_attachment_image($custom_logo_id, 'full', false, [
            'class' => 'site-header__logo',
            'alt' => get_bloginfo('name'),
        ]);
    }

    return sprintf(
        '<span class="site-header__logo-text">%s</span>',
        esc_html(get_bloginfo('name'))
    );
}

function limi_atelier_theme_mod(string $key, string $fallback = ''): string
{
    $value = get_theme_mod($key, $fallback);

    return is_string($value) ? $value : $fallback;
}

function limi_atelier_get_page_url_by_title(string $title, string $fallback = '/'): string
{
    $page = get_page_by_title($title);

    if ($page instanceof WP_Post) {
        $url = get_permalink($page->ID);

        if (is_string($url) && $url !== '') {
            return $url;
        }
    }

    return home_url($fallback);
}
