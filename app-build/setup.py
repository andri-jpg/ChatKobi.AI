from cx_Freeze import setup, Executable

executables = [
    Executable("chatkobi.py", icon = "icon.ico")
]

setup(
    name="ChatKobi",
    version="0.2.2",
    description="Chatbot kesehatan offline bahasa indonesia",
    options={"build_exe": {"packages": ["subprocess", "win32gui", "win32con"]}},
    executables=executables
)
