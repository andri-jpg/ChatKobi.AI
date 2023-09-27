from load_model import Chainer

generator = Chainer()
words_clean = ["<EOL", "<br>"]

def clean_res(result):
    cleaned_result = result
    for word in words_clean:
        cleaned_result = cleaned_result.replace(word, "")
    return cleaned_result

file_path = 'databersih/abacavir.txt'
with open(file_path, 'r', encoding='utf-8') as file:
    user_input = file.read()

result = generator.chain('berapa dosis obat dalam teks dibawah? ' + user_input)
result_text = clean_res(result["response"]).strip()
print(result_text)