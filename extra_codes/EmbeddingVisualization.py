import psycopg2
import numpy as np
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

# Step 1: Retrieve embeddings from PostgreSQL
def fetch_embeddings_from_postgres():
    # Database connection details
    conn = psycopg2.connect(
        dbname="products_db",
        user="postgres",
        password="7878",
        host="localhost",
        port="5432"
    )
    cursor = conn.cursor()

    # Query to fetch embeddings
    query = "SELECT image_embedding FROM products"
    cursor.execute(query)

    # Fetch embeddings and convert to NumPy array
    rows = cursor.fetchall()

    # Check if there are any rows retrieved
    if not rows:
        print("No rows found in the database.")
        return np.array([])

    embeddings = []
    embedding_length = None  # To store the length of the first embedding

    # Convert valid embeddings to NumPy array (exclude None values)
    for row in rows:
        if row[0] is not None:
            embedding = list(row[0])

            # Check if the embedding has the expected length (e.g., 256)
            if embedding_length is None:
                embedding_length = len(embedding)
            elif len(embedding) != embedding_length:
                print(f"Warning: Embedding with inconsistent size found, skipping it (size: {len(embedding)})")
                continue

            embeddings.append(embedding)

    # If no valid embeddings were found
    if not embeddings:
        print("No valid embeddings found.")
        return np.array([])

    embeddings = np.array(embeddings)

    # Close the connection
    cursor.close()
    conn.close()

    return embeddings

# Step 2: Reduce dimensions using PCA
def reduce_dimensions_with_pca(embeddings, n_components=2):
    if embeddings.size == 0:
        print("No embeddings available for PCA.")
        return None

    pca = PCA(n_components=n_components)
    reduced_embeddings = pca.fit_transform(embeddings)
    return reduced_embeddings

# Step 3: Visualize reduced embeddings using Matplotlib
def plot_embeddings(embeddings_2d, labels=None):
    if embeddings_2d is None or embeddings_2d.size == 0:
        print("No data to plot.")
        return

    plt.figure(figsize=(10, 10))

    # Create scatter plot
    scatter = plt.scatter(
        embeddings_2d[:, 0],
        embeddings_2d[:, 1],
        c=labels if labels is not None else 'blue',
        cmap='viridis',
        s=10
    )

    # Optional: Add colorbar if labels are provided
    if labels is not None:
        plt.colorbar(scatter, label="Labels")

    # Set plot title and axis labels
    plt.title("2D Visualization of Embeddings (PCA)")
    plt.xlabel("Principal Component 1")
    plt.ylabel("Principal Component 2")
    plt.grid(True)
    plt.show()

# Main function
if __name__ == "__main__":
    # Step 1: Fetch embeddings
    embeddings = fetch_embeddings_from_postgres()

    # If no valid embeddings, exit early
    if embeddings.size == 0:
        print("Exiting due to lack of valid embeddings.")
    else:
        # Step 2: Perform PCA for dimensionality reduction
        embeddings_2d = reduce_dimensions_with_pca(embeddings, n_components=2)

        # Step 3: Plot the reduced embeddings
        plot_embeddings(embeddings_2d, labels=None)
