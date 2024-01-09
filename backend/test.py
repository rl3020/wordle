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
        self.gpt_messages = [
            {"role": "system", "content": self.wordle_instructions}]
        self.guess_number = 0

    def gpt_guess(self, prev_guess_result=None):
        """
        Params:
        prev_guess_result: string indicating correctness of gpts guess
        Returns:
        Dictionary representing gpts guess and a sassy comment to come along with it.
        {
            "guess" : "SNAKE"
            "sassy_response":"This is a sassy response"
        }
        """
        prompt = ""

        if self.guess_number == 0:
            # GPT's first guess.
            prompt = "The wordle game has started. Make your first guess."
        else:
            prompt = "Your previous guess resulted in the string: " + prev_guess_result
            prompt += ". Based on this information, make a new sassy guess and return your guess in the same JSON scheme."
            prompt += "You have " + \
                str(5 - self.guess_number) + \
                " guesses remaining. Also, why did you choose this new word?"

        print("PROMPT: ", prompt)
        # Append appropriate prompt to to messages list
        self.gpt_messages.append(
            {"role": "user", "content": prompt})

        # Makes API call to GPT.
        completion = self.client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            response_format={"type": "json_object"},
            messages=self.gpt_messages
        )

        self.guess_number += 1
        return completion.choices[0].message.content
