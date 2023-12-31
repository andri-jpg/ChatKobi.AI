import streamlit as st
import random
import time
from load_model import Chainer

def get_generator():
    if not hasattr(st.session_state, 'generator'):
        st.session_state.generator = Chainer()
    return st.session_state.generator

def init_prev_responses():
    if not hasattr(st.session_state, 'prev_responses'):
        st.session_state.prev_responses = []
    return st.session_state.prev_responses
    
st.title("ChatKobi.AI")
st.subheader("Chatbot Kesehatan Offline Bahasa Indonesia")

with st.expander("Syarat dan Ketentuan"):
    st.write("""Chatbot ini menyediakan informasi kesehatan umum dan bukan pengganti konsultasi medis langsung dengan profesional kesehatan. Penting untuk selalu berkonsultasi dengan dokter atau profesional yang berwenang untuk diagnosa dan perawatan yang tepat.

Dengan menggunakan chatbot ini, pengguna dianggap telah menyetujui dan memahami ketentuan ini. Penggunaan chatbot ini adalah tanggung jawab pengguna sepenuhnya. Pembuat dan pengembang chatbot tidak bertanggung jawab atas akibat atau kerugian yang mungkin timbul akibat penggunaan informasi dari chatbot ini.

Informasi lebih lanjut [Klik Disini](https://github.com/andri-jpg/ChatKobi.AI#disclaimer)""")
    agree_with_disclaimer = st.checkbox("Saya Setuju dengan Syarat dan ketentuan yang berlaku.")


# Fungsi untuk mengganti kata-kata

words_to_clean = ["<EOL", "Pertanyaan", "<br>"]

def clean_res(result):
    cleaned_result = result
    for word in words_to_clean:
        cleaned_result = cleaned_result.replace(word, "")
    return cleaned_result

# Fungsi untuk mendeteksi konten berisiko
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

# Fungsi untuk mendapatkan pertanyaan acak
def get_random_example_question():
    example_questions = [
        "Apa yang dimaksud dengan tekanan darah tinggi?",
        "Bagaimana cara menjaga pola tidur yang baik?",
        "Apa saja manfaat olahraga teratur bagi kesehatan?",
        "Bagaimana cara mengatur diet yang seimbang?",
        "Apa dampak merokok bagi sistem pernapasan?",
        "Apa itu diabetes?",
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
    long_words = [word for word in words if len(word) > 30]
    return len(long_words) > 0

MAX_PREV_RESPONSES = 3
prev_responses = init_prev_responses()

def is_rep(response):
    global prev_responses
    response_without_whitespace = response.replace(" ", "").replace("\t", "").replace("\n", "")
    prev_responses.append(response_without_whitespace)
    
    if len(prev_responses) > MAX_PREV_RESPONSES:
        prev_responses.pop(0) 
    count = prev_responses.count(response_without_whitespace)
    
    if count >= 2:
        prev_responses = []
        return True
    else:
        return False 
    
if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if not agree_with_disclaimer:
    st.info("Silahkan setujui syarat dan ketentuan di atas sebelum menggunakan aplikasi.")

if agree_with_disclaimer:
    generator = get_generator()
    if prompt := st.chat_input("Masukkan Pertanyaan"):
        if detect_trigger_keywords(prompt):
            st.warning("Harap di ingat bahwa informasi yang diberikan oleh chatbot ini hanya untuk tujuan informasi umum. Gunakan dengan tanggung jawab.")
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        with st.chat_message("user"):
            st.markdown(prompt)
        if prompt:
            if detect_risk_content(prompt):
                st.warning(random.choice(risk_warnings))
                result_text = ""
            else:
                result = generator.chain(prompt)

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
                    result_text = random.choice(saran_messages) + "\n\nContoh pertanyaan yang disarankan:\n" + get_random_example_question()
                    generator.memory.save_context({"input": prompt}, {"output": result_text})
                if detect_risk_content(result_text):
                    st.warning(random.choice(risk_warnings))
                    result_text = "Jawaban disembunyikan karena mengandung konten berisiko."
                
                if detect_trigger_keywords(result_text):
                    st.warning("Harap di ingat bahwa informasi yang diberikan oleh chatbot ini hanya untuk tujuan informasi umum. Gunakan dengan tanggung jawab.")
                
                if is_weird_response(result_text) or is_rep(result_text):
                    st.error("Respon AI aneh terdeteksi, Silahkan reload halaman ini", icon='🚨')


            with st.chat_message("assistant"):
                message_placeholder = st.empty()
                full_response = ""
                assistant_response = result_text
                for chunk in assistant_response.split():
                    full_response += chunk + " "
                    time.sleep(0.05)
                    message_placeholder.markdown(full_response + "▌")
                message_placeholder.markdown(full_response)
            st.session_state.messages.append({"role": "assistant", "content": full_response})