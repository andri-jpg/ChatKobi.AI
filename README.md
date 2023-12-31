<div align="center">
  <h1>ChatKobi.AI: Chatbot Kesehatan Offline Bahasa Indonesia berbasis AI</h1>
  
  [![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://chatkobi.streamlit.app/)
  [![license](https://img.shields.io/github/license/andri-jpg/chatwaifu)](LICENSE)
</div>

<div align="center">
 <a href="https://zippyimage.com/image/iHTzUI"><img src="https://bg-so-1.zippyimage.com/2023/08/20/2c51473d18fad27a8b3d50d5ddbc2477.jpg" alt="2c51473d18fad27a8b3d50d5ddbc2477.jpg" border="0" /></a>


</div>

  
## Deskripsi

**ChatKobi.AI** adalah chatbot kesehatan berbasis model GPT-2 yang menggunakan bahasa Indonesia dan dirancang khusus untuk berjalan secara offline. Chatbot ini bertujuan untuk memberikan informasi dan saran kesehatan kepada pengguna di wilayah minim internet atau yang jauh dari fasilitas kesehatan. Selain itu, model GPT-2 yang digunakan dalam proyek ini sangat ringan dan dapat dijalankan di laptop dengan spesifikasi rendah, termasuk laptop dengan RAM hanya 2GB.

## Fitur Utama

- **Mode Offline**: ChatKobi.AI dirancang untuk bekerja sepenuhnya secara offline tanpa memerlukan koneksi internet aktif. Hal ini memungkinkan pengguna di wilayah terpencil atau dengan akses internet terbatas tetap dapat mengakses informasi kesehatan dalam bahasa Indonesia.

- **Ringan dan Efisien**: Model GPT-2 yang digunakan dalam proyek ini telah dioptimalkan untuk ukuran yang lebih kecil, sehingga mengurangi kebutuhan memori dan daya komputasi. Dengan demikian, ChatKobi.AI dapat berjalan lancar di laptop dengan spesifikasi rendah dengan ram hanya 2GB.

- **Chat Interaktif**: ChatKobi.AI menyediakan antarmuka chat interaktif dalam bahasa Indonesia yang mudah digunakan. Pengguna dapat mengetikkan pertanyaan atau masukan kesehatan dalam bahasa Indonesia dan mendapatkan respons yang relevan dan informatif dari chatbot ini.
- **Safety Output**: Chatkobi.AI dilengkapi dengan algoritma untuk menangani input dan output yang mungkin membahayakan pengguna, seperti topik bunuh diri, menyakiti diri sendiri dan lain sebagainya.
- **Demonstrasi Tampilan pengguna dan fitur safety**
  
![InShot_20230904_140155474](https://github.com/andri-jpg/ChatKobi.AI/assets/91838310/9e13a4d6-815e-4a4a-b969-ec76d2c4a772)

## Mode OFFLINE

### Installasi:

Download [Installer](https://github.com/andri-jpg/ChatKobi.AI/releases/)
Install dan izinkan firewall
Untuk menjalankan di mode offline

## Mode ONLINE

- Kunjungi [![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://chatkobi.streamlit.app/)
- [Bot Whatsapp](https://wa.me/6285845789195)
 

## Development

```python
pip install requirements.txt
python -m streamlit run main.py
```

## Disclaimer

- ChatKobi.AI adalah proyek sederhana dan tidak menggantikan konsultasi langsung dengan para profesional medis. Informasi yang diberikan oleh chatbot ini hanya sebagai referensi tambahan. Selalu konsultasikan dokter atau ahli kesehatan yang terpercaya untuk diagnosis dan pengobatan yang akurat terkait masalah kesehatan Anda.

- Proyek ChatKobi.AI adalah proyek open-source dengan lisensi MIT. Oleh karena itu, penggunaan dan distribusi proyek ini tunduk pada ketentuan lisensi MIT yang tercantum dalam berkas LICENSE di repositori.

- Dengan menggunakan ChatKobi.AI, Anda setuju untuk mematuhi semua ketentuan dan persyaratan lisensi MIT yang berlaku. Anda juga memahami bahwa penggunaan proyek ini adalah risiko Anda sendiri dan pengembang proyek ini tidak bertanggung jawab atas akibat yang mungkin timbul dari penggunaan proyek ini.

- Dengan menggunakannya, Anda setuju untuk membebaskan pengembang proyek dari segala tuntutan, klaim, atau tanggung jawab yang mungkin muncul akibat penggunaan atau distribusi proyek ini. Anda setuju bahwa penggunaan proyek ini adalah sepenuhnya atas risiko Anda dan Anda bertanggung jawab untuk memahami dan mematuhi hukum serta etika terkait penggunaan proyek ini.

- Penting untuk diingat bahwa ChatKobi.AI menggunakan teknologi model GPT-2 yang umumnya tidak digunakan untuk memberikan jawaban fakta atau informasi medis yang akurat. Model ini mungkin mengandung bias atau informasi yang tidak sepenuhnya valid.

- Informasi yang diberikan oleh ChatKobi.AI hanya sebagai referensi tambahan. Proyek ini perlu evaluasi dan validasi lebih lanjut oleh ahli medis untuk memastikan akurasi dan keandalannya.

- Selalu konsultasikan masalah kesehatan Anda dengan dokter atau ahli kesehatan terpercaya untuk diagnosis dan pengobatan yang tepat. Penggunaan ChatKobi.AI sebagai sumber informasi medis harus dilakukan dengan kewaspadaan dan pertimbangan lebih lanjut.

- Harap diingat bahwa ChatKobi.AI belum siap untuk produksi sebelum dievaluasi oleh ahli medis dan harus digunakan dengan pemahaman akan keterbatasan dan potensi ketidakakuratan informasi yang diberikan.
  
## Catatan

- Kami berharap ChatKobi.AI dapat membantu meningkatkan akses informasi kesehatan bagi masyarakat di wilayah terpencil dan dengan akses internet terbatas dalam bahasa Indonesia. Proyek ini juga diarahkan untuk mendukung pengguna dengan laptop spek rendah sehingga dapat digunakan dengan mudah tanpa membebani sumber daya komputer.

- Kami berencana untuk deploy ChatKobi.AI di set top box bekas dan dijadikan server lokal, sehingga bisa di gunakan di smartphone (Gpt2 tidak support ARM, rencana di batalkan)

## Credit
- [Andrian syah putra](https://huggingface.co/AndriLawrence/gpt2-chatkobi-ai)
- [Indonesia-NLP](https://huggingface.co/indonesian-nlp/gpt2-medium-indonesian)
- [llm-rs](https://github.com/LLukas22/llm-rs-python)
- [Rustformers](https://github.com/rustformers/llm)
- [Moec](https://github.com/miruchigawa/Moec)
