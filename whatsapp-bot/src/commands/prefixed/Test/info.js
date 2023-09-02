export const setup = {
  permission: 0, // All permission: 0 = all, 1 = owner, 2 = onwer, admin group
  group_required: false, // if true command only work on group
};

export async function run(ctx, obj) {
const disclaimerText = "Chatbot ini menyediakan informasi kesehatan umum dan bukan pengganti konsultasi medis langsung dengan profesional kesehatan. Penting untuk selalu berkonsultasi dengan dokter atau profesional yang berwenang untuk diagnosa dan perawatan yang tepat.\n\nDengan menggunakan chatbot ini, pengguna dianggap telah menyetujui dan memahami ketentuan ini. Penggunaan chatbot ini adalah tanggung jawab pengguna sepenuhnya. Pembuat dan pengembang chatbot tidak bertanggung jawab atas akibat atau kerugian yang mungkin timbul akibat penggunaan informasi dari chatbot ini.\n\nInformasi lebih lanjut https://github.com/andri-jpg/ChatKobi.AI#disclaimer";
  await obj.reply('Chatkobi.AI v0.2.3 (Whatsapp Bot) by Andri Lawrence https://github.com/andri-jpg.\n' + disclaimerText);
  
}
