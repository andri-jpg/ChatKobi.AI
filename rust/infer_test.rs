use llm::{InferenceSession, Model, GenerationConfig};

fn main() {

    let gpt2: llm::models::Gpt2 = llm::load::<llm::models::Gpt2>(
        // path to GGML file
        std::path::Path::new("gpt2-medium-chatkobi-ggjt-v2.1.bin"),
        llm::TokenizerSource::Embedded,
        // llm::ModelParameters
        Default::default(),
        // load progress callback
        llm::load_progress_callback_stdout,
    )
    .unwrap_or_else(|err| panic!("Failed to load model: {err}"));

    // use the model to generate text from a prompt
    let mut session = gpt2.start_session(Default::default());

    let res = session.infer::<std::convert::Infallible>(
        // model to use for text generation
        &gpt2,
        // randomness provider
        &mut rand::thread_rng(),
        // the prompt to use for text generation, as well as other
        // inference parameters
        &llm::InferenceRequest {
            prompt: "pertanyaan : apa itu diabetes? jawaban : ",
            ..Default::default()
        },
        // llm::OutputRequest
        &mut Default::default(),
        // output callback
        |t| {
            print!("{t}");
            std::io::stdout().flush().unwrap();
    
            Ok(())
        }
    );
    
    match res {
        Ok(result) => println!("\n\nInference stats:\n{result}"),
        Err(err) => println!("\n{err}"),

}
}