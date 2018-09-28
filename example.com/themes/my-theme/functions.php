<?php
/**
 * Only including PHP files from /inc
 */

// Theme Init
require get_template_directory() . '/inc/setup.php';

// Back-Office functions
require get_template_directory() . '/inc/backoffice.php';

// Widgets functions
require get_template_directory() . '/inc/widgets.php';

// Boostrap Nav Walker
require get_template_directory() . '/inc/menus.php';
