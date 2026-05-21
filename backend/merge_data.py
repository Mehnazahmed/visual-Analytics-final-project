import json

# LOAD FILES
with open("../public/data/clustered_postcards.json", "r", encoding="utf-8") as f:
    clusters = json.load(f)

with open("./postcards_geocoded.json", "r", encoding="utf-8") as f:
    geo = json.load(f)

# CREATE LOOKUP
cluster_lookup = {}

for item in clusters:
    cluster_lookup[item["image"]] = item

merged = []

for card in geo:

    image_name = card["name"]

    if image_name in cluster_lookup:

        cluster_data = cluster_lookup[image_name]

        merged.append({
            "image": image_name,

            "cluster": cluster_data["cluster"],

            "x": cluster_data["x"],
            "y": cluster_data["y"],

            "origin_lat": card["origin_lat"],
            "origin_lon": card["origin_lon"],

            "receiving_lat": card["receiving_lat"],
            "receiving_lon": card["receiving_lon"],

            "origin_country": card["origin_country"],
            "receiving_country": card["receiving_country"]
        })

# SAVE
with open("../public/data/final_postcards.json", "w", encoding="utf-8") as f:
    json.dump(merged, f, indent=2)

print("DONE")