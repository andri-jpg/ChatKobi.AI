use rand::seq::SliceRandom;
use std::collections::HashSet; 

fn clean_res(result: String) -> String {
    let words_clean: Vec<&str> = vec!["<EOL", "<br>"];
    let mut cleaned_result = result.clone();

    for word in words_clean {
        cleaned_result = cleaned_result.replace(word, "");
    }

    cleaned_result
}

fn detect_risk_content(text: &str) -> bool {
    let risk_keywords: HashSet<&str> = [
        "self harm", "bunuh diri", "menyakiti diri", 
        "kehilangan harapan", "ingin mati", 
        "merasa putus asa", "<br>", "cara mati"
    ].iter().cloned().collect();

    let lowercase_text = text.to_lowercase();
    risk_keywords.iter().any(|&keyword| lowercase_text.contains(keyword))
}

fn get_random_example_question() -> &str {
    let example_questions = [
        "Apa yang dimaksud dengan tekanan darah tinggi?",
        "Bagaimana cara menjaga pola tidur yang baik?",
        "Apa saja manfaat olahraga teratur bagi kesehatan?",
        "Bagaimana cara mengatur diet yang seimbang?",
        "Apa dampak merokok bagi sistem pernapasan?",
        "apa itu diabetes?",
        "Apakah ada makanan yang bisa membantu meningkatkan daya tahan tubuh?",
    ];

    let mut rng = rand::thread_rng();
    example_questions.choose(&mut rng).unwrap()
}

const RISK_WARNINGS: [&str; 4] = [
    "Kami sangat peduli dengan keadaan Anda. Kami ingin mengingatkan Anda untuk mencari bantuan profesional segera.",
    "Ingatlah bahwa Anda tidak sendirian dalam menghadapi masalah ini. Jika Anda merasa berat, jangan ragu untuk mencari dukungan dari teman, keluarga, atau sumber bantuan profesional.",
    "Jika Anda sedang di situasi sulit, jangan ragu untuk membicarakannya dengan teman, keluarga, atau profesional yang Anda percayai. Ada orang yang peduli dan siap membantu Anda.",
    "Anda tidak perlu menghadapi hal ini sendirian. Bicaralah dengan seseorang yang Anda percayai atau cari sumber dukungan profesional.",
];

fn detect_trigger_keywords(text: &str) -> bool {
    let trigger_keywords: HashSet<&str> = [
        "obat", "konsultasi", "pengobatan", 
        "diagnosis", "perawatan", "terapi", "spesialis", "penemu", "keluhan", "kanker"
    ].iter().cloned().collect();

    let lowercase_text = text.to_lowercase();
    trigger_keywords.iter().any(|&keyword| lowercase_text.contains(keyword))
}

fn is_weird_response(response: &str) -> bool {
    let words: Vec<&str> = response.trim().split_whitespace().collect();
    let long_words: Vec<&str> = words.iter().filter(|&&word| word.len() > 30).cloned().collect();
    
    !long_words.is_empty()
}

const MAX_PREV_RESPONSES: usize = 3;

fn is_rep(response: &str) -> bool {
    let mut prev_responses: Vec<String> = Vec::new();
    let response_without_whitespace = response.replace(" ", "").replace("\t", "").replace("\n", "");
    
    prev_responses.push(response_without_whitespace.clone());

    if prev_responses.len() > MAX_PREV_RESPONSES {
        prev_responses.remove(0);
    }

    let count = prev_responses.iter().filter(|&&r| r == response_without_whitespace).count();

    if count >= 2 {
        prev_responses.clear();
        true
    } else {
        false
    }
}

fn main() {

    let result = "Hello <br> World!";
    let cleaned_result = clean_res(result.to_string());
    println!("{}", cleaned_result);

    let text = "Self harm is dangerous.";
    let has_risk_content = detect_risk_content(text);
    println!("Has risk content: {}", has_risk_content);
}
