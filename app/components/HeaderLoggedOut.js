import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import { useNavigate } from "react-router-dom"


function HeaderLoggedOut() {
  const appDispatch = useContext(DispatchContext)
  // const appState = useContext(StateContext)
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const navigate=useNavigate()


  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/login", { username, password })
      // console.log(response.data);
      if (response.data) {
       
        appDispatch({ type: "login", data: response.data})
        appDispatch({type:"flashMessage",value:"You have Successfully logged in",isPos:"success"})
        // navigate("/")
        console.log(response.data)
        // console.log("logged in");
        
      } else {
        // alert("Incorrenct username or password")
        appDispatch({type:"flashMessage",value:"Invalid username /password",isPos:"danger"})
      }
    } catch (e) {
      console.log("There was a problem.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
        </div>
        <div className="col-md-auto">
          
          <button onClick={handleSubmit} className="btn btn-danger btn-sm">Sign In</button>
          
         
          
          
        </div>
      </div>
    </form>
  )
}

export default HeaderLoggedOut
