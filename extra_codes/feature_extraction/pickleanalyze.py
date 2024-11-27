import pickle
import numpy as np
import os
# Load the pickle file
# with open('/home/biplop/majorproject/image_features.pkl', 'rb') as f:
#     data = pickle.load(f)
# image_names = list(data.keys())
# for i, (image_name, feature_vector) in enumerate(data.items()):
#     print(f"Image Name: {image_name}")
#     print(f"Feature Vector (first 10 elements): {feature_vector[:10]}")  # Print first 10 elements of the vector for brevity
#     print()
#     if i == 4:  # Display only the first 5 entries
#         break

pickle_file_path = '/home/biplop/majorproject/image_features.pkl'

with open(pickle_file_path, 'rb') as f:
    image_features = pickle.load(f)

print(f"Loaded {len(image_features)} image features from the pickle file.")

image_features_cleaned = {os.path.splitext(image_name)[0]: vector for image_name, vector in image_features.items()}

# List of cleaned image names (primary keys without '.jpg')
image_names = list(image_features_cleaned.keys()) 

# Feature vectors as numpy array
feature_vectors = np.array(list(image_features_cleaned.values())).astype('float32')

print(f"Extracted {len(image_names)} image names and corresponding feature vectors without '.jpg' extensions.")

# Save the updated pickle file with cleaned image names
with open('image_feature_vectors_cleaned.pkl', 'wb') as f:
    pickle.dump(image_features_cleaned, f)

print("Saved the updated pickle file with cleaned image names (no '.jpg').")