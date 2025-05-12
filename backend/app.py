import json
import os

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Path to our JSON file that will store entries using absolute path
APP_DIR = "/var/www/app"
ENTRIES_FILE = os.path.join(APP_DIR, "entries.json")


# Initialize entries data
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
        app.logger.error(f"Current directory: {os.getcwd()}")
        app.logger.error(f"Trying to access: {os.path.abspath(ENTRIES_FILE)}")
        return {"entries": []}


# Save entries to file
def save_entries(entries):
    try:
        app.logger.info(f"Saving entries to: {os.path.abspath(ENTRIES_FILE)}")

        with open(ENTRIES_FILE, "w") as file:
            json.dump(entries, file, indent=2)
    except Exception as e:
        app.logger.error(f"Error saving entries: {e}")
        app.logger.error(f"Current directory: {os.getcwd()}")
        app.logger.error(f"Trying to write to: {os.path.abspath(ENTRIES_FILE)}")


@app.route("/entries", methods=["GET"])
def get_entries():
    entries = load_entries()
    return jsonify(entries["entries"])


@app.route("/entries", methods=["POST"])
def add_entry():
    try:
        entries = load_entries()
        new_entry = request.json

        entries["entries"].append(new_entry)
        save_entries(entries)
        return jsonify(new_entry), 201
    except Exception as e:
        app.logger.error(f"Error adding entry: {e}")
        return jsonify({"error": "Failed to add entry"}), 500


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "UP"})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
