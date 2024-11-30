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

    def find_best_match(self,query_text, embeddings):
        device = "cuda" if torch.cuda.is_available() else "cpu"
        model, preprocess = clip.load("ViT-B/32", device=device)
    # Tokenize the user query and encode it using CLIP
        tokenized_q_text = clip.tokenize([query_text]).to(device)
        with torch.no_grad():
            q_text_embedding = model.encode_text(tokenized_q_text).cpu().numpy()

        # Ensure the query embedding is a tensor and normalize it
        q_text_embedding = torch.tensor(q_text_embedding).to(device)
        q_text_embedding = q_text_embedding / q_text_embedding.norm(dim=-1, keepdim=True)

        # Create a tensor for all stored text embeddings
        dataset_ids = list(embeddings.keys())
        dataset_text_embeddings = torch.stack(
            [torch.tensor(embeddings[unique_id]['text_embedding']).to(device) for unique_id in dataset_ids]
        )

        # Normalize dataset embeddings
        dataset_text_embeddings = dataset_text_embeddings / dataset_text_embeddings.norm(dim=-1, keepdim=True)

        # Compute cosine similarity between the query and all dataset text embeddings
        cosine_similarity = torch.matmul(q_text_embedding, dataset_text_embeddings.T).squeeze()

        # Get the top-k matching indices (e.g., top 5 matches)
        top_k = 5
        top_indices = torch.topk(cosine_similarity, k=top_k).indices

        # Return the top matches (image names and similarity scores)
        matches = []
        for idx in top_indices:
            unique_id = dataset_ids[idx]  # Retrieve unique id for this embedding
            similarity_score = cosine_similarity[idx].item()
            matches.append((unique_id, similarity_score))

        return matches