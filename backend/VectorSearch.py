import psycopg2
import numpy as np

# PostgreSQL Connection Details
DB_CONFIG = {
    "dbname": "products_db",
    "user": "postgres",
    "password": "7878",
    "host": "localhost",
    "port": "5432",
}

def search_by_image_embedding(image_embedding, limit=10):
    """Search in PostgreSQL using image embedding."""
    return _search_in_postgresql(image_embedding, "image_embedding", "image_embedding_idx", limit)

def search_by_text_embedding(text_embedding, limit=10):
    """Search in PostgreSQL using text embedding."""
    return _search_in_postgresql(text_embedding, "text_embedding", "text_embedding_idx", limit)

def _search_in_postgresql(query_vector, search_column, index_name, limit):
    """Internal function for searching in PostgreSQL using pgvector."""
    # Connect to PostgreSQL
    connection = psycopg2.connect(**DB_CONFIG)
    cursor = connection.cursor()

    # Convert the query vector to a string formatted as a PostgreSQL array
    query_vector_str = "{" + ",".join(map(str, query_vector)) + "}"

    # Vector similarity search query using pgvector
    search_query = f"""
    SET LOCAL enable_indexscan = true;  -- Enable index scan for better performance with indexes.
    SET LOCAL enable_bitmapscan = false;  -- Disable bitmap scan to force usage of index (optional)
    
    SELECT product_id, 
           1 - ({search_column} <=> %s::vector) AS similarity
    FROM products
    WHERE {search_column} IS NOT NULL
    ORDER BY {search_column} <=> %s::vector
    LIMIT %s;
    """

    # Execute the query
    cursor.execute(search_query, (query_vector.tolist(), query_vector.tolist(), limit))
    rows = cursor.fetchall()

    # Process results
    processed_results = [
        {"product_id": row[0], "similarity": row[1]} for row in rows
    ]

    # Print results for debugging
    #print(processed_results)

    # Close the connection
    cursor.close()
    connection.close()

    return processed_results
