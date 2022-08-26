import React, { useEffect,useState } from 'react'
import Axios from 'axios'
import {useParams,Link} from 'react-router-dom'
import LoadingDotsIcon from './LoadingDotsIcon'
import ReactMarkdown from 'react-markdown'
function ProfileFollowing(){
    const {username} = useParams()
    const [ isLoading , setIsLoading ]=useState(true)
    const [posts,setPosts] = useState([])
    useEffect(()=>
    {
            async function fetchPosts(){

                try {
                    const response= await Axios.get(`/profile/${username}/following`)
                    console.log(response.data);
                    setPosts(response.data)
                    setIsLoading(false)
                } catch (e) {
                    console.log(e);
                }
            }
            fetchPosts()


    },[username])


    if(isLoading)return <LoadingDotsIcon/>

    

    return(

    <div className="list-group">
                {
                                              

                    posts.map((follower,index) =>{

                       

                        return (
                            <Link  key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
                            <img className="avatar-tiny" src={follower.avatar}  /> 
                            {follower.username} 
                          </Link>
                        )
                    })
                }

      </div>


    )

}
export default ProfileFollowing