import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import ReactTooltip from "react-tooltip"

import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext)
  const appState=useContext(StateContext)

 


  function handleLogout() {
    appDispatch({ type: "logout" })
    appDispatch({type:"flashMessage",value:"You have Successfully logged out",isPos:"danger"})
    // appDispatch
  }
  function handleSearchIcon(e){
    
    e.preventDefault()
    appDispatch({type: "openSearch"})

  }

  return (
    <div className="flex-row my-3 my-md-0">
          <a  data-for="search" data-tip="Search" onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon">
            <i className="fas fa-search"></i>
          </a>{"      "}
          <ReactTooltip place="bottom" id="search" className="custom-tooltip"/>
          <span onClick={()=> appDispatch({type:"toggleChat"})}  className={"mr-2 header-chat-icon "+( appState.unreadChatCount ? "text-danger":"text-white") }>
            <i className="fas fa-comment"></i>
           {appState.unreadChatCount?  <span className="chat-count-badge text-white">{appState.unreadChatCount<10 ? appState.unreadChatCount:"9+"} </span>:""}
          </span>
          {"      "}
          <Link to={`/profile/${appState.user.username}`} className="mr-2">
            <img className="small-header-avatar" src={appState.user.avatar} />
          </Link>
          {"      "}
          <Link className="btn btn-sm btn-danger mr-2" to="/create-post">
            Create Post
          </Link>
          {"      "}
          <Link to="/"> <button  onClick={handleLogout} className="btn btn-sm btn-danger">
            Sign Out
          </button></Link>
         
          
         
        </div>
  )
}

export default HeaderLoggedIn
