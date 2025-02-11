import sys
import torch
import numpy as np
import cv2
import json
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
from pathlib import Path

# Import YOLO utilities from detect.py
sys.path.append("yolov7")
from models.experimental import attempt_load
from utils.general import non_max_suppression, scale_coords, check_img_size
from utils.datasets import letterbox  # ✅ Proper image resizing
from utils.torch_utils import select_device

# Initialize FastAPI app
app = FastAPI()

# Load YOLOv7 model
model_path = "yolov7/best.pt"
device = select_device("")  # Auto-select CUDA or CPU
model = attempt_load(model_path, map_location=device)  # Load model
model.eval()  # Set to evaluation mode

# Model parameters
IMG_SIZE = 576  # Use the same size as training
CONF_THRESH = 0.25  # Confidence threshold for detection
IOU_THRESH = 0.45  # IOU threshold for Non-Max Suppression (NMS)

# Upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)  # Create the directory if it doesn't exist

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Image preprocessing using letterbox (matches detect.py)
def preprocess_image(img_path):
    img0 = cv2.imread(str(img_path))  # Load image (original)
    
    # Resize while maintaining aspect ratio (letterboxing)
    img = letterbox(img0, new_shape=IMG_SIZE, auto=False)[0]  
    img = img[:, :, ::-1].transpose(2, 0, 1)  # Convert BGR to RGB and reshape (H, W, C) -> (C, H, W)
    img = np.ascontiguousarray(img)  # Ensure memory is contiguous
    
    img = torch.from_numpy(img).to(device)  # Convert to Tensor
    img = img.float() / 255.0  # Normalize pixel values (0 - 255 → 0 - 1)
    
    if img.ndimension() == 3:
        img = img.unsqueeze(0)  # Add batch dimension
    
    return img, img0  # Return processed image and original image

# ✅ Function to draw bounding boxes on an image
def draw_bounding_boxes(image_path, detections, output_path):
    img = cv2.imread(str(image_path))

    for det in detections:
        x1, y1, x2, y2 = det["bbox"]
        confidence = det["confidence"]
        class_id = det["class"]

        # Draw bounding box
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(
            img,
            f"Class {class_id}: {confidence:.2f}",
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (0, 255, 0),
            2,
        )

    cv2.imwrite(str(output_path), img)  # Save detected image

# ✅ API Endpoint to Handle Image Upload & Detection
@app.post("/detect/")
async def detect_clothing(file: UploadFile = File(...)):
    image_path = UPLOAD_DIR / file.filename
    detected_image_path = UPLOAD_DIR / f"detected_{file.filename}"
    detection_path = UPLOAD_DIR / f"detections.json"

    # Save uploaded file
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Preprocess image (letterbox, normalization, Tensor conversion)
    img, img0 = preprocess_image(image_path)

    # Run detection
    detections = []
    with torch.no_grad():
        pred = model(img)[0]  # Perform inference
        pred = non_max_suppression(pred, CONF_THRESH, IOU_THRESH)  # Apply NMS

        # Extract bounding boxes
        for det in pred:
            if len(det):
                det[:, :4] = scale_coords(img.shape[2:], det[:, :4], img0.shape).round()  # Rescale boxes to original image

                for *xyxy, conf, cls in det:
                    width = xyxy[2] - xyxy[0]
                    height = xyxy[3] - xyxy[1]

                    # Ensure valid bounding boxes
                    if width >= 10 and height >= 10 and xyxy[2] > xyxy[0] and xyxy[3] > xyxy[1]:
                        detections.append({
                            "bbox": [int(x) for x in xyxy],  # Bounding box [x1, y1, x2, y2]
                            "confidence": float(conf),  # Confidence score
                            "class": int(cls)  # Class ID
                        })

    # Draw bounding boxes on the image and save it
    draw_bounding_boxes(image_path, detections, detected_image_path)

    # Get properties of the detected image (width & height)
    detected_img = cv2.imread(str(detected_image_path))
    height, width, _ = detected_img.shape  # Get dimensions

    # Save detections to JSON
    with open(detection_path, "w") as f:
        json.dump({"detections": detections}, f, indent=4)

    # ✅ Return image height & width along with the processed image URI
    return JSONResponse(content={
        "detected_image_uri": f"/uploads/detected_{file.filename}",
        "original_image_uri": f"/uploads/{file.filename}",
        "detections": detections,
        "detected_image_width": width,
        "detected_image_height": height
    })
