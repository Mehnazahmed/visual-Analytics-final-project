import json
from collections import defaultdict


with open("clustered_postcards.json", "r") as f:
    data = json.load(f)

# GROUP BY CLUSTER
clusters = defaultdict(list)

for item in data:
    clusters[item["cluster"]].append(item["image"])

# SHOW SAMPLE IMAGES
for cluster_id, images in sorted(clusters.items()):

    print("\n")
    print("=" * 50)
    print(f"CLUSTER {cluster_id}")
    print("=" * 50)

    # SHOW FIRST 10 IMAGES
    for img in images[:10]:
        print(img)

    print(f"\nTotal images: {len(images)}")