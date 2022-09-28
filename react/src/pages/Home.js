import React from 'react'
// import { Link } from 'react-router-dom';
import LoginBtn from '../components/LoginBtn';
import '../assets/css/home.css';

const Home = () => {
    return (
        <div>
            <div className="pane-wrapper">

                <div className="left-pane">
                    <div className="d-col">
                        <h2 className="logo">Ten Academy Smart Certificate System</h2>
                        <div className="text">This web app enables users/admins to generate or receive certificate tokens</div>
                    </div>
                </div>

                <div className="right-pane">
                    <div className="login-info">
                        <div className="img">
                            <img src="https://static.wixstatic.com/media/081e5b_5553803fdeec4cbb817ed4e85e1899b2~mv2.png/v1/fill/w_246,h_106,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/10%20Academy%20FA-02%20-%20transparent%20background%20-%20cropped.png" alt="10 Academy logo" className='logo-img' srcset="" />
                        </div>
                        <div className="">
                            <p className='who'>Who Are You?</p>
                        </div>
                        <div className="columns">
                            <div className="for-trainee top-text">
                                <p> Trainee</p>
                                <ul>
                                    <li>Completed your course?</li>
                                    <li>No lef Pay?</li>
                                    <li>Then optin your certificate</li>
                                </ul>
                                <p> 
                                {/* <Link className="login" to="/trainee">Log in</Link> */}
                                <LoginBtn to={"trainee"}/>

                                </p>
                            </div>
                            <div className="for-admin top-text">
                                <p>Admin</p>
                                <ul>
                                    <li>Wanna mint trainee's Certificate</li>
                                    <li>Handle any pending request from trainees</li>
                                    <li>Then Login to your account below</li>
                                </ul>
                                <p>
                                <LoginBtn to={"admin"}/>

                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Home