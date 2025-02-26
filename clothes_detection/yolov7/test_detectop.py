import torch
import cv2
import numpy as np
from pathlib import Path
from models.experimental import attempt_load
from utils.general import non_max_suppression, scale_coords
from utils.torch_utils import select_device
from PIL import Image




# ✅ Step 1: Load YOLOv7 Model
device = select_device('cpu')  # Change to 'cuda' if you want GPU
model = attempt_load("yolov7/best.pt", map_location=device)  # Load model
model.eval()

# ✅ Step 2: Function to Preprocess Image
def preprocess_image(img_path):
    img = cv2.imread(img_path)
    img = cv2.resize(img, 576, 576)  # Resize to match YOLOv7 input size
    img = img[:, :, ::-1].transpose(2, 0, 1)  # Convert BGR to RGB and transpose
    img = np.ascontiguousarray(img, dtype=np.float32) / 255.0
    return torch.from_numpy(img).unsqueeze(0)

# ✅ Step 3: Function to Run Detection
def detect_clothes(image_path):
    img = preprocess_image(image_path).to(device)

    with torch.no_grad():
        pred = model(img)[0]  # Run model inference
        pred = non_max_suppression(pred, 0.25, 0.45)  # Apply NMS

    results = []
    for det in pred:
        if len(det):
            det[:, :4] = scale_coords(img.shape[2:], det[:, :4], (640, 640)).round()
            for *xyxy, conf, cls in det:
                results.append({
                    "class": int(cls),
                    "confidence": float(conf),
                    "bbox": [int(coord) for coord in xyxy]
                })

    return results

# ✅ Step 4: Run Detection on a Sample Image
if __name__ == "__main__":
    image_path = "1165.jpg"  # Replace with your image path
    results = detect_clothes(image_path)

    print("Detection Results:", results)
