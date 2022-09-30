/*global reach*/
import MyAlgoConnect from '@randlabs/myalgo-connect';
import dotenv from 'dotenv'
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');


const algosdk = require('algosdk');
const myAlgoConnect = new MyAlgoConnect();
const waitForConfirmation = async function (algodclient, txId) {
    let response = await algodclient.status().do();
    let lastround = response["last-round"];
    while (true) {
        const pendingInfo = await algodclient.pendingTransactionInformation(txId).do();
        if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
            //Got the completed Transaction
            console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
            break;
        }
        lastround++;
        await algodclient.statusAfterBlock(lastround).do();
    }
};

const createAsset = async (hash,reserve = undefined) => {
    const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
    const port = '';
    const token = {
        'X-API-Key': 'F5w4DoU6Kg3pJlYR4Wsyh28decsbCirSqKMGrk1f'
    }

    const algodClient = new algosdk.Algodv2(token, baseServer, port);

    const params = await algodClient.getTransactionParams().do();
    let from = localStorage.getItem('token')
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: from,
        total: 1,
        decimals: 0,
        assetName: "asset 009",
        unitName: "my asset",
        assetURL: "https://ipfs.stibits.com/"+hash,
        assetMetadataHash: "mbBLKbJ36J+DRjXM1JO2qAGyUO79DF4=",
        defaultFrozen: false,
        freeze: undefined,
        manager: undefined,
        clawback: undefined,
        reserve: reserve,
        suggestedParams: params,
        // manager: "EUVBE6MISEX3QLZYERRCPJBJYXXSXM3GQU5DY6EEO7VGAHBFFEZLMXVET4",
        // reserve: "JLPXYTO2Z5KJWBG2HJLJHJYCRUNDU2AH6QQOYWA6G6CCGN6NJYSBR62CGA",
    });

    const signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
    console.log("txn", signedTxn);

    const tx = (await algodClient.sendRawTransaction(signedTxn.blob).do());
    let assetID = null;
    // wait for transaction to be confirmed
    await waitForConfirmation(algodClient, tx.txId);
    // Get the new asset's information from the creator account
    let ptx = await algodClient.pendingTransactionInformation(tx.txId).do();
    assetID = ptx["asset-index"];
    //Get the completed Transaction
    // assetID = confirmedTxn["asset-index"];
    // console.log("asset", assetID);
    return assetID
}

const upload = () => {

    
}

export { createAsset, upload }



