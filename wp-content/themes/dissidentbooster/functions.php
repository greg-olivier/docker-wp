<?php

function add_normalize_css() {
	wp_enqueue_style( 'normalize-styles', "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css");
}

add_action( 'widgets_init', 'add_widget_support' );
function add_widget_support() {
	register_sidebar( array(
		'name'          => 'Sidebar',
		'id'            => 'sidebar',
		'before_widget' => '<div>',
		'after_widget'  => '</div>',
		'before_title'  => '<h2>',
		'after_title'   => '</h2>',
	) );
}

add_action( 'init', 'add_main_nav' );
function add_main_nav() {
	register_nav_menu('header-menu',__( 'Header Menu' ));
}

add_action('after_setup_theme', 'post_thumbnails');
function post_thumbnails() {
	add_theme_support('post-thumbnails');
}