import torch
from tqdm import tqdm
import os
import clip
from PIL import Image
import pandas as pd
import numpy as np
import pickle
import matplotlib.pyplot as plt

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device = device)

DATA_PATH = '/home/saurav/Documents'
csv_file = DATA_PATH+'/required_dataset/styles2.csv'
df = pd.read_csv(csv_file)

image_folder = DATA_PATH+'/required_dataset/images'
embeddings = {}
batch_size = 8
total_rows = len(df)
checkpoint_file = "clip_embeddings_checkpoint.pkl"
final_embeddings = "clip_embeddings_batch.pkl"

def create_text_description(row):
  columns = [
      str(row['gender']),
      str(row['masterCategory']),
      str(row['subCategory']),
      str(row['articleType']),
      str(row['baseColour']),
      str(row['season']),
      str(row['year']),
      str(row['usage']),
      str(row['productDisplayName'])
  ]
  return ' '.join(columns)

if os.path.exists(checkpoint_file):
    with open(checkpoint_file, 'rb') as f:
        embeddings = pickle.load(f)
    processed_ids = set(embeddings.keys())  
else:
    embeddings = {}
    processed_ids = set()

output_file = "clip_embeddings_checkpoint.pkl"
with open(output_file, 'wb') as f:
    pickle.dump(embeddings, f)

if os.path.exists(checkpoint_file):
    with open(checkpoint_file, 'rb') as f:
        embeddings = pickle.load(f)
    processed_ids = set(embeddings.keys())  

q_text = "men's black tshirt with white strip"
tokenized_q_text = clip.tokenize(q_text).to(device)
with torch.no_grad():
    q_text_embedding = model.encode_text(tokenized_q_text).cpu().numpy()

dataset_ids = list(embeddings.keys())
dataset_text_embeddings = torch.stack(
    [torch.tensor(embeddings[unique_id]['text_embedding']) for unique_id in dataset_ids]
)

dataset_text_embeddings = dataset_text_embeddings / dataset_text_embeddings.norm(dim=-1, keepdim=True)
q_text_embedding = torch.tensor(q_text_embedding)
q_text_embedding = q_text_embedding / q_text_embedding.norm(dim=-1, keepdim=True)

cosine_similarity = torch.matmul(q_text_embedding, dataset_text_embeddings.T).squeeze()

top_k = 5
top_indices = torch.topk(cosine_similarity, k=top_k).indices

for idx in top_indices:
    unique_id = dataset_ids[idx]  #retrieve unique id for this embedding
    unique_image = unique_id + '.jpg'
    similarity_score = cosine_similarity[idx].item()
    print(f"Match ID: {unique_id}, Similarity Score: {similarity_score}")
