from cx_Freeze import setup, Executable

setup(
    name="chatkobi-api",
    version="0.1",
    description="chatkobi_backend",
    executables=[Executable("app.py")],
    options={"build_exe": {"packages": ["uvicorn"]}}
)
