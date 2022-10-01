/*global reach*/
import React from 'react'
// import algosdk from "algosdk";
import { optin } from '../utils/asset'
import '../assets/third_party/css/theme.css'
import '../assets/third_party/css/users.css'
import { Link } from 'react-router-dom';
const algosdk = require('algosdk');

const Trainee = () => {

  // Function used to wait for a tx confirmation


  const opt = async (e) => {
    e.preventDefault()
    let assetId = Number(document.getElementById('assetId').value)
    await optin(assetId)
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

        <div className="" key={"e._id"}>
          <div className="user" key={"e._id"}>
            <div className="name">{1}. {"e.Asset_id"}</div>
            <div className="phone">{"e.Status" ?? "-"}</div>
            <div className="status">
              <p className="btn btn-sm btn-info">Show</p>
            </div>
          </div>
          <hr />
        </div>

      </div>

    </div>

  )
}

export default Trainee