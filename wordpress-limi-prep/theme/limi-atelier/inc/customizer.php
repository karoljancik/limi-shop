<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

function limi_atelier_customize_register(WP_Customize_Manager $wp_customize): void
{
    $wp_customize->add_section('limi_atelier_homepage', [
        'title'    => __('LIMI Homepage', 'limi-atelier'),
        'priority' => 30,
    ]);

    $settings = [
        'limi_home_eyebrow' => ['label' => 'Hero Eyebrow', 'default' => 'Limi nalepky'],
        'limi_home_title' => ['label' => 'Hero Title', 'default' => 'Nalepky, ktore pozyvaju do sveta malych pribehov.'],
        'limi_home_text' => ['label' => 'Hero Text', 'default' => 'Jemne farby, mile motivy a tvorenie, pri ktorom si oddychnu deti aj rodicia.'],
        'limi_home_cta_primary' => ['label' => 'Primary CTA Label', 'default' => 'Objavit nalepky'],
        'limi_home_cta_secondary' => ['label' => 'Secondary CTA Label', 'default' => 'Pribeh znacky'],
        'limi_brand_tagline' => ['label' => 'Header Tagline', 'default' => 'Nalepky pre male ruky a velku fantaziu'],
    ];

    foreach ($settings as $id => $config) {
        $wp_customize->add_setting($id, [
            'default'           => $config['default'],
            'sanitize_callback' => 'sanitize_text_field',
        ]);

        $wp_customize->add_control($id, [
            'label'   => $config['label'],
            'section' => 'limi_atelier_homepage',
            'type'    => 'text',
        ]);
    }
}
add_action('customize_register', 'limi_atelier_customize_register');
