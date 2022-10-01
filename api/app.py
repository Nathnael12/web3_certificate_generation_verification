import sys
# from api.scripts.sql_db import createDB, createTable, db_get_values_by_asset, insert_to_table, update_table
sys.path.append(f'./scripts')
from send_email import send
from sql_db import *
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


class receiver(BaseModel):
    address: str
    asset_id: str


class Table(BaseModel):
    db_name: str
    schema_name: str


class Data(BaseModel):

    trainee: str
    email: str
    asset: str
    status: str
class Insert(BaseModel):

    db_name: str
    tb_data: Data
    table_name: str
    
class Update(BaseModel):

    asset: str
    status: str
    email: str


@app.post("/mint")
def create_upload_file():

    # Set file path
    file_path = 'crt.jpg'

    # POST method
    headers = {'pinata_api_key': API_KEY, 'pinata_secret_api_key': API_SECRET}
    endpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS"

    if os.path.isfile(file_path):
        with open(file_path, 'rb') as filedata:
            response = requests.post(
                endpoint, headers=headers, files={'file': filedata})

    # Print result
    print(response.text)

    # Store hash
    hash = response.json()['IpfsHash']
    return hash
# Now you can see your image on the IPFS : https://ipfs.stibits.com/<your_hash>


@app.post("/mail")
def mail(rec: receiver):
    send(rec.asset_id, rec.address)


@app.post("/createDb")
def create_db(name: str):
    createDB(name)


@app.post("/createTable")
def create_table(table: Table):
    createTable(table.db_name, table.schema_name)


@app.post("/insert")
def insert(data: Insert):
    json_stream=(data.tb_data.json())
    insert_to_table(data.db_name, json_stream, data.table_name) 
    # return str(data.tb_data.json())

@app.post("/update")
def update(data: Update):
    json_stream=(data.json())

    update_table("trainee", json_stream, "trainee")

@app.get("/getall")
def get_all():
    return db_get_values()

@app.get("/getTrainee")
def get_trainee(asset):
    return db_get_values_by_asset(asset)
