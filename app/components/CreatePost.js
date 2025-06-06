import React, { useEffect, useState, useContext,useRef } from "react"
import { useNavigate } from "react-router-dom"
import Page from "./Page"
import Axios from "axios"

import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function CreatePost(props) {
  const [title, setTitle] = useState()
  const [body, setBody] = useState()
  const navigate = useNavigate()
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const image=e.target.files[0]
    if(!image) return
    setImage(image)

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(image);

  };



  async function handleSubmit(e) {
    e.preventDefault()
    if (!image) return

    const formData = new FormData();
    formData.append("title", title)
    formData.append("body", body)
    formData.append("image", image)
    formData.append("token", appState.user.token)



    try {
      const response = await Axios.post("/create-post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      })
      appDispatch({ type: "flashMessage", value: "Congrats you Successfully created a post", isPos: "info" })

      navigate(`/post/${response.data}`)
      console.log(`New post was created. ${response.data}`)

    } catch (e) {
      console.log(response.data)
    }
  }
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Page title="Create New Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={e => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={e => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <button className="btn btn-primary">Save New Post</button>
        {previewUrl ? (
        <div style={{ margin: '20px 0' }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '300px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <div style={{ marginTop: '10px' }}>
            <p>File: {image.name}</p>
            <p>Size: {(image.size / 1024).toFixed(2)} KB</p>
          </div>
        </div>
      ) : ""}
      </form>
    </Page>
  )
}

export default CreatePost
