# app/reverse_image_search_app.py

import streamlit as st
from PIL import Image
from feature_extractor import FeatureExtractor
from db_query import DatabaseQuery
import os
import pyperclip
import base64
import io

class ReverseImageSearchApp:
    def __init__(self, db_config, faiss_index_path, pickle_path, nprobe=10):
        # Initialize the feature extractor and database query objects
        self.extractor = FeatureExtractor()
        self.db_query = DatabaseQuery(db_config,faiss_index_path,pickle_path,nprobe)
    
    def image_from_clipboard(self):
        clipboard_data = pyperclip.paste()  # clipboard content
        try:
            # Check if the clipboard data is base64-encoded (common for images)
            if clipboard_data.startswith('data:image'):
                header, base64_data = clipboard_data.split(',', 1)
                image_data = base64.b64decode(base64_data)
                image = Image.open(io.BytesIO(image_data))  # Convert to image
                return image
        except Exception as e:
            st.error(f"Error: {str(e)}")
        return None    

    def run(self):
        #st.title("Reverse Image Search")

        # Upload an image through Streamlit's uploader widget
        uploaded_image = st.file_uploader("Upload an image", type=["jpg", "png", "jpeg","webp"])
        
        if st.button("Upload Image from Clipboard"):
            clipboard_image = self.image_from_clipboard()
            if clipboard_image is not None:
                image = clipboard_image
                st.image(image, caption="Image from Clipboard", width=300)
            else:
                st.warning("No image found in clipboard.")

        if uploaded_image is not None:
            # Display the uploaded image
            image = Image.open(uploaded_image) if uploaded_image else clipboard_image
            st.image(image, caption="Uploaded Image", width=300 )

            # Extract features using FeatureExtractor
            #st.write("Extracting features...")
            query_features = self.extractor.extract_features(uploaded_image)
            
            st.write("Features extracted!")

            # Query the FAISS index
            #st.write("Searching the database...")
            image_id , distances = self.db_query.similar_search(query_features, k=5)
            
            st.write(f"Top matches (image IDs): {image_id}")
            st.write(f"Distances: {distances}")
            
            num_cols = 4  # Number of columns to display in the grid
            cols = st.columns(num_cols)  # Create 3 columns

            for idx, i in enumerate(image_id):
                result = self.db_query.query_database(i)
                if result:
                    product_details = self.db_query.unpack_result(result)
                    if product_details:
                        # Place each product's details in the appropriate column
                        col_idx = idx % num_cols
                        with cols[col_idx]:  # Work within the selected column
                            # Use st.container to group the image and details
                            with st.container():
                                # Display product image
                                image_path = product_details["Image Path"]
                                if os.path.exists(image_path):
                                    st.image(image_path, caption=f"Product ID: {product_details['Product ID']}", use_column_width=True)
                                else:
                                    st.write(f"Image not found for {image_id}")

                                # Display product details below the image in the same column
                                st.write(f"**Category**: {product_details['Category']}")
                                st.write(f"**Sub-category**: {product_details['Sub-category']}")
                                st.write(f"**Type**: {product_details['Type']}")
                                st.write(f"**Brand**: {product_details['Brand']}")
                                st.write(f"**Season**: {product_details['Season']}")
                                st.write(f"**Year**: {product_details['Year']}")
                                st.write(f"**Description**: {product_details['Description']}")
                                st.write(f"**Price**: {product_details['Price']}")
                                st.write(f"**Rating**: {product_details['Rating']}")

                                st.markdown("<div style='margin-bottom: 30px;'></div>", unsafe_allow_html=True)

                                st.divider()

                else:
                    st.write(f"No data found for image ID: {image_id}.")