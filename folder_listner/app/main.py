import os
import time
import json
import requests
import urllib3
import sqlite3
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

API_URL = os.environ['API_URL']

urllib3.disable_warnings()
requests.packages.urllib3.disable_warnings()

# Configure retry strategy
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

retry_strategy = Retry(
    total=5,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["HEAD", "GET", "OPTIONS", "POST"]
)
adapter = HTTPAdapter(max_retries=retry_strategy)
http = requests.Session()
http.mount("http://", adapter)
http.mount("https://", adapter)

def mypost(url, obj):
    try:
        response = http.post(url, json=obj, verify=False, timeout=10)
        response.raise_for_status()
        return response
    except requests.exceptions.RequestException as e:
        print(f"Error posting data: {e}")
        return None

def processfile(filepath):
    parts = filepath.split('/')
    if len(parts) == 7:
        suc = parts[-1].split('.')[0]
        subject, papercode = parts[-2].split('-')
        examid = parts[-3]
        branch = parts[-4]
        obj = {
            "branch": branch,
            "examid": examid,
            "subject": subject,
            "papercode": papercode,
            "suc": suc,
            "filepath": filepath
        }
        response = mypost(API_URL, obj)
        if response:
            print(f"Successfully processed: {filepath}")
        else:
            print(f"Failed to process: {filepath}")

def init_db():
    with sqlite3.connect('/app/db/known_files.db', check_same_thread=False) as conn:
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS files
                     (filepath TEXT PRIMARY KEY, timestamp REAL)''')
        c.execute('CREATE INDEX IF NOT EXISTS idx_filepath ON files (filepath)')
        conn.commit()
    return sqlite3.connect('/app/db/known_files.db', check_same_thread=False)

def is_directory_modified_today(directory):
    today = datetime.now().date()
    mod_time = datetime.fromtimestamp(os.path.getmtime(directory))
    return mod_time.date() == today

def get_file_list(path):
    file_list = []
    for root, _, files in os.walk(path):
        if is_directory_modified_today(root):  # Check if the directory was modified today
            for file in files:
                if file.endswith(".pdf"):
                    file_list.append(os.path.join(root, file))
    return file_list

def process_file_batch(file_batch, conn):
    c = conn.cursor()
    current_time = time.time()
    new_files = []

    # Check which files are new
    for filepath in file_batch:
        print(filepath)
        c.execute("SELECT filepath FROM files WHERE filepath = ?", (filepath,))
        if c.fetchone() is None:
            new_files.append(filepath)
    
    # Insert new files
    c.executemany("INSERT OR IGNORE INTO files VALUES (?, ?)",
                  ((filepath, current_time) for filepath in new_files))
    
    conn.commit()
    return new_files

def scan_directory(path, conn):
    file_list = get_file_list(path)
    new_files = []
    batch_size = 1000

    with ThreadPoolExecutor(max_workers=4) as executor:
        future_to_batch = {executor.submit(process_file_batch, file_list[i:i+batch_size], conn): 
                           file_list[i:i+batch_size] for i in range(0, len(file_list), batch_size)}
        
        for future in as_completed(future_to_batch):
            new_files.extend(future.result())

    return new_files

def monitor_directory(path):
    conn = init_db()
    
    while True:
        start_time = time.time()
        new_files = scan_directory(path, conn)
        
        print(f"Scan completed in {time.time() - start_time:.2f} seconds")
        print(f"Found {len(new_files)} new files")
        
        for new_file in new_files:
            processfile(new_file)
        
        time.sleep(5)  # Sleep for 5 minutes between scans


path = "/app/uploads"  # Replace with the path to the folder you want to monitor
print(f"Monitoring folder and subfolders: {path}")

while True:
    try:
        monitor_directory(path)
    except Exception as e:
        print(f"An error occurred: {e}")
        print("Restarting monitoring in 60 seconds...")
        time.sleep(60)