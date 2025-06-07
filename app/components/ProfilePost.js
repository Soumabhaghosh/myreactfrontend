import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import LoadingDotsIcon from './LoadingDotsIcon'
import ReactMarkdown from 'react-markdown'
function ProfilePosts() {
    const { username } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])
    useEffect(() => {
        async function fetchPosts() {

            try {
                const response = await Axios.get(`/profile/${username}/posts`)
                console.log(response.data);
                setPosts(response.data)
                setIsLoading(false)
            } catch (e) {
                console.log(e);
            }
        }
        fetchPosts()


    }, [username])

    function getTimeAgo(dateString) {
        const postDate = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - postDate) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) return `${diffInMonths}mo ago`;
        const diffInYears = Math.floor(diffInDays / 365);
        return `${diffInYears}y ago`;
    }


    if (isLoading) return <LoadingDotsIcon />

    



    return (

        <div className="list-group">
            {


                posts.map(post => {

                    

                    const d = getTimeAgo(post.createdDate)

                    return (
                        <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
                            <img className="avatar-tiny" src={post.author.avatar} /> <strong><ReactMarkdown children={post.title} /> </strong>{"   "}
                            <span className="text-muted small">{d} </span>
                        </Link>
                    )
                })
            }

        </div>


    )

}
export default ProfilePosts