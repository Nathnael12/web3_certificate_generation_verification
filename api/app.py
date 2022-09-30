import json
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile
import os 
import requests

from fastapi.middleware.cors import CORSMiddleware
from config import *

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/check")
def check():
  return "Your API is up!"

class Item(BaseModel):
    name: str
    description: str

@app.post("/items")
def predict_news(item:Item):

    return item


@app.post("/mint")
def  create_upload_file():

# Set API Keys
    pinata_api_key = '<api_key>'
    pinata_secret_api_key = '<secret_api_key>'

    # Set file path
    file_path = 'crt.jpg'

    # POST method
    headers = {'pinata_api_key': API_KEY, 'pinata_secret_api_key':API_SECRET}
    endpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS"

    if os.path.isfile(file_path):
        with open(file_path, 'rb') as filedata:
            response = requests.post(endpoint, headers=headers, files={'file': filedata})

    # Print result    
    print(response.text)

    # Store hash
    hash = response.json()['IpfsHash']
    return hash
# Now you can see your image on the IPFS : https://ipfs.stibits.com/<your_hash>