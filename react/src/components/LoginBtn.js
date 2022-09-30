/*global reach*/

import React, {  useRef } from 'react'
import { Link } from 'react-router-dom';
import '../assets/css/home.css'

// import { loadStdlib } from '@reach-sh/stdlib'
// import MyAlgoConnect from '@reach-sh/stdlib/ALGO_MyAlgoConnect';

// const reach = loadStdlib("ALGO")
// reach.setWalletFallback(reach.walletFallback({
//         providerEnv: 'TestNet', MyAlgoConnect
// }));
    

const LoginBtn = (props) => {
    let to=props.to;

    const account = useRef()
    const balance = useRef()


    // const [accountBal, setAccountBal] = useState(0);
    // const [accountAddress, setAccountAddress] = useState('');


    const connectWallet = async (e) => {
        e.preventDefault()
        
        try {
            await getAccount()
            await getBalance()


        } catch (err) {
            console.log(err)
        }
    }

    const getAccount = async () => {
        try {
            account.current = await reach.getDefaultAccount()
            // setAccountAddress(account.current.networkAccount.addr)
            // console.log("Account :" + account.current.networkAccount.keys)
            console.log(JSON.stringify(account))
            console.log("Account :" + account.current.networkAccount.addr)
            localStorage.setItem('token', account.current.networkAccount.addr);
            window.location = '/'+to
        } catch (err) {
            console.log(err)
        }
    }

    const getBalance = async () => {
        try {
            let rawBalance = await reach.balanceOf(account.current)
            balance.current = reach.formatCurrency(rawBalance, 4)
            // setAccountBal(balance.current)
            console.log("Balance :" + balance.current)
            localStorage.setItem('balance', balance.current);

        } catch (err) {
            console.log(err)
        }

    }

    return (
        <p>
            <Link onClick={connectWallet} className="login" >Log in</Link>

        </p>
    )
}

export default LoginBtn