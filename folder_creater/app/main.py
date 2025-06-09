from kafka import KafkaConsumer
import socket
import json
import os
import requests
import urllib3
import re

urllib3.disable_warnings()
requests.packages.urllib3.disable_warnings()

KAFKA_BOOTSTRAP_SERVER_IP=os.environ['KAFKA_BOOTSTRAP_SERVER_IP']
GROUP_ID=os.environ['KAFKA_GROUP_ID']+"1"
TOPIC = 'digival-subject-papercode-map'

def mypost(url,obj):
    return requests.post(url, json = obj,verify=False)

def remove_special_characters(input_string):
    # This regex pattern matches any character that is not a letter or digit
    cleaned_string = re.sub(r'[^a-zA-Z0-9]', '', input_string)
    return cleaned_string 

def create_folder_from_json(data):
    # Extract necessary fields
    branch = data['branch']
    examid = data['examid']
    subject = remove_special_characters(data['subjectname'])
    papercode = data['papercode']
    # Create the directory path
    folder_path = f"/app/uploads/{branch}/{examid}/{subject}-{papercode}"
    print(folder_path)
    # Create the directory
    os.makedirs(folder_path, exist_ok=True)

consumer = KafkaConsumer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVER_IP,
    client_id=socket.gethostname(),
    value_deserializer=lambda v: json.loads(v.decode('utf-8')),
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    auto_commit_interval_ms=10,
    group_id=GROUP_ID,
    max_poll_records=10,  
    max_poll_interval_ms=10000
)

consumer.subscribe(topics=TOPIC)
partitions = consumer.partitions_for_topic(TOPIC)

for message in consumer:
    try: 
        consumer.commit()
        data = message.value["data"]
        create_folder_from_json(data)
     
    except Exception as e :
        print(e)
    
    
   