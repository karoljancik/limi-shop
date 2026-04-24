<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

function limi_atelier_demo_products(): array
{
    $base = get_template_directory_uri() . '/assets/images';
    $placeholder = $base . '/placeholder-product.svg';

    return [
        [
            'title' => 'Kapi Kupelne Nalepky LIMI',
            'description' => '3D zazitkove nalepky s kupelnym motivom pre deti a dospelych.',
            'price' => '5,99 EUR',
            'url' => '#',
            'image' => $placeholder,
        ],
        [
            'title' => 'Mackova Pekaren Nalepky LIMI',
            'description' => 'Hravna 3D nalepkova sada s pekarnou a milymi detailmi.',
            'price' => '5,99 EUR',
            'url' => '#',
            'image' => $placeholder,
        ],
        [
            'title' => 'Piggy Obchod Nalepky LIMI',
            'description' => 'Pokojne tvorenie s hravou obchodnou scenou pre male pribehy.',
            'price' => '5,99 EUR',
            'url' => '#',
            'image' => $placeholder,
        ],
    ];
}
