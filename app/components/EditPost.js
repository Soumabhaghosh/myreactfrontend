import React, { useContext, useEffect,useState } from "react"
import Page from "./Page"
import { useImmerReducer } from "use-immer"
import {useParams,Link,useNavigate} from'react-router-dom'
import Axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import NotFound from "./NotFound"

function EditPost() {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)



   const  originalState={
        title:{
            value:"",
            hasErrors:false,
            message:""
        },
        body:{
            value:"",
            hasErrors:false,
            message:"",

        },
        isFetching:true,
        isSaving:false,
        id: useParams().id,
        sendCount:0,
        notFound:false
    }

    function ourReducer(draft,action){

        switch(action.type){
            case "fetchComplete":
                draft.title.value=action.value.title
                draft.body.value=action.value.body
                draft.isFetching =false
                return
            case "titleChange":
                draft.title.value=action.value
                draft.title.hasErrors=false
                return
            case "bodyChange":
                draft.body.value=action.value 
                draft.body.hasErrors=false
                return   
            case "submitRequest":
                if(!draft.title.hasErrors && !draft.body.hasErrors){
                    draft.sendCount++
                }

                return
            case "saveRequestStarted":
                draft.isSaving =true
                return
            case "saveRequestFinished":
                draft.isSaving=false
                return 
            case "titleRules":
                if(!action.value.trim()){
                    draft.title.hasErrors=true
                    draft.title.message="Title can not be empty"
                }  
                
                return
            case "bodyRules":
                if(!action.value.trim()){
                    draft.body.hasErrors=true
                    draft.body.message="Body can not be empty"
                }  
                
                return
            case "notFound":
                draft.notFound=true    


        }
    }



    const [state,dispatch]=useImmerReducer(ourReducer,originalState)
  
    function submitHandler(e){
        
        e.preventDefault()
        dispatch({type:"titleRules",value: state.title.value })
        dispatch({type:"bodyRules",value: state.body.value })
        dispatch({type: "submitRequest"})
    }

    const nevigate=useNavigate()


  useEffect(()=>
  {

    const ourRequest=Axios.CancelToken.source()
          async function fetchPost(){

              try {
                  const response= await Axios.get(`/post/${state.id}`,{cancelToken: ourRequest.token})
                  console.log(response.data);
                  if(response.data){

                    dispatch({type:"fetchComplete",value:response.data})
                    if(appState.user.username!=response.data.author.username){

                        appDispatch({type:"flashMessage",value:"you do not have permisson to edit this"})
                        nevigate("/")
                    }

                  }
                  else{
                     dispatch({type:"notFound"}) 
                  }
                    
              } catch (e) {
                  console.log(e);
              }
          }
          fetchPost()
          return ()=>{
              ourRequest.cancel()
          }

  },[])



  useEffect(()=>
  {

    const ourRequest=Axios.CancelToken.source()
          if(state.sendCount){

            dispatch({type:"saveRequestStarted"})
            async function fetchPost(){

                try {
                    const response= await Axios.post(`/post/${state.id}/edit`,{title:state.title.value ,body:state.body.value,token:appState.user.token },{cancelToken: ourRequest.token})
                    dispatch({type:"saveRequestFinished"})
                    appDispatch({type:"flashMessage",value:"post updated",isPos:"success"})
                    
                } catch (e) {
                    console.log(e);
                }
            }
            fetchPost()
            return ()=>{
                ourRequest.cancel()
            }
          }

  },[state.sendCount])

  if(state.notFound){
    return (
      
        <NotFound/>

    ) 
  }


  if(state.isFetching) return (
  
  
  <Page title="..."> <LoadingDotsIcon/> </Page>
  
  )
  
  return (
    <Page title="Edit Post">
        <Link className="small font-weight-bold" to={`/post/${state.id} `} >&laquo; Back to Post</Link>

      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={e => dispatch({type:"titleRules",value: e.target.value })} onChange={ e =>dispatch({type:"titleChange",value:e.target.value }) } value={state.title.value}   autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
            { state.title.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div> }
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={e => dispatch({type:"bodyRules",value:e.target.value})} onChange={ e=> dispatch({type:"bodyChange",value:e.target.value})} value={state.body.value}  name="body" id="post-body" className="body-content tall-textarea form-control" type="text"/>
          { state.body.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div> }
        </div>
        <div>
            { state.isSaving==true ? <button className="btn btn-primary" disabled={true} >Saving...</button>:<button className="btn btn-primary" >Save Updates</button> }
        </div>
        
      </form>
    </Page>
  )
}

export default EditPost
