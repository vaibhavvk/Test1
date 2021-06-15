import os
import subprocess
import sys
import time

import shutil
import json
import zipfile


time.sleep(10)

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    import requests
except:
    install("requests")
    import requests


app_folder = "Cricclub"
update_folder = str(os.getcwd())
details_file = "Cricclub/details.txt"
device_details_file = "Configurations/device_details.txt"
download_zip = "Cricclub.zip"
download_updater = "new_main.py"
updated_code_folder = "Updates/Cricclub"
update_check_link = "https://www.niltech.in/cricclub-update.php"
update_report_link = "https://www.niltech.in/cricclub-update-report.php?device_id="

current_version_updater = 0.3

def update_updater(cv, lv):
    if lv > cv:
        print("Updater Updates Available at: ", data["download_link_updater"])
        temp_up = requests.get(data["download_link_updater"], allow_redirects=True)
        print(temp_up.status_code)
        if temp_up.status_code == 200:
            print("Downloading New Updater")
            open(download_updater, 'wb').write(temp_up.content)
            print("New Updater Download Completed")
            os.remove('main.py')
            os.rename(download_updater, 'main.py')
            print('Updater Updated')
            return 1
        return 0
    return 2

def update_app(cv, lv):
    if lv > cv:
        print("App Updates Available at: ", data["download_link_app"])
        try:
            old_list = set(os.listdir())
            print("Downloading New Zip")
            r = requests.get(data["download_link_app"], allow_redirects=True)
            if r.status_code == 200:
                print("Downloading App Update")
                open(download_zip, 'wb').write(r.content)
                print("App Update Download Completed")
                with zipfile.ZipFile(download_zip, 'r') as zip_ref:
                    zip_ref.extractall(update_folder)
                print("Extraction Done")
                new_list = set(os.listdir())
                
                try:
                    new_list.remove('__MACOSX')
                    shutil.rmtree('__MACOSX')
                except:
                    pass

                try:
                    old_list.remove('__MACOSX')
                except:
                    pass
                
                new_thing = new_list.difference(old_list)
                print('New Thing', new_thing)

                try:
                    print("Removing Old App Folder")
                    shutil.rmtree(app_folder)
                    print("Old App Folder Removed")
                except Exception as e:
                     print("Old App Folder Removed: ", e)

                os.rename(list(new_thing)[0], app_folder)
                print('Updated the App Folder')
                resp = requests.get(update_report_link+device_id+"&update_type=app")
                print("App Reporting: ", resp.status_code)

                return 1

        except Exception as e:
            print("Downloading Failed", e)
            return 0

    else:
        print("Already at Latest Version.")
        return 2


try:
    
    
    #Get Current Version of App
    details = open(details_file)
    details = json.loads(details.read())
    current_version_app = float(details["version"])

    device_details = open(device_details_file)
    device_details = json.loads(device_details.read())
    device_id = str(device_details["device_id"])
    print('Device Id: ', device_id)
    
    resp = requests.get(update_check_link)
    data = resp.json()
    print(data)
    latest_version_updater = float(data['update_version_updater'])
    latest_version_app = float(data['update_version_app'])

    print('Updater: ', current_version_updater, latest_version_updater)
    print('App: ', current_version_app, latest_version_app)

    status = update_updater(current_version_updater, latest_version_updater)
    if status == 2:
        print('No Updater Update Available')
    elif status == 0:
        print("New Updater Update Failed, Will Try Next Time")
    elif status == 1:
        print("New Updater Updated")
        resp = requests.get(update_report_link+device_id+"&update_type=updater")
        print("Updater Reporting: ", resp.status_code)
        if sys.platform != 'darwin' and sys.platform != 'win32':
            print('Rebooting System')
            #os.system('sudo reboot')
    status = update_app(current_version_app, latest_version_app)
    
except Exception as e:
    print("ERROR", e)


#HTML Triggering Code here


