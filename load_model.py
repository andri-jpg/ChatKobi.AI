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
    def __init__(self, model, name):
        self.model_download = ModelDownloader()
        with open('config.json') as self.configuration:
            self.user_config = json.load(self.configuration)
        meta = f"{model}.meta"
        model = f"{model}.bin"
        self.model = model
        """
        if not Path(model).is_file():
            self.model_download.download_file(f"", model)
        if not Path(meta).is_file():
            self.model_download.download_file(f"", meta)
        """
        self.name = name
        
        self.stop_word = ['\n<EOL>:','<eol>', '<Eol>','pertanyaan :' ]
        self.stop_words = self.change_stop_words(self.stop_word, self.name)
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

        template = """
        {chat_history}
        pertanyaan : {instruction}.
        jawaban :"""

        self.template = self.change_names(template, self.name)
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

    
    @staticmethod
    def change_stop_words(stop_words, name):
        new_stop_words = []
        for word in stop_words:
            new_word = word.replace('pertanyaan', name)
            new_stop_words.append(new_word)
        return new_stop_words

    @staticmethod
    def change_names(template, user_name):
        template = template.replace("pertanyaan", user_name)
        return template
    
    def chain(self, input_text):
        prompt = self.prompt.generate_prompt({
            "chat_history": self.memory.export_memory(),
            "instruction": input_text
        })
        response = self.chain.generate(prompt)
        self.memory.add_message(input_text, "human")
        self.memory.add_message(response.choices[0].text.strip(), "ai")
        return response.choices[0].text.strip()