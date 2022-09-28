import React, {useState, useRef} from 'react'
import { loadStdlib } from '@reach-sh/stdlib'
import MyAlgoConnect from '@reach-sh/stdlib/ALGO_MyAlgoConnect';
import ConnectWalletButton from './ConnectButton/ConnectWalletBtn';
import { MyAlgoWalletMain } from './MyAlgoWallet.styles';

const reach = loadStdlib("ALGO")

reach.setWalletFallback(reach.walletFallback({
  providerEnv: 'TestNet', MyAlgoConnect })); 

const MyAlgoWallet = () => {

    const account = useRef()
    const balance = useRef()


    const [accountBal, setAccountBal] = useState(0);
    const [accountAddress, setAccountAddress] = useState('');


    const connectWallet = async () =>{
        try{
            await getAccount()
            await getBalance()
            
                
        }catch(err){
            console.log(err)
        }
    }

    const getAccount = async () => {
        try{
           account.current = await reach.getDefaultAccount()
            setAccountAddress(account.current.networkAccount.addr)
            console.log("Account :" + account.current.networkAccount.addr)
            localStorage.setItem('token', account.current.networkAccount.addr);
            window.location = '/trainee'
        }catch(err){
            console.log(err)
        }
    }

    const getBalance = async () => {
        try{
              let rawBalance = await reach.balanceOf(account.current)
                balance.current = reach.formatCurrency(rawBalance, 4)
                setAccountBal(balance.current)
            console.log("Balance :" + balance.current)
        }catch(err){
            console.log(err)
        }
      
    }

    return(
        <MyAlgoWalletMain>
            {/* <img src= {myalgo} alt="My Algo" height= "70px"/> */}
            <ConnectWalletButton accountAddress={accountAddress} connectWallet = {connectWallet} accountBal = {accountBal}/>
        </MyAlgoWalletMain>
    )
}

export default MyAlgoWallet