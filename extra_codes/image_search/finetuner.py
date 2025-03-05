from tqdm import tqdm
import os
import clip
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from transformers import CLIPProcessor, CLIPModel
from PIL import Image, UnidentifiedImageError

#loading CLIP MODEL and preprocessing funciton
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)


DATA_PATH = 'F:\Biplop\CLIP_Training/'
image_folder = DATA_PATH+'required_dataset/images'
text_file = DATA_PATH+'required_dataset/styles2.csv'
df = pd.read_csv(text_file)
total_rows = len(df)
batch_size = 4
embeddings = {}

def generate_description(row):
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


#custom dataset loader creation
class ImageTextDataset(torch.utils.data.Dataset):
    def __init__(self, image_paths, texts, preprocess):
        self.image_paths = image_paths
        self.texts = texts  #list of the corresponding texts
        self.preprocess = preprocess  #The CLIP processor

    def __len__(self):
        return len(self.texts)   #number of samples in the dataset

    def __getitem__(self, idx):
        image_path = self.image_paths[idx]
        if not os.path.exists(image_path):
            print(f"Warning: image file {image_path} not found. Skipping this image")
            return None


        try:
            image = Image.open(image_path)  # Try to open the image
            image.verify()  # Verify that it's a valid image
            image = Image.open(image_path)  # Reopen the image after verification (to load it properly)
        except (UnidentifiedImageError, OSError) as e:
            print(f"Warning: corrupted or invalid image file {image_path}. Skipping this image.")
            return None

        # image = Image.open(image_path)    #open image
        text = self.texts[idx]                       #get corresponding text
        #inputs = self.preprocess(text=[text], images=image, return_tensors="pt", padding=True)
        text_inputs = clip.tokenize([text]).squeeze(0).to(device)
        image_inputs = self.preprocess(image).to(device)
       
        return{'image': image_inputs, 'text': text_inputs}    #return processed image-text pair
    
#Creating the dataset with valid image-text pair only
if 'valid_image_paths' not in globals():
    valid_image_paths = []

if 'valid_texts' not in globals():
    valid_texts = []
#creating a DataLoader
    
batch = df.iloc[0:total_rows]
image_id = [str(row['id']) for _,row in batch.iterrows()]
image_paths = [os.path.join(image_folder, f"{image_id}.jpg") for image_id in image_id]
texts = [generate_description(row) for _, row in batch.iterrows()]

for idx in range(len(image_paths)):
    image_path = image_paths[idx]
    try:        
        image = Image.open(image_path)
        image.verify()  # Verify that it's a valid image
        image = Image.open(image_path)  # Reopen after verification to load it properly
    except (UnidentifiedImageError, OSError) as e:
        print(f"Warning: corrupted or invalid image file {image_path}. Skipping this image.")
        continue  # Skip the invalid image and text pair
    valid_image_paths.append(image_paths[idx])
    valid_texts.append(texts[idx])

dataset = ImageTextDataset(valid_image_paths, valid_texts, preprocess)   #create dataset
dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True) #create DataLoader  


#setting up training process
optimizer = torch.optim.AdamW(model.parameters(), lr=5e-5)  
loss_fn = nn.CrossEntropyLoss()  



#training the model
model.to(device)  #move model to correct model
model.train()  #set model to training mode

num_epoch = 20

for epoch in tqdm(range(num_epoch)):
    for batch in tqdm(dataloader):
        if not batch:   #skip empty batch
            continue
        optimizer.zero_grad()  #reset gradients

        inputs = {k: v.to(device) for k,v in batch.items() if v is not None}  #move batch to GPU/CPU
        image_features, text_features = model(**inputs)  #forward pass
        
        logits_per_image = (image_features @ text_features.T)  #image-text similarity score
        logits_per_text = logits_per_image.T  #text-image similarity score

        ground_truth = torch.arange(len(logits_per_image), device=device)  #create labels
        loss = (loss_fn(logits_per_image, ground_truth) + loss_fn(logits_per_text, ground_truth)) / 2   #compute loss

        loss.backward()  #Backpropagation (adjust model weights)
        optimizer.step()  #update model parameteres

    print(f"Epoch {epoch+1}/{num_epoch}, Loss: {loss.item()}")
            

#saving the finetuned model
#saves the model's state dictionary
torch.save(model.state_dict(), "fine_tuned_clip/model_weights.pth")   #fine_tuned_clip is the directory

#loading the  clip model
model.load_state_dict(torch.load("fine_tuned_clip/model_weights.pth"))