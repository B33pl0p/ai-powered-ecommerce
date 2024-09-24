import os
import hashlib
from PIL import Image
from tqdm import tqdm

def calculate_md5(file_path):
    """
    Calculate the MD5 hash of a file.
    
    Args:
        file_path (str): Path to the file.
        
    Returns:
        str: MD5 hash of the file.
    """
    with open(file_path, 'rb') as f:
        file_hash = hashlib.md5()
        while chunk := f.read(8192):
            file_hash.update(chunk)
    return file_hash.hexdigest()

def get_image_metadata(image_path):
    """
    Get metadata of an image (file size, dimensions, and MD5 hash).
    
    Args:
        image_path (str): Path to the image.
        
    Returns:
        tuple: (file_size, dimensions, md5_hash)
    """
    file_size = os.path.getsize(image_path)  # File size in bytes
    image = Image.open(image_path)
    dimensions = image.size  # (width, height)
    md5_hash = calculate_md5(image_path)  # MD5 hash of the file
    return file_size, dimensions, md5_hash

def find_duplicates_by_metadata(folder_path):
    """
    Find duplicate images in a folder by comparing metadata (file size, dimensions, and MD5 hash).
    
    Args:
        folder_path (str): Path to the folder containing images.
        
    Returns:
        List of tuples (image1, image2) that are considered duplicates.
    """
    image_metadata = {}
    duplicates = []

    # Iterate through all images in the folder and collect metadata
    for image_name in tqdm(os.listdir(folder_path), desc="Processing Images"):
        image_path = os.path.join(folder_path, image_name)
        
        if image_name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            try:
                metadata = get_image_metadata(image_path)
                if metadata in image_metadata.values():
                    # If the metadata matches, it's a duplicate
                    original_image = list(image_metadata.keys())[list(image_metadata.values()).index(metadata)]
                    duplicates.append((original_image, image_name))
                    print(f"Duplicate found: {original_image} and {image_name}")
                else:
                    image_metadata[image_name] = metadata
            except Exception as e:
                print(f"Error processing {image_name}: {e}")
    
    return duplicates

# Example usage
folder_path = 'data/images'
duplicates = find_duplicates_by_metadata(folder_path)

if duplicates:
    print(f"Found {len(duplicates)} duplicate image pairs:")
    for image1, image2 in duplicates:
        print(f"Duplicate Pair: {image1} and {image2}")
else:
    print("No duplicates found.")
