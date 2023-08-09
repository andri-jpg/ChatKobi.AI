import json
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
    model='gpt2-medium-indonesian-q4_0-ggjt',
    name=name,
    )

words_to_clean = ["\n<EOL", "\n<Eol"]

def change_words(words, name):
    new_words = []
    for word in words:
        new_word = word.replace('pertanyaan', name)
        new_words.append(new_word)
    return new_words

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

@eel.expose                       
def handleinput(x):
   # eel.disableText()
    #eel.statusBot('typing...')
    result = generator.chain(x)
    result = result["text"]
    eel.bot_response(result)
    print(result)

eel.start('index.html',mode='edge', size =(903,860)) 