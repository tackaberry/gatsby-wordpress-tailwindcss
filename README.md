# Gatsby + Wordpress + Tailwindcss

## Frontend

Built with [Gatsby](https://www.gatsbyjs.com/) [Tailwind CSS](https://tailwindcss.com/). 

### Install dependencies
```
npm install -g gatsby
```

### Create `.env.development`
```
WORDPRESS_GRAPHQL_URL=http://testing.local/graphql
SITE_URL=http://localhost:8000
```

### Get started 
```
npm install
```

### Run
```
gatsby develop
```

## Set up wordpress

### Getting started

Set up local wordpress instance with [https://localwp.com/](https://localwp.com/)

### Plugins

- [WPGatsby](https://wordpress.org/plugins/wp-gatsby/)
- [WPGraphQL](https://wordpress.org/plugins/wp-graphql/)

### Plugin to expose navigation to wpgraphql

```php

<?php

/*
 * Plugin Name: Public Menu
 */

add_filter( 'register_post_type_args', function( $args, $post_type ) {
  if ( 'wp_navigation' === $post_type ) {
    $args['show_in_graphql'] = true;
    $args['graphql_single_name'] = 'navigation';
    $args['graphql_plural_name'] = 'navigations'; 
  }

  return $args;

}, 10, 2 );

add_filter( 'graphql_data_is_private', function( $is_private, $model_name, $data, $visibility, $owner, $current_user ) {
	if ( 'wp_navigation' === $data->post_type ) {
		return false;
	}
	
	return $is_private;

}, 10, 6 );

```