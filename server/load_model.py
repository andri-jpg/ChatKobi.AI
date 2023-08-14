import json
from llm_rs.langchain import RustformersLLM
from llm_rs import SessionConfig, GenerationConfig
from langchain import PromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from pathlib import Path
import urllib.request

class ModelDownloader:
    def download_file(self, url, file_path):
        print(f"Downloading {file_path}...")
        urllib.request.urlretrieve(url, file_path)
        print("Download completed.")
        
class Chainer:
    def __init__(self, model):
        self.model_download = ModelDownloader()
        with open('config.json') as self.configuration:
            self.user_config = json.load(self.configuration)
        model = f"{model}.bin"
        self.model = model

        if not Path(model).is_file():
            self.model_download.download_file(f"https://huggingface.co/AndriLawrence/gpt2-chatkobi-ai/resolve/main/gpt2-medium-chatkobi-AI-ggjt.bin", model)

        
        self.stop_words = ['<EOL>','<eol>', '<Eol>','pertanyaan :','Human', 'human', 'Pertanyaan','\n' ]
        session_config = SessionConfig(
            threads=self.user_config['threads'],
            context_length=self.user_config['context_length'],
            prefer_mmap=False
        )

        generation_config = GenerationConfig(
            top_p=self.user_config['top_p'],
            top_k=self.user_config['top_k'],
            temperature=self.user_config['temperature'],
            max_new_tokens=self.user_config['max_new_tokens'],
            repetition_penalty=self.user_config['repetition_penalty'],
            stop_words=self.stop_words
        )

        template = self.user_config['template']

        self.template = template
        self.prompt = PromptTemplate(
            input_variables=["chat_history", "instruction"],
            template=self.template
        )
        self.memory = ConversationBufferMemory(memory_key="chat_history")

        self.llm = RustformersLLM(
            model_path_or_repo_id=self.model,
            session_config=session_config,
            generation_config=generation_config,
            callbacks=[StreamingStdOutCallbackHandler()]
        )

        self.chain = LLMChain(llm=self.llm, prompt=self.prompt, memory=self.memory)
    