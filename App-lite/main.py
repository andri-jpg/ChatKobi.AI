import customtkinter

def button_callback():
    print("button clicked")

customtkinter.set_default_color_theme("dark-blue") 
customtkinter.set_appearance_mode("dark")
app = customtkinter.CTk()

class text_box(customtkinter.CTkFrame):
    def __init__(self, master, **kwargs):
        super().__init__(master, **kwargs)

        self.label = customtkinter.CTkLabel(self)  # Gunakan tk.Label jika sesuai dengan modul customtkinter yang Anda gunakan
        self.label.grid(row=0, column=0, padx=20)

class input_box(customtkinter.CTkFrame):
    def __init__(self, master, **kwargs):
        super().__init__(master, **kwargs)

        self.entry = customtkinter.CTkEntry(self, placeholder_text="CTkEntry")
        self.entry.grid(row=1, column=0, padx=20)

class App(customtkinter.CTk):
    def __init__(self):
        super().__init__()
        self.geometry("800x800")
        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(0, weight=1)

        self.text_box = text_box(master=self)
        self.text_box.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")
        self.input_box = input_box(master=self)
        self.input_box.grid(row=1, column=0, padx=20, pady=20, sticky="nsew")

app = App()
app.mainloop()
