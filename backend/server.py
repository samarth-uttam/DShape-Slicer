from flask import Flask, request, jsonify
from flask_cors import CORS
from object_logic import generate_object_transform

app = Flask(__name__)
CORS(app)  # 👈 Allows React frontend to call this server

@app.route('/get-object-transform', methods=['POST'])
def get_object_transform():
    data = request.json

    object_type = data.get('type')           # e.g., 'cube'
    count = data.get('count')                # current number of that type
    plate_id = data.get('plateId')           # e.g., 'Plate 1'
    existing_objects = data.get('existingObjects', [])  # list of dicts

    print(f"🔘 Object to add: {object_type}")
    print(f"📦 Plate: {plate_id}")
    print(f"🧮 Current count: {count}")
    print(f"📊 Existing objects: {len(existing_objects)} on this plate")

    transform = generate_object_transform(count)

    return jsonify({
        "type": object_type,
        "position": transform["position"],
        "rotation": transform["rotation"],
        "scale": transform["scale"],
        "filename": "models/banana.stl" if object_type == "banana" else None
    })

# ✅ Add this at the very end:
if __name__ == '__main__':
    print("🚀 Starting Flask server on http://localhost:5001")
    app.run(port=5001, debug= True)
