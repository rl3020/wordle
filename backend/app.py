from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from test import Gpt
import json

load_dotenv()
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
gpt = Gpt()


@app.route('/api/new-game', methods=['POST'])
def new_game():
    global gpt
    gpt = Gpt()
    return jsonify({"new_game": True})


@app.route('/api/gpt-guess', methods=['POST'])
def new_gpt_guess():
    result_obj = json.loads(gpt.gpt_guess())
    print("Res object type", result_obj)
    guess = result_obj["guess"]
    sassy_response = result_obj["sassy_response"]
    return jsonify({"guess": guess, "sassy_response": sassy_response})


@app.route('/home')
def home():
    return "<h1>Hello World!</h1>"


if __name__ == '__main__':
    app.run(debug=True)
