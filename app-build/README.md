# Development

harus punya python versi 3.7 - 3.9.9, msvc, inno setup terinstall di pc kamu

```bash
pip install requirements.txt
# build backend
python setup_app.py build
# build executor
python setup.py build
```

# Build installer

- Masukkan app.exe, chatkobi.exe, dan file tauri build single executable kedalam satu folder.
- Masukkan juga model.bin, config dan library yang dikemas ke folder yang sama.
- Build installer dengan inno setup, mengikut script file iss di dalam folder. 