/*global reach*/
import React, { useEffect, useState } from 'react'
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { createAsset, transfer } from '../utils/asset'
import { Link } from 'react-router-dom';
const axios = require('axios')
const algosdk = require('algosdk');
const myAlgoConnect = new MyAlgoConnect();

const mint = async (e,id="") => {

    e.preventDefault()
    let hash = await axios.post('http://127.0.0.1:8000/mint', {})
    let assetID = await createAsset(hash)
    // console.log(email);
    if (id=="") {
        let email = document.getElementById('email').value
        await axios.post('http://127.0.0.1:8000/mail', { "address": email, "asset_id": assetID })
        let trainee = {
            trainee: "-",
            email: email,
            asset: parseInt(assetID),
            status: "Created"
        }
        let postData={
            db_name: "trainee",
            tb_data: trainee,
            table_name: "trainee"
        }
        await axios.post(`http://127.0.0.1:8000/insert`,postData)

    }
    else{
        let email = document.getElementById("email-"+id).innerHTML
        console.log(email);

        await axios.post('http://127.0.0.1:8000/mail', { "address": email, "asset_id": assetID })
        
        let updateData = {
            asset:assetID,
            status:"Created",
            email:email
        }

        await axios.post(`http://127.0.0.1:8000/update`,updateData)

    }

    window.location.reload()
    // console.log(hash);
    // console.log(assetID);

}

const asset_transfer = async (e,assetID)=>{
    e.preventDefault()

    let response = await axios.get(`127.0.0.1:8000/getTrainee?asset=${assetID}`) 
    let receiver = response.data[0][0]
    let email = response.data[0][1]

    await transfer(assetID,receiver)

    let updateData = {
        asset:assetID,
        status:"Transfered",
        email:email
    }

    await axios.post(`http://127.0.0.1:8000/update`,updateData)

    window.location.reload()

}

const decline = async (e,assetID)=>{

    e.preventDefault()
    let response = await axios.get(`127.0.0.1:8000/getTrainee?asset=${assetID}`) 
    let email = response.data[0][1]

    let updateData = {
        asset:assetID,
        status:"Created",
        email:email
    }

    await axios.post(`http://127.0.0.1:8000/update`,updateData)
    window.location.reload()


}

const Trainer = () => {


    const [trainees, setTrainees] = useState([])
    useEffect(async () => {
        let response = await axios.get(`http://127.0.0.1:8000/getall`);
        // console.log(response)
        let data = response.data;
        setTrainees([...data]);
    }, [])

    const logout = (e) => {
        e.preventDefault()
        localStorage.clear()
        window.location = "/"
    }
    
    const showTrainees = () => {
        const users = [...trainees].map((e, i) => {
            return <div className="" key={i}>
                <div className="user" key={i}>
                    <div className="name">{1 + i}. {e[1]}</div>
                    <div id={"email-"+e[0]} className="phone">{e[2] ?? "-"}</div>
                    <div className="phone">{e[4] ?? "-"}</div>
                    {
                        e[4] == "None" ?
                            <div className="status">
                                <div className="status">
                                    <p onClick={(p)=>mint(p,e[0])} className={"btn btn-sm btn-info"}>Create</p>
                                </div>
                            </div> :
                            e[4] == "Created" ?
                                <div className="status text-center text-warning">
                                    Waiting for <br /> Opt-in
                                </div> :
                                e[4] == "Requested" ?
                                    <div className="status">
                                        <p onClick={(ev)=>transfer(ev,e[3])} className="btn btn-sm btn-success">Approve</p>
                                        <p onClick={(ev)=>decline(ev,e[3])} className="btn btn-sm btn-danger">Decline</p>
                                    </div> : <div></div>
                    }
                </div>
                <hr />
            </div>
        })
        return users
    }
    
    return (
        <div>

            <Link onClick={logout} to="" className="logout btn btn-sm btn-outline-secondary ">Logout</Link>
            <h4 className="display-4 mb-3 text-center text-danger font-weight-bold">Dashboard</h4>
            <p className='text-center p-3 box' >Labore vero lorem eos sed aliquy ipsum aliquy sed. Vero dolore dolore takima ipsum lorem rebum</p>


            <form className='w-80' onSubmit={mint}>
                <input type="email" name="" id="email" required placeholder='trainee@server.com' />
                <input type="submit" value="Create Asset" />
            </form>

            <h4 className=" mb-3 text-center font-weight-bold">Trainees</h4>
            <div className="userList container">
                <div className="user" >
                    <div className="text-bold name">Name</div>
                    <div className="text-bold phone">Email</div>
                    <div className="text-bold phone">Status</div>
                    <div className="text-bold status">Action</div>
                </div>
                {showTrainees()}


            </div>




        </div>
    )
}

export default Trainer