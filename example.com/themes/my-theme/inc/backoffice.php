<?php
/**
 * BACK OFFICE FUNCTIONS 
 */

//Allow SVG Uploads
add_filter('upload_mimes', 'cc_mime_types');
function cc_mime_types($mimes) {
  $mimes['svg'] = 'image/svg+xml';
  return $mimes;
}


