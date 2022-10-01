/*global reach*/
import React, { useEffect, useState } from 'react'
// import algosdk from "algosdk";
import { optin } from '../utils/asset'
import '../assets/third_party/css/theme.css'
import '../assets/third_party/css/users.css'
import { Link } from 'react-router-dom';
const algosdk = require('algosdk');
const axios = require('axios')
const addr = localStorage.getItem('token')

const Trainee = () => {
  const [certificates, setCertificates] = useState([])
  useEffect(async () => {
    let response = await axios.get(`http://127.0.0.1:8000/getCertificates?addr="${addr}"`);
    console.log(response.data)
    let data = response.data ?? [];
    setCertificates([...data]);
  }, [])
  // Function used to wait for a tx confirmation


  const opt = async (e, assetId = "") => {
    e.preventDefault()
    let asset = ""
    if (assetId == "") {
      asset = Number(document.getElementById('assetId').value)

    }
    else {
      asset = assetId
    }
    await optin(asset)

    let update = {
      status: "Requested",
      remark: addr,
      asset: asset
    }

    await axios.post("http://127.0.0.1:8000/optinUpdate", update)
    window.location.reload()

  }
  const showCertificates = () => {

    const cert = [...certificates].map((e, i) => {

      return (<div className="" key={i}>
        <div className="user" key={i}>
          <div className="name">{1 + i}. {e[0]}</div>
          <div className="phone">{e[1]}</div>
          <div className="status">

            {
              e[1] == "Created" ?
                <div className="status text-center text-warning">
                  <p onClick={(p) => opt(p, e[0])} className={"btn btn-sm btn-info"}>Opt-in</p>
                </div> :
                e[1] == "Requested" ?
                  <div className="status">
                    <p className="txt-warning">Waiting Approval</p>
                  </div> :
                  e[1] == "Transfered" ?
                    <div>
                      <a target="_blank" href={`https://ipfs.stibits.com/${e[2]}`} className="btn btn-sm btn-info">Show</a>
                    </div> :
                    <div className=""></div>
            }

          </div>
        </div>
        <hr />
      </div>)



    })
    return cert;

  }
  const logout = (e) => {
    e.preventDefault()
    localStorage.clear()
    window.location = "/"
  }


  return (
    <div>
      <Link onClick={logout} to="" className="logout btn btn-sm btn-outline-secondary ">Logout</Link>
      <h4 className="display-4 mb-3 text-center text-danger font-weight-bold">Dashboard</h4>
      <p className='text-center p-3 box' >Labore vero lorem eos sed aliquy ipsum aliquy sed. Vero dolore dolore takima ipsum lorem rebum</p>


      <form className='w-80' onSubmit={opt}>
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

      <h4 className=" mb-3 text-center font-weight-bold">Your Certificates</h4>
      <div className="userList container">

        <div className="user" >
          <div className="text-bold name">Asset Id</div>
          <div className="text-bold phone">Status</div>
          <div className="text-bold status">Action</div>
        </div>
        {showCertificates()}
      </div>
    </div>

  )
}

export default Trainee