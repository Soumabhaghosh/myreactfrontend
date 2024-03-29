import React, { useEffect, useState,useContext } from "react"
import Page from "./Page"
import Axios from "axios"
import { useImmerReducer } from "use-immer"
import { CSSTransition } from "react-transition-group"
import DispatchContext from "../DispatchContext"

function HomeGuest() {
  const appDispatch = useContext(DispatchContext)

  const initialState={
    username:{
      value:"",
      hasErrors:false,
      message:"",
      isUnique:false,
      checkCount:0,
    },
    email:{
      value:"",
      hasErrors:false,
      message:"",
      isUnique:false,
      checkCount:0,
    },
    password:{
    
        value:"",
        hasErrors:false,
        message:"",
   
  
    },
    submitCount:0
  }

  function ourReducer(draft,action){

    switch(action.type){
      case "usernameImmediately":
        draft.username.hasErrors=false
        draft.username.value=action.value
        if(draft.username.value.length > 30){
          draft.username.hasErrors=true
          draft.username.message="more than 30 charecters"

        }
        
        if(draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value) ){
            draft.username.hasErrors=true
            draft.username.message="Username can only contain alphanumeric charecters"
        }
        return
      case "usernameAfterDelay" :
        if(draft.username.value.length<3){
          draft.username.hasErrors=true
          draft.username.message="must be alleast 3 chars"

        }
        if(!draft.hasErrors){
          draft.username.checkCount++
        }

        return
      case "usernameUniqueResults":
        if(action.value){
          draft.username.hasErrors = true
          draft.username.isUnique = false
          draft.username.message="That username is already taken."
        }
        else{
          draft.username.isUnique = true

        }


        return
      case "emailImmediately":
        draft.email.hasErrors=false
        draft.email.value=action.value

        return 
      case "emailAfterDelay":
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(draft.email.value)){
            draft.email.hasErrors=true
            draft.email.message="you must provide a valid email"
        }
        if(!draft.email.hasErrors){
          draft.email.checkCount++
        }
        return 
        case "emailUniqueResults":
          if(action.value){
        draft.email.hasErrors=true
        draft.email.isUnique=false
        draft.email.message ="That email is already used"   
          }
          else{
                draft.email.isUnique=true
          }

        return  
      case "passwordImmediately":
        draft.password.hasErrors=false
        draft.password.value=action.value
        if(draft.password.value.length>50){
         draft.password.hasErrors=true
          draft.password.message="Password cannot more than 50 charecters"
        

        }
        return
      case  "passwordAfterDelay":
        if(draft.password.value.length<12){
          draft.password.hasErrors=true
          draft.password.message="Password must be at least 12 charecters."
        }
        return
      case "submitForm":
        // if(!draft.password.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique)  {
        //   draft.submitCount++
        // }
        draft.submitCount++

        
    }

  }

  const [state,dispatch]=useImmerReducer(ourReducer,initialState)
  useEffect(()=>{

    if(state.username.value){
      const delay=setTimeout(() => dispatch({type:"usernameAfterDelay"}),800)

      return ()=>clearTimeout(delay)

    }

  },[state.username.value])

  useEffect(()=>{

    if(state.email.value){
      const delay=setTimeout(() => dispatch({type:"emailAfterDelay"}),800)

      return ()=>clearTimeout(delay)

    }

  },[state.email.value])
  useEffect(()=>{

    if(state.password.value){
      const delay=setTimeout(() => dispatch({type:"passwordAfterDelay"}),800)

      return ()=>clearTimeout(delay)

    }

  },[state.password.value])

  useEffect(()=>{
    if(state.username.checkCount){
        //send axis request
        const ourRequest=Axios.CancelToken.source()
        async function fetchResults() {
            try {
                const response=await Axios.post('/doesUsernameExist',{username:state.username.value},{cancelToken:ourRequest.token})
              dispatch({type:"usernameUniqueResults",value:response.data})
            } catch (e) {
                console.log("prolem");
            }
        }
        fetchResults()
        return ()=>ourRequest.cancel()

    }

},[state.username.checkCount])

useEffect(()=>{
  if(state.email.checkCount){
      //send axis request
      const ourRequest=Axios.CancelToken.source()
      async function fetchResults() {
          try {
              const response=await Axios.post('/doesEmailExist',{email:state.email.value},{cancelToken:ourRequest.token})
            dispatch({type:"emailUniqueResults",value:response.data})
          } catch (e) {
              console.log("prolem");
          }
      }
      fetchResults()
      return ()=>ourRequest.cancel()

  }

},[state.email.checkCount])

useEffect(() => {
  if (state.submitCount) {
    const ourRequest = Axios.CancelToken.source()
    async function fetchResults() {
      try {
        const response = await Axios.post("/register", { username: state.username.value, email: state.email.value, password: state.password.value }, { cancelToken: ourRequest.token })
        // console.log(response.data)
        appDispatch({ type: "login", data: response.data })
        // appDispatch({ type: "flashMessage", value: "Congrats! Welcome to your new account." })
        appDispatch({type:"flashMessage",value:"You have Successfully logged in",isPos:"success"})
      } catch (e) {
        console.log("There was a problem or the request was cancelled.")
      }
    }
    fetchResults()
    return () => ourRequest.cancel()
  }
}, [state.submitCount])
  
function handleSubmit(e) {
  e.preventDefault()
  dispatch({ type: "usernameImmediately", value: state.username.value })
  dispatch({ type: "usernameAfterDelay", value: state.username.value, noRequest: true })
  dispatch({ type: "emailImmediately", value: state.email.value })
  dispatch({ type: "emailAfterDelay", value: state.email.value, noRequest: true })
  dispatch({ type: "passwordImmediately", value: state.password.value })
  dispatch({ type: "passwordAfterDelay", value: state.password.value })
  dispatch({ type: "submitForm"})
}

  return (
    <Page title="Welcome!" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Welcome!!</h1>
          <p className="lead text-muted"> Dive into a world of boundless expression, connect with like-minded individuals, and share your unique perspective with a vibrant community. Unleash your creativity, explore diverse content, and cultivate meaningful connections. </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input onChange={e => dispatch({type:"usernameImmediately",value:e.target.value}) } id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
              <CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger small liveValidateMessage">
                {state.username.message}
              </div>

              </CSSTransition>
            
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input onChange={e => dispatch({type:"emailImmediately",value:e.target.value}) } id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
              <CSSTransition in={state.email.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger small liveValidateMessage">
                {state.email.message}
              </div>

              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input onChange={e => dispatch({type:"passwordImmediately",value:e.target.value}) } id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
              <CSSTransition in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
              <div className="alert alert-danger small liveValidateMessage">
                {state.password.message}
              </div>

              </CSSTransition>
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Sign up for MemoBook
            </button>
          </form>
        </div>
      </div>
    </Page>
  )
}

export default HomeGuest
