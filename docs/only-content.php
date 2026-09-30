<?php
/**
 * Template Name: Only Content
 **/
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <!-- Esta es la línea mágica que hace que funcione el modo Responsive en móviles -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title><?php wp_title('|', true, 'right'); bloginfo('name'); ?></title>
    
    <!-- wp_head() carga los estilos esenciales, SEO y plugins necesarios -->
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php
if (!(is_page('my-account') && !is_user_logged_in())) {
?>
	<main class="container">
		<section class="row justify-content-center">
			<article id="post-<?php the_ID(); ?>" <?php post_class('col-md-12'); ?>>
				<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
						<div class="d-block">
							<?php the_content(); ?>
						</div>
				<?php endwhile;
				endif; ?>
			</article>
		</section>
	</main>
<?php } else { ?>
	<?php the_content(); ?>
<?php } ?>
<!-- wp_footer() es esencial para que funcionen los scripts (como popups o analytics) -->
<?php wp_footer(); ?>
</body>
</html>