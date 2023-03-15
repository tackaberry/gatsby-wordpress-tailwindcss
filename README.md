# Gatsby + Wordpress + Tailwindcss

## Frontend

Built with [Gatsby](https://www.gatsbyjs.com/) and [Tailwind CSS](https://tailwindcss.com/). 

### Install dependencies
```
npm install -g gatsby
```

### Create `.env.development`
```
WORDPRESS_GRAPHQL_URL=http://testing.local/graphql
SITE_URL=http://localhost:8000
CAREERS_API_URL=https://api.hrplatform.com/company/postings
CAREERS_LINK=https://www.hrplatform.com/company/

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

This plugin needs to be added to Wordpress CMS. The file `plugin.zip` in a zip of a php file containing the code below.  Add this plugin through the Wordpress admin console. 

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

## Careers

In addition to Wordpress, a careers job portal data feed is pulled in to GraphQL on build. The data can then used to prebuild a list of links to job postings. 


## Special hooks for content in wordpress

Replacement [shortcodes](https://www.smashingmagazine.com/2012/05/wordpress-shortcodes-complete-guide/) are configured to help content editors access some functionality. For example, drop a list of job postings, or list of blog categories.  While some wordpress widgets do work, there may be some front end functionality required that needs something more like a shortcode replacement. 

Shortcodes should be added as paragraph text in the Wordpress editor like `[careers]`. 

Shortcodes configured are:
- Careers - `[careers]` - list of job postings from HR supplier (in most cases, not Wordpress). 
- Categories  - `[categories]` - list of wordpress blog categories. 
