import json
import random
import eel
from load_model import Chainer

eel.init('UI')

with open('config.json', encoding="utf-8") as user_config:
    configs = json.load(user_config)

name = configs['user_name']

with open('config.json') as user_config:
    configs = json.load(user_config)

name = configs['user_name']

generator = Chainer(
    model='Model/gpt2-medium-healthbot-AI-ggjt',
    name=name,
    )



def change_words(words, name):
    new_words = []
    for word in words:
        new_word = word.replace('pertanyaan', name)
        new_words.append(new_word)
    return new_words

words_to_clean = ["<EOL", "Pertanyaan"]
words_clean = change_words(words_to_clean, name)

        
def clean_res(result, words_to_clean):
    cleaned_result = result
    for word in words_clean:
        cleaned_result = cleaned_result.replace(word, "")
    return cleaned_result

@eel.expose
def read_config_file():
    try:
        with open('config.json') as file:
            data = json.load(file)
            return data
    except FileNotFoundError:
        return None

@eel.expose
def save_config_file(data):
    try:
        with open('config.json', 'w') as file:
            json.dump(data, file, indent=2)
        return True
    except:
        return False

def get_random_example_question():
    example_questions = [
        "Apa yang dimaksud dengan tekanan darah tinggi?",
        "Bagaimana cara menjaga pola tidur yang baik?",
        "Apa saja manfaat olahraga teratur bagi kesehatan?",
        "Bagaimana cara mengatur diet yang seimbang?",
        "Apa dampak merokok bagi sistem pernapasan?",
        "apa itu diabetes?",
        "Apakah ada makanan yang bisa membantu meningkatkan daya tahan tubuh?",
    ]
    return random.choice(example_questions)

@eel.expose
def handleinput(x):
    result = generator.chain(x)
    result_text = clean_res(result["text"], words_to_clean)

    if not result_text.strip():
        saran_messages = [
            "Maaf, pertanyaan Anda terlihat agak rumit bagi saya. Dapatkah Anda mengutarakan dalam kata-kata yang lebih sederhana?",
            "Sepertinya ada sedikit kebingungan dalam pertanyaan Anda. Bolehkah Anda memberikan penjelasan lebih lanjut?",
            "Saya merasa kebingungan dengan konteks pertanyaan Anda. Mungkin saya membutuhkan beberapa petunjuk tambahan.",
            "Pertanyaan Anda mungkin memerlukan sedikit lebih banyak konteks. Bisakah Anda memberikan informasi lebih lanjut?",
            "Tolong beri saya petunjuk lebih jelas tentang pertanyaan Anda. Saya ingin membantu dengan sebaik-baiknya.",
            "Saya sedikit bingung dengan pertanyaan Anda. Bisakah Anda mengungkapkan dengan cara yang berbeda?",
        ]

        result_text = random.choice(saran_messages) + "\n\nContoh pertanyaan yang disarankan:\n" + get_random_example_question()

    eel.bot_response(result_text)


eel.start('index.html',mode='edge', size =(903,860)) 