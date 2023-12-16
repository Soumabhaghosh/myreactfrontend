import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"
import HeaderLoggedOut from "./HeaderLoggedOut"
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from "../StateContext"
// import "../main.css"

function Header(props) {
 const appState =useContext(StateContext)

 const [isdark,setDark]=useState(false)


 function onClickHandler(){
  setDark(!isdark)
  console.log(isdark);
 }

  return (
    <header className="header-bar bg-warning mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-dark">
            MemoBook🚀🌐
          </Link>
          
        </h4>
        {appState.loggedIn ? <HeaderLoggedIn  /> : <HeaderLoggedOut/>}
      </div>
    </header>
  )
}

export default Header
