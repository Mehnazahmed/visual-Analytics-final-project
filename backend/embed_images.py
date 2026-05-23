import os
import json
import torch
import open_clip
import numpy as np

from PIL import Image
from tqdm import tqdm

from sklearn.preprocessing import normalize
import umap
import hdbscan



# ============================================
# SETTINGS
# ============================================

IMAGE_FOLDER = "./images"
OUTPUT_FILE = "./clustered_postcards.json"

device = "cuda" if torch.cuda.is_available() else "cpu"



# ============================================
# LOAD CLIP MODEL
# ============================================

print("Loading CLIP model...")

model, _, preprocess = open_clip.create_model_and_transforms(
    "ViT-B-32",
    pretrained="laion2b_s34b_b79k"
)

model = model.to(device)



# ============================================
# LOAD IMAGES
# ============================================

image_files = [
    f for f in os.listdir(IMAGE_FOLDER)
    if f.lower().endswith((".jpg", ".jpeg", ".png"))
]

print(f"Found {len(image_files)} images")



# ============================================
# EXTRACT FEATURES
# ============================================

embeddings = []
valid_images = []

print("Extracting image embeddings...")

for image_name in tqdm(image_files):

    image_path = os.path.join(
        IMAGE_FOLDER,
        image_name
    )

    try:
        image = Image.open(image_path).convert("RGB")

        image_tensor = preprocess(image) \
            .unsqueeze(0) \
            .to(device)

        with torch.no_grad():
            features = model.encode_image(image_tensor)

        features = features.cpu().numpy()[0]

        embeddings.append(features)

        valid_images.append(image_name)

    except Exception as e:
        print("ERROR:", image_name, e)



# ============================================
# NORMALIZE EMBEDDINGS
# ============================================

embeddings = np.array(embeddings)

embeddings = normalize(embeddings)



# ============================================
# UMAP FOR CLUSTERING (10D)
# ============================================

print("Running UMAP for clustering...")

cluster_reducer = umap.UMAP(
    n_neighbors=20,
    min_dist=0.05,
    n_components=10,
    metric="cosine",
    random_state=42
)

cluster_embeddings = cluster_reducer.fit_transform(
    embeddings
)



# ============================================
# HDBSCAN CLUSTERING
# ============================================

print("Running HDBSCAN...")

clusterer = hdbscan.HDBSCAN(
    min_cluster_size=20,
    min_samples=5,
    metric="euclidean",
    cluster_selection_epsilon=0.05,
    cluster_selection_method="eom"
)

clusters = clusterer.fit_predict(
    cluster_embeddings
)



# ============================================
# UMAP FOR VISUALIZATION (2D)
# ============================================

print("Running UMAP for visualization...")

viz_reducer = umap.UMAP(
    n_neighbors=20,
    min_dist=0.08,
    n_components=2,
    metric="cosine",
    random_state=42
)

coords = viz_reducer.fit_transform(
    embeddings
)



# ============================================
# SHOW STATS
# ============================================

unique_clusters = set(clusters)

print("\nClusters found:")

for c in sorted(unique_clusters):

    count = np.sum(clusters == c)

    print(f"Cluster {c}: {count} images")



# ============================================
# SAVE RESULTS
# ============================================

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

print(f"\nSaved to {OUTPUT_FILE}")