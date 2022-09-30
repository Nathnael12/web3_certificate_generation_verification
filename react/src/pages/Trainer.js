/*global reach*/
import React, { useState } from 'react'
import MyAlgoConnect from '@randlabs/myalgo-connect';
import {createAsset,upload} from '../utils/asset'
const axios = require('axios')
const algosdk = require('algosdk');
const myAlgoConnect = new MyAlgoConnect();



const mint = async () => {
    let hash= await axios.post('http://127.0.0.1:8000/mint',{})
    let assetID=await createAsset(hash)
    console.log(hash);
    console.log(assetID);
    
}

const Trainer = () => {
const [email, setemail] = useState("")

    return (
        <div>
            <input type="text" name="" id="" placeholder='trainee@server.com' required />
            <button onClick={mint}>Mint Asset</button>
        </div>
    )
}

export default Trainer