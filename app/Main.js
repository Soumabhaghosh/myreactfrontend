import React, { useState,useReducer,useEffect,Suspense } from "react"
import ReactDOM from "react-dom"
import { useImmerReducer } from "use-immer"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import Axios from "axios"
Axios.defaults.baseURL = "https://backend-f69l5.kinsta.app/"


import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
// My Components
// import LoadingDotsIcon from "./components/LoadingDotsIcon"
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Home from "./components/Home"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
// import CreatePost from "./components/CreatePost"
const CreatePost=React.lazy(()=> import("./components/CreatePost"))
const ViewSinglePost=React.lazy(()=> import("./components/ViewSinglePost"))
// import ViewSinglePost from "./components/ViewSinglePost"
import FlashMessages from "./components/FlashMessages"
import Profile from "./components/Profile"
import EditPost from "./components/EditPost"
import NotFound from "./components/NotFound"
const Search= React.lazy(()=> import("./components/Search") )
const Chat= React.lazy(()=> import("./components/Chat") )

import LoadingDotsIcon from "./components/LoadingDotsIcon"
// import { stat } from "@babel/core/lib/gensync-utils/fs"
function Main() {
  const initialstate={
    loggedIn : Boolean(localStorage.getItem("complexappToken")),
    flashMessages : [],
    user:{
      token:localStorage.getItem("complexappToken"),
      username:localStorage.getItem("complexappUsername"),
      avatar:localStorage.getItem("complexappAvatar")
    },
    isSearchOpen:false,
    isChatOpen:false,
    unreadChatCount:0,
    isPos:"",

  }
  

  
  function ourReducer(draft,action){
    switch(action.type){
      case "login":
        draft.loggedIn=true
        draft.user = action.data
        return
        
      case "logout":
        draft.loggedIn=false  
        return
      
      case "flashMessage":
          draft.flashMessages.push(action.value) 
          draft.isPos=action.isPos
          return
      case "openSearch":
        draft.isSearchOpen=true
        return
      case "closeSearch":
        draft.isSearchOpen=false
         return
      case "toggleChat":
        draft.isChatOpen=!draft.isChatOpen
        return
      case "closeChat":
        draft.isChatOpen=false 
        return
      case "incrementUnreadChatCount":
        draft.unreadChatCount++
        return
        case "clearUnreadChatCount":
          draft.unreadChatCount=0
          return    

    }
  }

  const [state,dispatch]=useImmerReducer(ourReducer,initialstate)


  useEffect(()=>{
      if(state.loggedIn){
        localStorage.setItem("complexappToken", state.user.token)
        localStorage.setItem("complexappUsername", state.user.username)
        localStorage.setItem("complexappAvatar", state.user.avatar)
       
      }
      else{
        localStorage.removeItem("complexappToken")
        localStorage.removeItem("complexappUsername")
        localStorage.removeItem("complexappAvatar")
      }
  }, [state.loggedIn])

  //Check if expired
  
  useEffect(()=>{
    if(state.loggedIn){
        //send axis request
        const ourRequest=Axios.CancelToken.source()
        async function fetchResults() {
            try {
                const response=await Axios.post('/checkToken',{token:state.user.token},{cancelToken:ourRequest.token})
                if(!response.data){
                  dispatch({type:"logout"})
                  dispatch({type:"flashMessage",value:"Session expired"})
                }
            } catch (e) {
                console.log("prolem");
            }
        }
        fetchResults()
        return ()=>ourRequest.cancel()

    }

})


  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} isPos={state.isPos}/>
          {/* {console.log(action.isPos)} */}
          <Header />
          <Suspense fallback={<LoadingDotsIcon/>} >
          <Routes>
            <Route path="/profile/:username/*" element={<Profile />} />
            
            <Route path="/" element={state.loggedIn? <Home />:<HomeGuest/> } />
            <Route path="/post/:id" element={<ViewSinglePost />} />
            <Route path="/post/:id/edit" element={<EditPost/>} />
            <Route path="/create-post" element={<CreatePost  />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound/>} />  
          </Routes>
          </Suspense> 
        <CSSTransition  timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
          <div className="search-overlay">
            <Suspense fallback="">
              <Search/>
            </Suspense>
          </div>
          </CSSTransition >
         <Suspense fallback="">
           {state.loggedIn && <Chat/>}
         </Suspense>
          <Footer />
        </BrowserRouter>
       </DispatchContext.Provider>
     </StateContext.Provider>
  )
}

ReactDOM.render(<Main />, document.querySelector("#app"))

if (module.hot) {
  module.hot.accept()
}
