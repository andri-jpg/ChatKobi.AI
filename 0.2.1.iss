; Script generated by the Inno Setup Script Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!

#define MyAppName "chatkobi.ai"
#define MyAppVersion "0.2.1"
#define MyAppPublisher "Andri Lawrence"
#define MyAppURL "https://www.github.com/andri-jpg"
#define MyAppExeName "chatkobi.exe"

[Setup]
; NOTE: The value of AppId uniquely identifies this application. Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{AC801A1A-964E-45D0-A779-C3646C57155A}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DisableProgramGroupPage=yes
; Uncomment the following line to run in non administrative install mode (install for current user only.)
;PrivilegesRequired=lowest
OutputDir=C:\Users\andri\Downloads
OutputBaseFilename=chatkobi installer 0.2.1
SetupIconFile=C:\Users\andri\github\Healthbot.AI\app\src-tauri\icons\icon.ico
Compression=lzma
SolidCompression=yes
WizardStyle=modern

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "C:\Users\andri\github\Healthbot.AI\app-build\app\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\andri\github\Healthbot.AI\app-build\app\2midguifSfFt5SbHJsxP.bin"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\andri\github\Healthbot.AI\app-build\app\2midguifSfFt5SbHJsxP.meta"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\andri\github\Healthbot.AI\app-build\app\app.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\andri\github\Healthbot.AI\app-build\app\chatkobi.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\andri\github\Healthbot.AI\app-build\app\chatkobi.py"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\andri\github\Healthbot.AI\app-build\app\chatkobi_frontend.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\andri\github\Healthbot.AI\app-build\app\config.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\andri\github\Healthbot.AI\app-build\app\frozen_application_license.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\andri\github\Healthbot.AI\app-build\app\python3.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\andri\github\Healthbot.AI\app-build\app\python39.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\andri\github\Healthbot.AI\app-build\app\setup.py"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\andri\github\Healthbot.AI\app-build\app\a\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; NOTE: Don't use "Flags: ignoreversion" on any shared system files

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
