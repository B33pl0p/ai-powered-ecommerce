# main.py

from app import ReverseImageSearchApp

# Database configuration
db_config = {
    'dbname': 'fashion_db',
    'user': 'postgres',
    'password': '7878',
    'host': 'localhost',
    'port': '5432'
}

# FAISS index and pickle paths
faiss_index_path = "faiss_ivf_hnsw.index"
pickle_path = "faiss_id_to_image_map.pkl"

# nprobe (number of clusters to search) set for IVF
nprobe = 10

if __name__ == "__main__":
    app = ReverseImageSearchApp(db_config, faiss_index_path, pickle_path, nprobe)
    app.run()
