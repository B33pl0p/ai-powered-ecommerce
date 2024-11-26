import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

from feature_extractor import FeatureExtractor
from db_query import DatabaseQuery

# Initialize the feature extractor and database query objects
db_config = {
    'dbname': 'fashion_db',
    'user': 'postgres',
    'password': '7878',
    'host': 'localhost',
    'port': '5432'
}
faiss_index_path = "faiss_ivf_hnsw.index"
pickle_path = "faiss_id_to_image_map.pkl"
nprobe = 10

extractor = FeatureExtractor()
db_query = DatabaseQuery(db_config, faiss_index_path, pickle_path, nprobe)

# Temporary folder to store the uploaded image for processing
TEMP_FOLDER = './tmp'

# Folder where the similar images from the FAISS index are stored
#IMAGE_FOLDER = os.path.abspath('./data/images')  # Use absolute path
IMAGE_FOLDER = '/home/biplop/ai-powered-ecommerce/database/data/images/'

# Ensure the temporary folder exists
if not os.path.exists(TEMP_FOLDER):
    os.makedirs(TEMP_FOLDER)
    print(f"Temporary folder created at {TEMP_FOLDER}")
    
# Ensure the image folder exists
if not os.path.exists(IMAGE_FOLDER):
    print(f"Error: Image folder {IMAGE_FOLDER} does not exist!")
else:
    print(f"Serving images from {IMAGE_FOLDER}")

@app.route('/')
def home():
    return "Flask server is running!"    

@app.route('/images/<filename>')
def serve_image(filename):
    image_path = os.path.join(IMAGE_FOLDER, filename)
    print(f"Trying to serve image from: {image_path}")
    
    if os.path.exists(image_path):
        return send_from_directory(IMAGE_FOLDER, filename)
    else:
        print(f"Image not found: {image_path}")
        return "Image not found", 404

@app.route('/upload', methods=['POST'])
def search_image():
    print("Received an upload request.")

    # Get the image file from the request
    image = request.files.get('image')
    
    if image is None:
        print("No image uploaded.")
        return jsonify({'error': 'No image uploaded'}), 400

    # Save the image temporarily in the TEMP_FOLDER
    temp_image_path = os.path.join(TEMP_FOLDER, image.filename)
    image.save(temp_image_path)
    print(f"Image saved temporarily to {temp_image_path}")

    # Extract features using FeatureExtractor
    try:
        print("Extracting features from the uploaded image...")
        query_features = extractor.extract_features(temp_image_path)
        print(f"Features extracted successfully. Shape: {query_features.shape}")
    except Exception as e:
        print(f"Error during feature extraction: {e}")
        return jsonify({'error': 'Feature extraction failed'}), 500

    # Query the FAISS index
    try:
        print("Querying the FAISS index for similar images...")
        image_ids, distances = db_query.similar_search(query_features, k=20)
        print(f"FAISS search completed. Found {len(image_ids)} similar images.")
    except Exception as e:
        print(f"Error during FAISS search: {e}")
        return jsonify({'error': 'FAISS search failed'}), 500

    # Fetch details for the top similar images (returning image URLs)
    results = []
    try:
        for idx, img_id in enumerate(image_ids):
            result = db_query.query_database(img_id)
            if result:
                product_details = db_query.unpack_result(result)
                product_details['distance'] = float(distances[idx])
                
                # Construct the image URL for images stored in the main/data/images folder
                image_filename = f"{img_id}.jpg"  # Assuming image files are named by their IDs
                product_details['image_url'] = f"http://192.168.107.216:5000/images/{image_filename}"
                
                results.append(product_details)
        print(f"Fetched and returned details for {len(results)} images.")
    except Exception as e:
        print(f"Error fetching image details from the database: {e}")
        return jsonify({'error': 'Database query failed'}), 500

    # Optionally: Remove the temporarily saved image after processing
    if os.path.exists(temp_image_path):
        os.remove(temp_image_path)
        print(f"Temporary image {temp_image_path} deleted.")

    # Return the results as JSON, including both image URLs and information from the database
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)