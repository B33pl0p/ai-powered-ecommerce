import sys
import torch
import numpy as np
import cv2


model_path = "yolov7/best.pt"
sys.path.append("yolov7")
from models.experimental import attempt_load
from utils.general import non_max_suppression, scale_coords



device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


model = attempt_load("yolov7/best.pt", map_location=device)  # Load model
model.eval()  # Set to evaluation mode

# Load and preprocess the image
img = cv2.imread('1538.jpg')
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Convert to RGB
img0 = img.copy()  # Keep a copy of the original image for visualization
img = cv2.resize(img, (640, 640))
img = img / 255.0  # Normalize to [0,1] range
img = np.transpose(img, (2, 0, 1))  # Change shape from (H, W, C) to (C, H, W)
img = np.expand_dims(img, axis=0)  # Add batch dimension
img = torch.tensor(img, dtype=torch.float32).to(device)

with torch.no_grad():
    pred = model(img)[0]
    pred = non_max_suppression(pred, conf_thres=0.5, iou_thres=0.6)
    
print("Input image shape:", img.shape)

# Process detections
detections = []
for i, det in enumerate(pred):  # detections per image
    if len(det):
        # Rescale boxes from img_size to img0 size
        det[:, :4] = scale_coords(img.shape[2:], det[:, :4], img0.shape).round()
        detections.append(det.cpu().numpy())
print(detections)        

# detections now contains the bounding boxes of detected clothes