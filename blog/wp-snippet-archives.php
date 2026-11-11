/*
 * zana-g.com blog: send WordPress's own category, tag, author and date archives
 * to the styled /blog/ page, and keep them out of the Yoast sitemap.
 * Source of truth: portfolio/blog/wp-snippet-archives.php
 */
add_action( 'template_redirect', function () {
	if ( is_category() ) {
		$term = get_queried_object();
		$url  = home_url( '/blog/' );
		if ( $term && isset( $term->slug ) ) {
			$url = add_query_arg( 'topic', $term->slug, $url );
		}
		wp_safe_redirect( $url, 301 );
		exit;
	}
	if ( is_tag() || is_author() || is_date() ) {
		wp_safe_redirect( home_url( '/blog/' ), 301 );
		exit;
	}
} );

add_filter( 'wpseo_sitemap_exclude_taxonomy', function ( $excluded, $taxonomy ) {
	return in_array( $taxonomy, array( 'category', 'post_tag', 'post_format' ), true ) ? true : $excluded;
}, 10, 2 );

add_filter( 'wpseo_sitemap_exclude_author', function ( $users ) {
	return array();
} );
