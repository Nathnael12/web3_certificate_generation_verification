/*global reach*/
import React from 'react'
// import algosdk from "algosdk";
import MyAlgoConnect from '@randlabs/myalgo-connect';
const algosdk = require('algosdk');

const Trainee = () => {

  // Function used to wait for a tx confirmation
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

  const hey = async () => {


    const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
    const port = '';
    const token = {
      'X-API-Key': 'F5w4DoU6Kg3pJlYR4Wsyh28decsbCirSqKMGrk1f'
    }

    const algodClient = new algosdk.Algodv2(token, baseServer, port);

    // const algodClient = new algosdk.Algodv2("", 'https://node.testnet.algoexplorerapi.io', '');
    const params = await algodClient.getTransactionParams().do();
    // let from = await reach.connect()
    // console.log("from:",from);
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: "WRP3DE4NEZNQ3W7FGI7NRLS2QMTLHO4Z4DKZNQBOVJZ7SWZMB5GPIUZ2NM",
      total: 1,
      decimals: 0,
      assetName: "asset 009",
      unitName: "my asset",
      assetURL: "url",
      assetMetadataHash: "mbBLKbJ36J+DRjXM1JO2qAGyUO79DF4=",
      defaultFrozen: false,
      freeze: undefined,
      manager: undefined,
      clawback: undefined,
      reserve: undefined,
      suggestedParams: params,
      // manager: "EUVBE6MISEX3QLZYERRCPJBJYXXSXM3GQU5DY6EEO7VGAHBFFEZLMXVET4",
      // reserve: "JLPXYTO2Z5KJWBG2HJLJHJYCRUNDU2AH6QQOYWA6G6CCGN6NJYSBR62CGA",
    });

    const myAlgoConnect = new MyAlgoConnect();
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
    console.log("asset", assetID);


  }



  return (
    <div>
      <button onClick={hey}>Click</button>
    </div>

  )
}

export default Trainee