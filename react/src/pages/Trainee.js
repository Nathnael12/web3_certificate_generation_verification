/*global reach*/
import React from 'react'
// import algosdk from "algosdk";
import { optin } from '../utils/asset'
const algosdk = require('algosdk');

const Trainee = () => {

  // Function used to wait for a tx confirmation


  const opt = async (e) => {
    e.preventDefault()
    let assetId = Number(document.getElementById('assetId').value)
    await optin(assetId)
  }



  return (
    <div>
      <form onSubmit={opt}>
        <input type="text"
          name=""
          id="assetId"
          required
          placeholder='Asset Id'
          onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
        />
        <input type="submit" value="Request Transfer" />
      </form>
    </div>

  )
}

export default Trainee