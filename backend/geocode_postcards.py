import json
import time
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

print("Starting geocoder...")

# GEOCODER
geolocator = Nominatim(
    user_agent="postcrossing-app",
    timeout=10
)

# LOAD DATA
with open("../public/data/data.json", "r", encoding="utf-8") as f:
    postcards = json.load(f)["data"]

print(f"Loaded {len(postcards)} postcards")

# LOAD CACHE
try:
    with open("city_cache.json", "r", encoding="utf-8") as f:
        city_cache = json.load(f)

    print(f"Loaded cache with {len(city_cache)} cities")

except:
    city_cache = {}

# GEOCODE FUNCTION
def get_coords(city, country):

    key = f"{city}, {country}"

    # CACHE HIT
    if key in city_cache:
        print(f"CACHE HIT: {key}")
        return city_cache[key]

    print(f"Geocoding: {key}")

    try:
        location = geolocator.geocode(key)

        if location:

            coords = (
                location.latitude,
                location.longitude
            )

            city_cache[key] = coords

            # SAVE CACHE
            with open("city_cache.json", "w", encoding="utf-8") as f:
                json.dump(city_cache, f, indent=2)

            print(f"SUCCESS: {key}")

            # Avoid rate limits
            time.sleep(1)

            return coords

        else:
            print(f"NOT FOUND: {key}")

    except GeocoderTimedOut:
        print(f"TIMEOUT: {key}")

    except Exception as e:
        print(f"ERROR: {key} -> {e}")

    city_cache[key] = (None, None)

    return (None, None)

# MAIN LOOP
for i, card in enumerate(postcards):

    print(f"\nProcessing {i+1}/{len(postcards)}")

    # ORIGIN
    origin_lat, origin_lon = get_coords(
        card["origin_city"],
        card["origin_country"]
    )

    # DESTINATION
    receiving_lat, receiving_lon = get_coords(
        card["receiving_city"],
        card["receiving_country"]
    )

    # SAVE TO CARD
    card["origin_lat"] = origin_lat
    card["origin_lon"] = origin_lon

    card["receiving_lat"] = receiving_lat
    card["receiving_lon"] = receiving_lon

    # SAVE PROGRESS EVERY 50
    if i % 50 == 0:

        with open(
            "./postcards_geocoded.json",
            "w",
            encoding="utf-8"
        ) as f:
            json.dump(postcards, f, indent=2)

        print("Progress saved")

# FINAL SAVE
with open(
    "./postcards_geocoded.json",
    "w",
    encoding="utf-8"
) as f:
    json.dump(postcards, f, indent=2)

print("\nDONE")