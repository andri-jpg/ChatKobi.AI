import random
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from load_model import Chainer

app = FastAPI()


generator = Chainer(
    model='Model/gpt2-medium-chatkobi-AI-ggjt-v2'
)



words_clean = ["<EOL", "Pertanyaan", "</Jawaban>","<"]

def clean_res(result):
    cleaned_result = result
    for word in words_clean:
        cleaned_result = cleaned_result.replace(word, "")
    return cleaned_result

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

@app.post('/handleinput')
async def handle_input(request: Request):
    request_data = await request.json()
    user_input = request_data['input']
    
    result = generator.chain(user_input)
    result_text = clean_res(result["text"])

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

    return JSONResponse(content={"result": result_text}, status_code=200)

