/*global reach*/
import React, { useState } from 'react'
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { createAsset, upload } from '../utils/asset'
const axios = require('axios')
const algosdk = require('algosdk');
const myAlgoConnect = new MyAlgoConnect();


const mint = async (e) => {
    
    e.preventDefault()

    let hash = await axios.post('http://127.0.0.1:8000/mint', {})
    let assetID = await createAsset(hash)
    let email = document.getElementById('email').value
    console.log(email);
    await axios.post('http://127.0.0.1:8000/mail', {"address":email,"asset_id":assetID})

    console.log(hash);
    console.log(assetID);

}


const Trainer = () => {
    
    
    const [trainees, setTrainees] = useState([])
    
    return (
        <div>
            <form onSubmit={mint}>
                <input type="email" name="" id="email" required placeholder='trainee@server.com' />
                <input type="submit" value="Mint Asset"/>
            </form>
        </div>
    )
}

export default Trainer