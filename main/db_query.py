# core/database_query.py

import faiss
import numpy as np
import pickle
import os
import psycopg2

class DatabaseQuery:
    def __init__(self,db_config, index_path="faiss_ivf_hnsw.index", pickle_path="faiss_id_to_image_map.pkl",nprobe=10):
        # Load the FAISS index
        self.index = faiss.read_index(index_path)
        self.index.nprobe = nprobe
        
        with open(pickle_path, "rb") as f:
            self.faiss_id_to_image_name = pickle.load(f)
        
        #database config
        
        self.db_config = db_config 
    
    def similar_search(self,query_features,k=5):
        distances, indicies = self.index.search(query_features,k)
        image_id = [self.faiss_id_to_image_name[idx] for idx in indicies[0] ]
        return image_id, distances[0]
    
    def query_database(self, image_id):
        conn = psycopg2.connect(**self.db_config)
        cur = conn.cursor()
        
        query = "SELECT * FROM products WHERE product_id = %s;"
        cur.execute(query,(image_id,))
        result = cur.fetchone()
        cur.close()
        conn.close()
        
        return result
    
    def unpack_result(self,result):
        if result:
            (product_id, category, sub_category, type_, brand, _, season, year, 
             description, image_path, price, rating) = result
        
            product_details = {
                "Product ID": product_id,
                "Category": category,
                "Sub-category": sub_category,
                "Type": type_,
                "Brand": brand,
                "Season": season,
                "Year": year,
                "Description": description,
                "Price": f"${price}",
                "Rating": f"{rating}/5",
                "Image Path": image_path
            }
            return product_details   
        else:
            return None 