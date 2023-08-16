import subprocess
import win32gui
import win32con
import time

def hide_console():
    hwnd = win32gui.GetForegroundWindow()
    win32gui.ShowWindow(hwnd, win32con.SW_HIDE)

def main():
    app_process = subprocess.Popen(['app.exe'], creationflags=subprocess.CREATE_NO_WINDOW)
    hide_console()

    frontend_process = subprocess.Popen(['chatkobi_frontend.exe'])

    while frontend_process.poll() is None:
        time.sleep(1)  

    app_process.terminate() 

if __name__ == '__main__':
    main()
