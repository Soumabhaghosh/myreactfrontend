import React, { useEffect, useContext } from "react"
import Page from "./Page"
import StateContext from "../StateContext"
import { useImmer } from "use-immer"
import LoadingDotsIcon from "./LoadingDotsIcon"
import { Link } from "react-router-dom"
import Axios from "axios"
function Home() {
  
const appState=useContext(StateContext)
const [state,setState] = useImmer({
  isLoading:true,
  feed:[],

})
useEffect(()=>{

  async function fetchData(){
    try {
      
      const response =await Axios.post('/getHomeFeed', {token: appState.user.token})
      setState(draft=>{
        draft.isLoading=false
        draft.feed=response.data

      })

    } catch (e) {
        
        console.log("problem");
    }
  }
  fetchData()
  

}, [])
if(state.isLoading){
  return <LoadingDotsIcon/>
}

  return (
    <Page title="Your Feed">
     {state.feed.length>0 && (
       <>
       <h2 className="text-center mb-4">
         The Latest posts from the users that you follows
       </h2>
       <div>
       {state.feed.map(post => {
                      const date =new Date(post.createdDate) 
  
                      const d=`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
  
                      return (
                          <Link onClick={()=>appDispatch({type:"closeSearch"})}  key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
                          <img className="avatar-tiny" src={post.author.avatar}  /> <strong>{post.title}</strong>{"   "}
                          <span className="text-muted small">by {post.author.username} on {d} </span>
                        </Link>
                      )
                })}

       </div>
       </>
     )}
     {state.feed.length==0 && (
        <h2 className="text-center">
        Hello <strong>{appState.user.username}</strong>, your feed is empty.
        <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
      </h2>
      
     )}
      
    </Page>
  )
}

export default Home
