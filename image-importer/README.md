# Importer

This script downloads images from a live site, puts them in a local site. It also creates `post` and `post_meta` entries.  It also uses `wp-cli` to regenerate thumbnails. 


```
[default]

DB_USER=user
DB_PASSWORD=password
DB_DATABASE=database
DB_SOCKET=/path/to/mysqld.sock
DB_PREFIX=wp_nnnnnnnnnn_

REMOTE_URL_PREFIX=https://www.example.com/wp-content/uploads/
LOCAL_URL_PREFIX=http://website.local/wp-content/uploads/

IMG_DATA_PATH=/path/to/wp-content/uploads

```