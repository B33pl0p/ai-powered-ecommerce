# Reverse Image Search App

Welcome to the **Reverse Image Search App**! This project allows users to upload an image and find visually similar images along with detailed information about them. It combines advanced machine learning and efficient database querying to provide fast and accurate results.

---

## Features

- Upload an image and find visually similar ones.
- View metadata such as category, description, price, and more.
- Mobile-friendly interface for seamless interaction.
- Scalable backend to handle large datasets.

---

## How It Works

1. **Image Upload**:
   - Users upload an image via the mobile app.
2. **Feature Extraction**:
   - The backend extracts unique features using the **CLIP** model.
3. **Similarity Search**:
   - A FAISS index is queried to find the closest matches.
4. **Metadata Retrieval**:
   - Additional details about the images are fetched from the database.
5. **Results Display**:
   - The app presents similar images along with their metadata.

---

## Technologies Used

### Backend

- **Python** and **Flask** for API and server.
- **CLIP** for extracting image features.
- **FAISS** for fast similarity search.
- **PostgreSQL** for storing image metadata.

### Frontend

- **React Native** for the mobile app.
- Clean and intuitive UI components for smooth user experience.

---

## Screenshots

(Add screenshots of the app and its features here)

- **Home Screen**:
  ![Home Screen](placeholder-for-image)

- **Image Picker**:
  ![Image Picker](placeholder-for-image)

- **Results Screen**:
  ![Results Screen](placeholder-for-image)

---

## Installation

### Backend

1. Clone the repository:
   git clone https://github.com/your-repo-name.git
   cd backend

2. Install dependencies:
   pip install -r requirements.txt

3. Set up the PostgreSQL database:
   - Create a database named `fashion_db`.
   - Update the database credentials in `db_config` inside `app.py` and `main.py`.
   - Import the schema given in the database folder into the database.

4. Ensure FAISS index and metadata files are available:
   - Place the `faiss_ivf_hnsw.index` and `faiss_id_to_image_map.pkl` files in the root directory.
   - Update the paths in `app.py`.

5. Run the backend server:
   python app.py

---

### Frontend

1. Navigate to the mobile app directory:
   cd EcommerceApp

2. Install dependencies:
   npm install

3. Run the app:
   npm start

4. Use an emulator or physical device to test the app

5. The App should run fine but dont fogret to change the necessary IP addresses inside the mobile app and the backend

