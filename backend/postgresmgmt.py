import psycopg2
import os
conn = psycopg2.connect(
    host="localhost", 
    database="products_db", 
    user="postgres", 
    password="7878"
)
cursor = conn.cursor()
cursor.execute("SELECT product_id, image_path FROM products WHERE image_path IS NOT NULL;")
records = cursor.fetchall()

image_folder = "data/images"

# Fetch products with images
cursor.execute("SELECT product_id FROM products WHERE image_path IS NOT NULL;")
product_ids = cursor.fetchall()

for (product_id,) in product_ids:
    image_file = os.path.join(image_folder, f"{product_id}.jpg")
    
    if os.path.exists(image_file):
        with open(image_file, "rb") as img_file:
            binary_data = img_file.read()

        # Update database with binary image data
        cursor.execute(
            "UPDATE products SET image_data = %s WHERE product_id = %s;",
            (binary_data, product_id)
        )
        print(f"Inserted image for product ID: {product_id}")
    else:
        print(f"Image not found for product ID: {product_id}")

conn.commit()
cursor.close()
conn.close()
