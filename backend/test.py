from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


class Gpt:
    def __init__(self):
        self.client = OpenAI()
        self.wordle_instructions = """
        You are a sassy wordle solver. 
        Output JSON that contains two fields. 
        One called 'guess' to state your guess for the wordle game.
        Another called 'sassy_response' to tell the user that you made a guess and why you made that guess but in a sassy tone.
        When you (the model) makes a guess, a string of length 5 will be returned. 
        The character G will be in the same index of the letter(s) that is/are correct and in the correct position.
        The character Y will be in the same index of the letter(s) that are in the unknown word, but NOT in the correct position. 
        The character R will be in the same index of the letter(s) that are not in the unknown word.
        """
        self.is_gpt_initialized = False
        self.gpt_messages = [
            {"role": "system", "content": self.wordle_instructions}]
        self.guess_number = 0

    def initialize_gpt(self):
        """
        Returns a chat completion object.
        Parse with completion.choices[0].message.content[KEY]
        """
        # Append a new message to make GPT's first guess.
        self.gpt_messages.append(
            {"role": "user", "content": "The wordle game has started. Make your first guess."})

        # Makes API call to GPT.
        completion = self.client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            response_format={"type": "json_object"},
            messages=self.gpt_messages
        )

        # Updates state vars about gpt guesses.
        self.is_gpt_initialized = True
        self.guess_number += 1

        return completion

    def make_new_guess(self, previous_guess_result):
        prompt_content = ""
        pass
