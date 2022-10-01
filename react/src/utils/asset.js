/*global reach*/
import MyAlgoConnect from '@randlabs/myalgo-connect';

const algosdk = require('algosdk');
const myAlgoConnect = new MyAlgoConnect();
const sender = localStorage.getItem('token')

const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
const port = '';
const token = {
    'X-API-Key': 'F5w4DoU6Kg3pJlYR4Wsyh28decsbCirSqKMGrk1f'
}

const algodClient = new algosdk.Algodv2(token, baseServer, port);

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

export const createAsset = async (hash, reserve = undefined) => {

    const params = await algodClient.getTransactionParams().do();

    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: sender,
        total: 1,
        decimals: 0,
        assetName: "Traine Certificate",
        unitName: "Cert",
        assetURL: "https://ipfs.stibits.com/" + hash,
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

export const upload = () => {
}

export const optin = async (assetID) => {

    console.log(assetID);
    let note="Opt-in"
    const params = await algodClient.getTransactionParams().do();
    
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        suggestedParams: {
            ...params,
        },
        from: sender,
        to: sender,
        assetIndex:assetID,
        amount: 0
    });
    const signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
    console.log("txn", signedTxn);

    const tx = (await algodClient.sendRawTransaction(signedTxn.blob).do());
    // wait for transaction to be confirmed
    await waitForConfirmation(algodClient, tx.txId);
    // Get the new asset's information from the creator account
    let ptx = await algodClient.pendingTransactionInformation(tx.txId).do();
    console.log("ptx:",ptx);

    
}

export const transfer = async (assetID,receiver) => {

    const params = await algodClient.getTransactionParams().do();

    let recipient = receiver;
    let closeRemainderTo = undefined;
    let revocationTarget = undefined;
    let amount = 1;
    let note = undefined;

    let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender, 
        recipient, 
        closeRemainderTo, 
        revocationTarget,
        amount,  
        note, 
        assetID, 
        params);


    const signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
    console.log("txn", signedTxn);

    const tx = (await algodClient.sendRawTransaction(signedTxn.blob).do());
    // wait for transaction to be confirmed
    await waitForConfirmation(algodClient, tx.txId);
    // Get the new asset's information from the creator account
    let ptx = await algodClient.pendingTransactionInformation(tx.txId).do();
    console.log("ptx:",ptx);

    
}

// export { createAsset, upload, optin }