import React, { useEffect,useState,useContext } from 'react'
import Axios from 'axios'
import {useParams,Link} from 'react-router-dom'
import LoadingDotsIcon from './LoadingDotsIcon'
import ReactMarkdown from 'react-markdown'
import StateContext  from "../StateContext"
function ProfilePosts(){
    const {username} = useParams()
    const [ isLoading , setIsLoading ]=useState(true)
    const [posts,setPosts] = useState([])
    const appState = useContext(StateContext)
    useEffect(()=>
    {
            async function fetchPosts(){

                try {
                    // console.log(username);
                    const response= await Axios.get(`/profile/${username}/followers`)
                    console.log(response.data);
                    console.log(appState.user.username);
                    setPosts(response.data)
                    setIsLoading(false)
                } catch (e) {
                    console.log(e);
                }
            }
            fetchPosts()


    },[username])


    if(isLoading)return <LoadingDotsIcon/>

    if(posts.length==0 && username==appState.user.username){
        return (<h2>you have no follower</h2>)
    }
    if(posts.length==0 && username!=appState.user.username){
        return (<h2>This user have no follower</h2>)
    }


    return(

    <div className="list-group">
                {
                                              

                    posts.map( (follower,index)=>{

                        

                        return (
                            <Link  key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
                            <img className="avatar-tiny" src={follower.avatar}  /> 
                            <span className="text-muted small">{follower.username} </span>
                          </Link>
                        )
                    })
                }

      </div>


    )

}
export default ProfilePosts