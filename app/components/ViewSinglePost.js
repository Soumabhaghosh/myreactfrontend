import React, { useContext, useEffect, useState } from "react"
import Page from "./Page"
import { useParams, Link, useNavigate } from 'react-router-dom'
import Axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ViewSinglePost() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const n = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()



  useEffect(() => {

    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {

      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
        console.log(response.data);
        setPost(response.data)
        
        setIsLoading(false)
      } catch (e) {
        console.log(e);
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }

  }, [id])

  if (!isLoading && !post) {
    return <NotFound />
  }

  if (isLoading) return (


    <Page title="..."> <LoadingDotsIcon /> </Page>

  )
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


  function isOwner() {

    if (appState.loggedIn) {
      return appState.user.username == post.author.username
    }
    return false
  }

  async function deleteHandler() {
    const sure = window.confirm("are you sure")
    if (sure) {

      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
        if (response.data == "Success") {
          //1.display a flash message
          appDispatch({ type: "flashMessage", value: "post deleted", isPos: "success" })
          n(`/profile/${appState.user.username}`)
        }
      } catch (e) {
        console.log("oops");
      }

    }
  }

  return (
    <Page title={post.title} >
      <div className="d-flex justify-content-between">
        <h2> <ReactMarkdown children={post.title} /> </h2>
        {isOwner() && (

          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2" >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />
            {"    "}
            <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}


      </div>

      <p className="text-muted small mb-4">
        <a href="#">
          <img className="avatar-tiny" src={post.author.avatar} />
        </a>
        Posted by <Link to={`/profile/${post.author.username}`} >{post.author.username} </Link> {getTimeAgo(post.createdDate)}
      </p>

      <div className="body-content">

        <ReactMarkdown children={post.body} allowedElements={["p", "br", "strong", "em", "h1", "h2", "h3", "h4", "h4", "h5", "h6", "ul", "ol", "li"]} />
        <img src={post.img} alt="Preview" style={{
          width: '100%',
          height: 'auto',
          maxWidth: '800px' // won't grow beyond this
        }} />
      </div>
    </Page>
  )
}

export default ViewSinglePost
