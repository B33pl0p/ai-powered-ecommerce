import streamlit as st
import requests
from PIL import Image
import io

# FastAPI backend URL
FASTAPI_URL = "http://127.0.0.1:4000"

# Function to fetch products
def fetch_products(skip: int, limit: int, random: bool):
    url = f"{FASTAPI_URL}/products"
    params = {"skip": skip, "limit": limit, "random": random}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        st.error(f"Error fetching products: {response.text}")
        return []

# Function to upload image and search
def search_image(image):
    url = f"{FASTAPI_URL}/upload_image"
    files = {"image": image}
    response = requests.post(url, files=files)
    if response.status_code == 200:
        return response.json()
    else:
        st.error(f"Error searching image: {response.text}")
        return None

# Function to search by text
def search_text(query_text):
    url = f"{FASTAPI_URL}/upload_text"
    payload = {"query_text": query_text}
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return response.json()
    else:
        st.error(f"Error searching text: {response.text}")
        return None

# Function to display product details in a clean layout
def display_products(products):
    """
    Display product details in a clean and visually appealing layout.
    """
    if not products:
        st.warning("No products found.")
        return

    for product in products:
        st.markdown("---")
        st.subheader(product["name"])
        col1, col2 = st.columns([1, 3])
        print(product["image_url"])
        with col1:
            # Display the product image
            if product["image_url"]:
                st.image(product["image_url"])
                print(product["image_url"])
          

            else:
                st.warning("No image available")

        with col2:
            # Display product details
            st.write(f"**Category:** {product['category_name']}")
            st.write(f"**Price:** ${product['price']}")
            st.write(f"**Gender:** {product['gender']}")
            st.write(f"**Subcategory:** {product['sub_category']}")
            st.write(f"**Article Type:** {product['article_type']}")
            st.write(f"**Season:** {product['season']}")
            st.write(f"**Year:** {product['year']}")
            st.write(f"**Rating:** {product['rating']}")

# Streamlit UI
st.title("Product Search Interface")

# Sidebar for navigation
st.sidebar.title("Navigation")
option = st.sidebar.radio("Choose an option", ["Fetch Products", "Image Search", "Text Search"])

if option == "Fetch Products":
    st.header("Fetch Products")
    skip = st.number_input("Skip", min_value=0, value=0)
    limit = st.number_input("Limit", min_value=1, value=10)
    random = st.checkbox("Random")
    
    if st.button("Fetch Products"):
        products = fetch_products(skip, limit, random)
        if products:
            st.write("Fetched Products:")
            display_products(products)

elif option == "Image Search":
    st.header("Image Search")
    uploaded_file = st.file_uploader("Upload an image", type=["jpg", "jpeg", "png"])
    
    if uploaded_file is not None:
        image = Image.open(uploaded_file)
        st.image(image, caption="Uploaded Image", use_column_width=True)
        
        if st.button("Search"):
            # Convert the image to bytes
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format="PNG")
            img_byte_arr = img_byte_arr.getvalue()
            
            # Send the image to the FastAPI backend
            result = search_image(img_byte_arr)
            if result and "result" in result:
                st.success("Search Results:")
                display_products(result["result"])
            else:
                st.error("No results found or an error occurred.")

elif option == "Text Search":
    st.header("Text Search")
    query_text = st.text_input("Enter your search query")
    
    if st.button("Search"):
        result = search_text(query_text)
        if result and "result" in result:
            st.success("Search Results:")
            display_products(result["result"])
        else:
            st.error("No results found or an error occurred.")