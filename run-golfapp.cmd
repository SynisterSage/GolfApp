@echo off
setlocal
set SDK=C:\Users\aferg\AppData\Local\Android\Sdk
set AVD=Medium_Phone_API_36.0
set ROOT=D:\golfapp\GolfApp

echo ==== KILL OLD PROCESSES ====
taskkill /f /im emulator.exe 2>nul
taskkill /f /im qemu-system-x86_64.exe 2>nul
taskkill /f /im adb.exe 2>nul
taskkill /f /im node.exe 2>nul

echo ==== BOOT EMULATOR (%AVD%) ====
start "" "%SDK%\emulator\emulator.exe" -avd %AVD% -no-snapshot-load -netdelay none -netspeed full

echo Waiting 20 seconds for emulator to boot...
timeout /t 20 >nul

echo ==== START ADB SERVER ====
"%SDK%\platform-tools\adb.exe" kill-server
"%SDK%\platform-tools\adb.exe" start-server
"%SDK%\platform-tools\adb.exe" devices -l

echo ==== WIRE METRO PORT 8081 ====
"%SDK%\platform-tools\adb.exe" reverse tcp:8081 tcp:8081

echo ==== START METRO SERVER ====
start cmd /k "cd /d %ROOT% && npx react-native start --reset-cache"

echo ==== BUILD + INSTALL APP ====
cd /d %ROOT%\android
call gradlew installDebug

echo ==== LAUNCH APP ====
"%SDK%\platform-tools\adb.exe" shell am start -n com.golfapp/.MainActivity

echo ==== OPEN LOGS ====
start cmd /k "cd /d %ROOT% && ^ 
  \"%SDK%\platform-tools\adb.exe\" logcat -v time *:S ReactNative:V ReactNativeJS:V AndroidRuntime:E"

echo ==== DONE! ====
endlocal
pause
