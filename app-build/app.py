import random
from typing import Optional
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from load_model import Chainer
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

origins = ["*"] 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

generator = Chainer(
    model='Model/gpt2-medium-chatkobi-AI-ggjt-v2'
)

words_clean = ["<EOL", "<br>"]

def clean_res(result):
    cleaned_result = result
    for word in words_clean:
        cleaned_result = cleaned_result.replace(word, "")
    return cleaned_result

def detect_risk_content(text):
    risk_keywords = [
        "self harm", "bunuh diri", 
        "menyakiti diri", "kehilangan harapan", 
        "ingin mati", "merasa putus asa", "<br>", "cara mati"
    ]
    for keyword in risk_keywords:
        if keyword in text.lower():
            return True
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

risk_warnings = [
    "Kami sangat peduli dengan keadaan Anda. Kami ingin mengingatkan Anda untuk mencari bantuan profesional segera.",
    "Ingatlah bahwa Anda tidak sendirian dalam menghadapi masalah ini. Jika Anda merasa berat, jangan ragu untuk mencari dukungan dari teman, keluarga, atau sumber bantuan profesional.",
    "Jika Anda sedang di situasi sulit, jangan ragu untuk membicarakannya dengan teman, keluarga, atau profesional yang Anda percayai. Ada orang yang peduli dan siap membantu Anda.",
    "Anda tidak perlu menghadapi hal ini sendirian. Bicaralah dengan seseorang yang Anda percayai atau cari sumber dukungan profesional.",
]

trigger_keywords = [
    "obat", "konsultasi", "pengobatan", 
    "diagnosis", "perawatan", "terapi", "spesialis", "penemu","keluhan","kanker"
]

def detect_trigger_keywords(text):
    for keyword in trigger_keywords:
        if keyword in text.lower():
            return True
    return False

def is_weird_response(response):
    words = response.strip().split()
    long_words = [word for word in words if len(word) > 12]
    return len(long_words) > 0
    
MAX_PREV_RESPONSES = 10
prev_responses = []

def is_rep(response):
    response_without_whitespace = response.replace(" ", "").replace("\t", "").replace("\n", "")
    prev_responses.append(response_without_whitespace)
    
    if len(prev_responses) > MAX_PREV_RESPONSES:
        prev_responses.pop(0) 
    count = prev_responses.count(response_without_whitespace)
    
    if count >= 3:  
        return True
    else:
        return False 

@app.post('/handleinput')
async def handle_input(request: Request):
    global generator
    request_data = await request.json()
    user_input = request_data['input']

    if detect_risk_content(user_input):
        result_text = random.choice(risk_warnings)
        warning, restart= False, False

    else:
        warning, restart= False, False
        result = generator.chain(user_input)
        result_text = clean_res(result["response"])

        if not result_text.strip():
            saran_messages = [
            "Maaf, pertanyaan Anda terlihat agak rumit bagi saya. Dapatkah Anda mengutarakan dalam kata-kata yang lebih sederhana?",
            "Sepertinya ada sedikit kebingungan dalam pertanyaan Anda. Bolehkah Anda memberikan penjelasan lebih lanjut?",
            "Saya merasa kebingungan dengan konteks pertanyaan Anda. Mungkin saya membutuhkan beberapa petunjuk tambahan.",
            "Pertanyaan Anda mungkin memerlukan sedikit lebih banyak konteks. Bisakah Anda memberikan informasi lebih lanjut?",
            "Tolong beri saya petunjuk lebih jelas tentang pertanyaan Anda. Saya ingin membantu dengan sebaik-baiknya.",
            "Saya sedikit bingung dengan pertanyaan Anda. Bisakah Anda mengungkapkan dengan cara yang berbeda?",
            ]

            result_text = random.choice(saran_messages) + "\n\nJika terus berulang, tolong mulai ulang aplikasi.\nContoh pertanyaan yang disarankan:\n" + get_random_example_question()
            generator.memory.save_context({"input": user_input}, {"output": result_text})
        if detect_risk_content(result_text):
            result_text = "Jawaban disembunyikan karena mengandung konten berisiko."
            
        
        if detect_trigger_keywords(user_input) or detect_trigger_keywords(result_text):
            warning = True

        if is_weird_response(result_text) or is_rep(result_text):
            restart = True

        if restart:
            generator = Chainer( 
                model='Model/gpt2-medium-chatkobi-AI-ggjt-v2'
            )
            
    return JSONResponse(content={"result": result_text, "warning" : warning, "restart" : restart}, status_code=200)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8089)
