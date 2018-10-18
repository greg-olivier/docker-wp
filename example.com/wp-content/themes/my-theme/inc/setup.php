<?php

 /**
  * Enqueue scripts and styles.
  */

function add_normalize_css() {
	wp_enqueue_style( 'normalize-styles', "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css");
}


add_action( 'wp_enqueue_scripts', 'replace_jquery', 1 );
function replace_jquery() {
	wp_deregister_script( 'jquery' );
	wp_register_script( 'jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js', array(), null, false);
	wp_enqueue_script('jquery');

}


add_action( 'wp_enqueue_scripts', 'my_scripts', 2 );
function my_scripts() {

    // Enqueue style
 	wp_enqueue_style( 'my-style', get_template_directory_uri() . '/assets/css/app.css' );

    // Enqueue scripts with jQuery dependency
 	wp_enqueue_script( 'my_script', get_template_directory_uri() . '/assets/js/app.bundle.js', array('jquery'), null, true );

 }


// Async Script loading.
 add_filter('script_loader_tag', 'async_script', 1, 2);
 function async_script($tag, $handle){
    // Add scripts you want to async, ex : ('jquery','my_scripts')
 	$scripts_to_async = array('jquery');
 	foreach($scripts_to_async as $async_script) {
 		if ( $async_script === $handle){
 			return str_replace(' src', ' async="async" src', $tag);
 		}
 	}
 	return $tag;
 }


// Register Nav Menu
add_action( 'init', 'add_main_nav' );
function add_main_nav() {
	register_nav_menu('header-menu',__( 'Header Menu' ));
}
