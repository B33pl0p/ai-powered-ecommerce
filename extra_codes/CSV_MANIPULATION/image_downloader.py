import pandas as pd
import requests
import os
from uuid import uuid4

df = pd.read_csv('/home/saurav/Documents/hamrobazar_dataset/hamrobazar/apparel-accessories.csv')
df['id'] = df.index
image_dir = 'apparels_image_download'
os.makedirs(image_dir, exist_ok=True)


for index, row in df.iterrows():
    product_id = row['id']
    image_url = row['ImageUrl']
    image_name = f"{product_id}.jpg"
    image_path = os.path.join(image_dir, image_name)

    try:
        response = requests.get(image_url)
        response.raise_for_status()
        with open(image_path, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded image for {product_id} to {image_path}")
    except:
        print(f"Error downloading image for {product_id}")