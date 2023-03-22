import mysql.connector
import configparser
import re
import requests
import os
from slugify import slugify
import shutil
import subprocess

config = configparser.ConfigParser()
config.read('config.ini')

prefix = config["default"]["DB_PREFIX"]

cnx = mysql.connector.connect(user=config["default"]["DB_USER"], 
                              password=config["default"]["DB_PASSWORD"],
                              unix_socket=config["default"]["DB_SOCKET"],
                              database=config["default"]["DB_DATABASE"])
cnx.autocommit = True

cursor = cnx.cursor()

query = f"SELECT * FROM {prefix}posts WHERE (post_type='post' OR post_type='page') and post_status='publish'"
cursor.execute(query)
result = cursor.fetchall()

print("Total number of rows in table: ", cursor.rowcount)

cursorLoop = cnx.cursor()

for post in result:

  content = post[4] 
  date = post[2]
  id = post[0]

  search = re.findall(r'src="'+config["default"]["REMOTE_URL_PREFIX"]+'(.*?)"', content)

  for image in search:

    parts = os.path.splitext(image)[0].split("/")
    ext = os.path.splitext(image)[1].strip(".")

    path = config["default"]["IMG_DATA_PATH"] + "/" + parts[0] + "/" + parts[1]
    filename = parts[2]
    slug = slugify(filename)
    guid = config["default"]["LOCAL_URL_PREFIX"]+image

    if not os.path.exists(config["default"]["IMG_DATA_PATH"] + "/" + image):
      
      print(f"Downloading: {image}")

      res = requests.get(config["default"]["REMOTE_URL_PREFIX"] +image, stream=True, headers={'User-agent': 'Mozilla/5.0'})

      if not os.path.exists(path):
        os.makedirs(path)  

      if res.status_code == 200:
        with open(config["default"]["IMG_DATA_PATH"] + "/" + image,'wb') as f:
            shutil.copyfileobj(res.raw, f)

    
    query = f"SELECT post_content, ID FROM {prefix}posts WHERE (post_type='attachment') and guid like '{guid}'"
    cursorLoop.execute(query)
    imageDb = cursorLoop.fetchone()

    if imageDb is None:
      print(f"Inserting: {image}")
      valuesObject = {
        "post_author": post[1],
        "post_date": date,
        "post_date_gmt": date,
        "post_title": filename,
        "post_name": slug,
        "post_modified": date,
        "post_modified_gmt": date,
        "post_parent": id,
        "guid": guid, 
        "post_type": "attachment", 
        "post_mime_type": f'image/{ext}', 
        "post_status": 'inherit', 
        "comment_status": 'closed', 
        "ping_status": 'closed',
        "post_content": "", 
        "post_excerpt": "", 
        "to_ping": "", 
        "pinged": "", 
        "post_content_filtered": "",
      }
      insertQuery = f"INSERT INTO {prefix}posts \
                        ( {', '.join(valuesObject.keys())} ) \
                        VALUES ( { ', '.join(['%s' for i in range(valuesObject.keys().__len__())])  } )  \
                      "
      values = list(valuesObject.values())
      cursorLoop.execute(insertQuery, values)
      last_id = cursorLoop.lastrowid

      insertMetaQuery = f"INSERT INTO {prefix}postmeta \
                        (post_id, meta_key, meta_value) \
                        VALUES ( %s, %s, %s )  \
                      "
      valuesMeta = [last_id, '_wp_attached_file', image ]
      cursorLoop.execute(insertMetaQuery, valuesMeta)
      subprocess.call([os.getcwd()+"/run.sh", f"{last_id}", f'{config["default"]["WEB_ROOT_PATH"]}' ])


cnx.close()