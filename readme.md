# Reverse Image Search using FAISS, CLIP, and PostgreSQL

This repository contains a **reverse image search** engine that uses **FAISS** for feature-based similarity search, **CLIP** for image feature extraction, and **PostgreSQL** for product metadata storage. The system allows users to upload an image, extract its features using CLIP, and find the most visually similar products in a product database.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Requirements](#requirements)

## Introduction

This project implements a reverse image search engine. By leveraging **CLIP** (Contrastive Language-Image Pretraining) for feature extraction, the **FAISS** library for efficient nearest-neighbor search, and a **PostgreSQL** database for storing product details, the system allows users to:
- Upload an image.
- Extract feature vectors from the uploaded image using CLIP.
- Perform a nearest-neighbor search using FAISS to find visually similar products.
- Query product details from a PostgreSQL database.
- Display results, including product information such as category, brand, and image, using a web-based interface (Streamlit or Flask).

## Features

- **CLIP-based Feature Extraction**: Extracts meaningful feature vectors from images using the pre-trained CLIP model.
- **FAISS-based Feature Search**: Finds the top-k visually similar products based on CLIP features.
- **PostgreSQL Integration**: Retrieves detailed product information based on the search results.
- **Image Upload and Display**: Allows users to upload images and view visually similar products.
- **Distance-based Filtering**: Filters out near-duplicate results based on feature distance threshold.
- **Duplicate Product Handling**: Skips duplicate products with the same metadata (except year or minor differences).

## Requirements

- Python 3.x
- PostgreSQL
- FAISS
- CLIP
- Streamlit (or Flask if applicable)
- Other libraries:
  - `psycopg2`
  - `pandas`
  - `numpy`
  - `PIL`
  - `tqdm`


