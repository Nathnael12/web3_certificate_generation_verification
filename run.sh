#!/bin/bash

# start the react frontend
cd react

npm run start&

# start the API
cd ../api

uvicorn app:app --reload




