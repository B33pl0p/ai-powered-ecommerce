import torch
import clip
from PIL import Image
import numpy as np

class FeatureExtractor:
    def __init__(self):
        # Load the CLIP model and its preprocessing pipeline
        #device = "cuda" if torch.cuda.is_available() else "cpu"
        device = "cpu"
        self.device = device
        self.model, self.preprocess = clip.load("ViT-B/32", device=self.device)
        self.model.eval()  # Set the model to evaluation mode

    def extract_features(self, image_path):
        """
        Extract feature vectors from an image using CLIP.
        
        Args:
            image_path (str): Path to the input image.
        
        Returns:
            np.ndarray: Feature vector extracted from the image as a NumPy array.
        """
        # Load and preprocess the image
        image = Image.open(image_path)
        image_tensor = self.preprocess(image).unsqueeze(0).to(self.device)  # Preprocess and add batch dimension

        # Extract features using CLIP
        with torch.no_grad():
            features = self.model.encode_image(image_tensor).squeeze()  # Get features and remove batch dim
        
        # Convert the feature tensor to NumPy array and return it
        feature_vector = features.cpu().numpy()
        return np.array([feature_vector]).astype('float32')
#####RESNET FEATURE BACKUP#####
# import numpy as np
# import torch
# from torchvision import models, transforms
# from PIL import Image

# class FeatureExtractor:
#     def __init__(self):
#         # Load pre-trained ResNet50 model
#         self.model = models.resnet50(pretrained=True)
#         self.model.eval()  # Set the model to evaluation mode
        
#         # Remove the final classification layer
#         self.model = torch.nn.Sequential(*(list(self.model.children())[:-1]))

#         # Define image preprocessing
#         self.preprocess = transforms.Compose([
#             transforms.Resize(256),
#             transforms.CenterCrop(224),
#             transforms.ToTensor(),
#             transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
#         ])

#     def extract_features(self, image_path):
#         # Load and preprocess the image
#         image = Image.open(image_path)
#         image_tensor = self.preprocess(image).unsqueeze(0)  # Add batch dimension
        
#         # Extract features
#         with torch.no_grad():
#             features = self.model(image_tensor).squeeze()  # Get features and remove batch dim
#         intermediate_features = features.cpu().numpy()  # Return features as a NumPy array
#         return np.array([intermediate_features]).astype('float32')