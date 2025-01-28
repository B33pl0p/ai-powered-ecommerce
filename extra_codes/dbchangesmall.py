import psycopg2

def update_image_urls_in_db():
    # Set up the connection to your PostgreSQL database
    conn = psycopg2.connect(
        dbname="products_database",
        user="postgres",
        password="biplop123bB#",
        host="database-products.c9kqgsu44jjh.eu-north-1.rds.amazonaws.com",
        port="5432"
    )

    cursor = conn.cursor()

    try:
        # Query to fetch products where image_url starts with "https://storage.cloud.google.com/"
        cursor.execute("""
            SELECT id, image_url FROM products WHERE image_url LIKE 'https://storage.cloud.google.com/%';
        """)
        
        # Fetch all rows with matching image URLs
        products = cursor.fetchall()

        # Update the image URLs
        for product in products:
            product_id, image_url = product
            updated_image_url = image_url.replace("https://storage.cloud.google.com/", "https://storage.googleapis.com/")

            # Update the image_url in the database
            cursor.execute("""
                UPDATE products
                SET image_url = %s
                WHERE id = %s;
            """, (updated_image_url, product_id))

        # Commit the changes to the database
        conn.commit()

        print(f"Successfully updated {len(products)} image URLs in the database.")
    
    except Exception as e:
        print(f"Error occurred: {e}")
        conn.rollback()  # In case of error, rollback the transaction
    
    finally:
        # Close the database connection
        cursor.close()
        conn.close()

# Call the function to update the image URLs
update_image_urls_in_db()
