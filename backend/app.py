import json
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# Use current directory where app.py is located
APP_DIR = os.path.dirname(os.path.abspath(__file__))
ENTRIES_FILE = os.path.join(APP_DIR, "entries.json")


def load_entries():
    try:
        if os.path.exists(ENTRIES_FILE):
            with open(ENTRIES_FILE, "r") as file:
                return json.load(file)
        else:
            default_entries = {"entries": []}
            with open(ENTRIES_FILE, "w") as file:
                json.dump(default_entries, file, indent=2)
            return default_entries
    except Exception as e:
        app.logger.error(f"Error loading entries: {e}")
        return {"entries": []}


def save_entries(entries):
    try:
        with open(ENTRIES_FILE, "w") as file:
            json.dump(entries, file, indent=2)
    except Exception as e:
        app.logger.error(f"Error saving entries: {e}")


@app.route("/entries", methods=["GET"])
def get_entries():
    entries = load_entries()
    return jsonify(entries["entries"])


@app.route("/entries", methods=["POST"])
def add_entry():
    try:
        entries = load_entries()
        new_entry = request.json

        new_entry["id"] = str(uuid.uuid4())
        new_entry["timestamp"] = datetime.now().isoformat()

        entries["entries"].append(new_entry)
        save_entries(entries)
        return jsonify(new_entry), 201
    except Exception as e:
        app.logger.error(f"Error adding entry: {e}")
        return jsonify({"error": "Failed to add entry"}), 500


# ✅ מחיקה לפי index (עבור קוד ישן יותר / fallback)
@app.route("/entries/index/<int:index>", methods=["DELETE"])
def delete_entry_by_index(index):
    try:
        entries = load_entries()
        if 0 <= index < len(entries["entries"]):
            deleted_entry = entries["entries"].pop(index)
            save_entries(entries)
            return jsonify(deleted_entry), 200
        else:
            return jsonify({"error": "Invalid entry index"}), 404
    except Exception as e:
        app.logger.error(f"Error deleting entry by index: {e}")
        return jsonify({"error": "Failed to delete entry by index"}), 500


# Delete an entry by index
@app.route("/entries/<int:index>", methods=["DELETE"])
def delete_entry(index):
    try:
        entries = load_entries()
        if 0 <= index < len(entries["entries"]):
            deleted_entry = entries["entries"].pop(index)
            save_entries(entries)
            return jsonify(deleted_entry), 200
        else:
            return jsonify({"error": "Invalid entry index"}), 404
    except Exception as e:
        app.logger.error(f"Error deleting entry: {e}")
        return jsonify({"error": "Failed to delete entry"}), 500


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "UP"})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
