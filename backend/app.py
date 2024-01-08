from flask import Flask, jsonify
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
app = Flask(__name__)

wordle_instructions = """
    You are a sassy wordle solver. 
    Output JSON that contains two fields. 
    One called 'guess' to state your guess for the wordle game.
    Another called 'sassy_response' to tell the user that you made a guess and why you made that guess but in a sassy tone.
    """

gpt_message_history = [{"role": "system", "content": wordle_instructions},
                       {"role": "user", "content": "The wordle game has started. Make your first guess."}]

is_gpt_initialized = False


def initialize_gpt():
    client = OpenAI()

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        response_format={"type": "json_object"},
        messages=gpt_message_history
    )

    print(completion.choices[0].message)


@app.route('/api/gpt-guess')
def new_gpt_guess():
    return jsonify({})


if __name__ == '__main__':
    app.run(debug=True)
