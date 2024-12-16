import psycopg2
from psycopg2 import OperationalError
from PIL import Image
from io import BytesIO
import torch
import clip
import numpy as np

# Initialize CLIP model and device
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device)

def get_image_embedding(image_data):
    """Extract image embedding using CLIP."""
    image = Image.open(BytesIO(image_data)).convert("RGB")
    image_input = preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad():
        image_features = model.encode_image(image_input)
        image_features /= image_features.norm(dim=-1, keepdim=True)
    return image_features.cpu().numpy().flatten()

def get_text_embedding(metadata):
    """Extract text embedding using CLIP."""
    text_input = " ".join(metadata)
    tokenized_text = clip.tokenize([text_input]).to(device)
    num_tokens = tokenized_text.shape[-1]

    if num_tokens > 77:
        print(f"Warning: Text input too long ({num_tokens} tokens). Truncating.")
        text_input = " ".join(metadata)[:500]
        tokenized_text = clip.tokenize([text_input]).to(device)

    with torch.no_grad():
        text_features = model.encode_text(tokenized_text)
        text_features /= text_features.norm(dim=-1, keepdim=True)
    return text_features.cpu().numpy().flatten()

def get_last_offset():
    """Fetch last processed offset from the database."""
    cursor.execute("SELECT COALESCE(MAX(last_offset), 0) FROM processing_metadata")
    return cursor.fetchone()[0]

def update_last_offset(offset):
    """Update the last processed offset."""
    cursor.execute("INSERT INTO processing_metadata (last_offset) VALUES (%s)", (offset,))
    connection.commit()

def process_embeddings_in_batches():
    """Fetch and process embeddings in batches."""
    offset = get_last_offset()
    batch_size = 40
    
    while True:
        query = f"""
            SELECT product_id, image_data, base_colour, year, master_category, 
                   product_display_name, rating, article_type, gender, season, 
                   price, sub_category
            FROM products
            LIMIT {batch_size} OFFSET {offset}
        """
        
        cursor.execute(query)
        rows = cursor.fetchall()
        print(f"Fetched {len(rows)} rows from database (Offset: {offset}).")

        if not rows:
            print("No more data to process.")
            break
        
        for row in rows:
            product_id, image_data, base_colour, year, master_category, product_display_name, \
            rating, article_type, gender, season, price, sub_category = row

            image_embedding = get_image_embedding(image_data)
            text_metadata = [
                str(base_colour), str(year), str(master_category), str(product_display_name),
                str(rating), str(gender), str(season), str(price), str(sub_category)
            ]
            text_embedding = get_text_embedding(text_metadata)

            update_query = """
            UPDATE products
            SET image_embedding = %s, text_embedding = %s
            WHERE product_id = %s
            """
            cursor.execute(update_query, (image_embedding.tolist(), text_embedding.tolist(), product_id))
            print(f"Updated embeddings for product_id {product_id}")
            connection.commit()

        offset += batch_size
        update_last_offset(offset)
        print(f"Batch processed. Moving to next batch...\n")

# Connect to PostgreSQL
HOST = "localhost"
PORT = "5432"
USER = "postgres"
PASSWORD = "7878"
DB_NAME = "products_db"

DATABASE_URL = f"dbname={DB_NAME} user={USER} password={PASSWORD} host={HOST} port={PORT}"
print(f"Connecting to database using URL: {DATABASE_URL}")
connection = psycopg2.connect(DATABASE_URL)
cursor = connection.cursor()

# Create metadata table if it doesn't exist
cursor.execute("""
CREATE TABLE IF NOT EXISTS processing_metadata (
    id SERIAL PRIMARY KEY,
    last_offset INT NOT NULL DEFAULT 0
)
""")
connection.commit()

if connection:
    print("Connection established. Starting to process embeddings...")
    process_embeddings_in_batches()
    cursor.close()
    connection.close()
else:
    print("Unable to establish a connection. Exiting...")
