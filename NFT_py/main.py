import json
import hashlib
import os
from algosdk import mnemonic
from algosdk.v2client import algod
from algosdk.future.transaction import AssetConfigTxn, wait_for_confirmation
from create_account import create_account
from closeout_account import closeout_account

def create_non_fungible_token():
  # For ease of reference, add account public and private keys to
  # an accounts dict.
  print("--------------------------------------------")
  print("Creating account...")
  accounts = {}
  m = create_account()
  accounts[1] = {}
  accounts[1]['pk'] = mnemonic.to_public_key(m)
  accounts[1]['sk'] = mnemonic.to_private_key(m)

  # Change algod_token and algod_address to connect to a different client
  algod_token = "2f3203f21e738a1de6110eba6984f9d03e5a95d7a577b34616854064cf2c0e7b"
  algod_address = "https://academy-algod.dev.aws.algodev.network/"
  algod_client = algod.AlgodClient(algod_token, algod_address)

  print("--------------------------------------------")
  print("Creating Asset...")
  # CREATE ASSET
  # Get network params for transactions before every transaction.
  params = algod_client.suggested_params()
  # comment these two lines if you want to use suggested params
  # params.fee = 1000
  # params.flat_fee = True
    
  # JSON file
  dir_path = os.path.dirname(os.path.realpath(__file__))
  f = open (dir_path + '/NFT/metadata.json', "r")


  
  # Reading from file
  metadataJSON = json.loads(f.read())
  metadataStr = json.dumps(metadataJSON)

  hash = hashlib.new("sha512_256")
  hash.update(b"arc0003/amj")
  hash.update(metadataStr.encode("utf-8"))
  json_metadata_hash = hash.digest()


  # Account 1 creates an asset called latinum and
  # sets Account 1 as the manager, reserve, freeze, and clawback address.
  # Asset Creation transaction
  txn = AssetConfigTxn(
      sender=accounts[1]['pk'],
      sp=params,
      total=1,
      default_frozen=False,
      unit_name="ALICE001",
      asset_name="Alice's Artwork 001",
      manager=accounts[1]['pk'],
      reserve=None,
      freeze=None,
      clawback=None,
      strict_empty_address_check=False,
      url="https://path/to/my/asset/details", 
      metadata_hash=json_metadata_hash,
      decimals=0)

  # Sign with secret key of creator
  stxn = txn.sign(accounts[1]['sk'])

  # Send the transaction to the network and retrieve the txid.
  txid = algod_client.send_transaction(stxn)
  print("Asset Creation Transaction ID: {}".format(txid))


  # Wait for the transaction to be confirmed
  confirmed_txn = wait_for_confirmation(algod_client, txid, 4)  
  print("TXID: ", txid)
  print("Result confirmed in round: {}".format(confirmed_txn['confirmed-round']))
  try:
      # Pull account info for the creator
      # account_info = algod_client.account_info(accounts[1]['pk'])
      # get asset_id from tx
      # Get the new asset's information from the creator account
      ptx = algod_client.pending_transaction_info(txid)
      asset_id = ptx["asset-index"]
      print_created_asset(algod_client, accounts[1]['pk'], asset_id)
      print_asset_holding(algod_client, accounts[1]['pk'], asset_id)
  except Exception as e:
      print(e)

  print("--------------------------------------------")
  print("You have successfully created your own Non-fungible token! For the purpose of the demo, we will now delete the asset.")
  print("Deleting Asset...")

  # Asset destroy transaction
  txn = AssetConfigTxn(
      sender=accounts[1]['pk'],
      sp=params,
      index=asset_id,
      strict_empty_address_check=False
      )

  # Sign with secret key of creator
  stxn = txn.sign(accounts[1]['sk'])
  # Send the transaction to the network and retrieve the txid.
  txid = algod_client.send_transaction(stxn)
  print("Asset Destroy Transaction ID: {}".format(txid))

  # Wait for the transaction to be confirmed
  confirmed_txn = wait_for_confirmation(algod_client, txid, 4)  
  print("TXID: ", txid)
  print("Result confirmed in round: {}".format(confirmed_txn['confirmed-round']))
  # Asset was deleted.
  try:
      print_asset_holding(algod_client, accounts[1]['pk'], asset_id)
      print_created_asset(algod_client, accounts[1]['pk'], asset_id)
      print("Asset is deleted.")
  except Exception as e:
      print(e)
  
  print("--------------------------------------------")
  print("Sending closeout transaction back to the testnet dispenser...")
  closeout_account(algod_client, accounts[1] )


#   Utility function used to print created asset for account and assetid
def print_created_asset(algodclient, account, assetid):
  # note: if you have an indexer instance available it is easier to just use this
  # response = myindexer.accounts(asset_id = assetid)
  # then use 'account_info['created-assets'][0] to get info on the created asset
  account_info = algodclient.account_info(account)
  idx = 0
  for my_account_info in account_info['created-assets']:
    scrutinized_asset = account_info['created-assets'][idx]
    idx = idx + 1       
    if (scrutinized_asset['index'] == assetid):
      print("Asset ID: {}".format(scrutinized_asset['index']))
      print(json.dumps(my_account_info['params'], indent=4))
      break

#   Utility function used to print asset holding for account and assetid
def print_asset_holding(algodclient, account, assetid):
    # note: if you have an indexer instance available it is easier to just use this
    # response = myindexer.accounts(asset_id = assetid)
    # then loop thru the accounts returned and match the account you are looking for
    account_info = algodclient.account_info(account)
    idx = 0
    for my_account_info in account_info['assets']:
        scrutinized_asset = account_info['assets'][idx]
        idx = idx + 1        
        if (scrutinized_asset['asset-id'] == assetid):
            print("Asset ID: {}".format(scrutinized_asset['asset-id']))
            print(json.dumps(scrutinized_asset, indent=4))
            break

create_non_fungible_token()