# Reverse Image Search App

Welcome to the **Reverse Image Search App**! This project allows users to upload an image and find visually similar images along with detailed information about them. It combines advanced machine learning and efficient database querying to provide fast and accurate results.

---

## Features

- Upload an image and find visually similar ones.
- View metadata such as category, description, price, and more.
- Mobile-friendly interface for seamless interaction.
- Scalable backend to handle large datasets.

---

## Installation

### Backend

1. Clone the repository:
- `` git clone https://github.com/B33pl0p/ai-powered-ecommerce.git``
- `` cd ai-powered-ecommerce ``

2. Set up the PostgreSQL database:
(The database will be hosted later in a server and made globally available)
Until then : 
   - Create a database named `products_db`.
   - Update the database credentials in `db_config` inside  and `main.py` of backend.
   - Import the schema given in the database folder into the database.

3. Install dependencies for backend:
   -``cd backend``
  - ``pip install -r requirements.txt``
  - run the FastApi server by ` uvicorn main:app --port 4000 --host 0.0.0.0 --reload`
 - replace the port name by your desired port

4. Setup React Native in your PC  
  - then `cd mobile_app`
   -install dependencies by running `npm install`
  - replace the ip address given in components/Ipaddresses.jsx with your PC ip
  - run app in emulator or android device by `npm run start` and choosing a desired method

## How It Works

1. **Image Upload**:
   - Users upload an image via the mobile app.
2. **Feature Extraction**:
   - The backend extracts unique features using the **CLIP** model.
3. **Similarity Search**:
   -Uses pgvector as vector database to perform similarity search
4. **Metadata Retrieval**:
   - Additional details about the images are fetched from the database.
5. **Results Display**:
   - The app presents similar images along with their metadata.

---








