import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
import numpy as np
import os

# Load the pre-trained model
model = MobileNetV2(weights='imagenet')

def classify_image(img_path):
    try:
        img = image.load_img(img_path, target_size=(224, 224))
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)

        preds = model.predict(x)
        print('Predicted:', decode_predictions(preds, top=3)[0])
    except Exception as e:
        print(f"Error in classifying image: {e}")


img_path = 'C:\\Users\\Biplop\\Downloads\\abc.jpg'
if os.path.exists(img_path):
    classify_image(img_path)
else:
    print(f"Image not found at path: {img_path}")
