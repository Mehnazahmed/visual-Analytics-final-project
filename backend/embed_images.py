import os
import json
import torch
import open_clip
import numpy as np

from PIL import Image
from tqdm import tqdm

from sklearn.preprocessing import StandardScaler
import umap
import hdbscan



IMAGE_FOLDER = "./images"
OUTPUT_FILE = "./clustered_postcards.json"



device = "cuda" if torch.cuda.is_available() else "cpu"

model, _, preprocess = open_clip.create_model_and_transforms(
    "ViT-B-32",
    pretrained="laion2b_s34b_b79k"
)

tokenizer = open_clip.get_tokenizer("ViT-B-32")

model = model.to(device)



image_files = [
    f for f in os.listdir(IMAGE_FOLDER)
    if f.lower().endswith((".jpg", ".jpeg", ".png"))
]

print(f"Found {len(image_files)} images")



embeddings = []
valid_images = []

for image_name in tqdm(image_files):

    image_path = os.path.join(IMAGE_FOLDER, image_name)

    try:
        image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)

        with torch.no_grad():
            features = model.encode_image(image)

        features /= features.norm(dim=-1, keepdim=True)

        embeddings.append(features.cpu().numpy()[0])

        valid_images.append(image_name)

    except Exception as e:
        print("ERROR:", image_name, e)

embeddings = np.array(embeddings)



scaler = StandardScaler()

scaled_embeddings = scaler.fit_transform(embeddings)



print("Running UMAP...")

reducer = umap.UMAP(
    n_neighbors=15,
    min_dist=0.1,
    metric="cosine",
    random_state=42
)

coords = reducer.fit_transform(scaled_embeddings)



print("Running HDBSCAN...")

clusterer = hdbscan.HDBSCAN(
    min_cluster_size=5,
    metric="euclidean"
)

clusters = clusterer.fit_predict(coords)



results = []

for i in range(len(valid_images)):

    results.append({
        "image": valid_images[i],
        "x": float(coords[i][0]),
        "y": float(coords[i][1]),
        "cluster": int(clusters[i])
    })

with open(OUTPUT_FILE, "w") as f:
    json.dump(results, f, indent=2)

print(f"Saved results to {OUTPUT_FILE}")