<?php get_header(); ?>
	<main class="wrap">
		<?php get_sidebar(); ?>
		<section class="content-area content-thin">
			<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
				<article class="article-loop">
					<header>
						<h2><a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>"><?php the_title(); ?></a></h2>
						By: <?php the_author(); ?>
					</header>
					<?php if ( has_post_thumbnail() ) : ?>
                        <a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>">
							<?php the_post_thumbnail('medium', array('class' => 'post-thumbnail')); ?>
                        </a>
					<?php endif; ?>
					<?php the_excerpt(); ?>
				</article>
			<?php endwhile; else : ?>
				<article>
					<p>Sorry, no posts were found!</p>
				</article>
			<?php endif; ?>
		</section>
	</main>
<?php get_footer(); ?>