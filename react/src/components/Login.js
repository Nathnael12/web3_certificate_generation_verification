
import Header from './Header/header'
import MyAlgoWallet from './MyAlgoWallet/MyAlgoWallet'
import { Main, MainBody } from '../Main.styles' 

const Login = () => {

    const isAuthenticated = localStorage.getItem("token");
    if(isAuthenticated){
        window.location="/" 
    }
    return (
        <MainBody>
            <Header />
            <Main>
                <MyAlgoWallet />
            </Main>
        </MainBody>


    )
}

export default Login;