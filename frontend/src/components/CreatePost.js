import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom'
import '../App.css'
import M from 'materialize-css'

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    useEffect(() => {
        if(url) {
            // Fetch request for create post
    fetch("/createpost", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " +localStorage.getItem("jwt")
        },
        body: JSON.stringify({ 
            title,
            body,
            pic:url
        })
    }).then(res=> res.json()).then(data=> {
        if(data.error) {
            M.toast({html: data.error, classes:'#ef5350 red lighten-1'})
        } else {
            M.toast({html: "Created Post", classes:'#66bb6a green lighten-1'})
            history.push('/')
        }
        
    }).catch(err => {
        console.log(err)
    })
    }
    }, [url])

    const submitPost = () => {
        const data = new FormData();
        data.append("file", image)
        data.append("upload_preset", "instagram-clone")
        data.append("cloud_name", "pranav")
        fetch("https://api.cloudinary.com/v1_1/pranav/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json())
        .then(data=> {
            setUrl(data.url)
        })
        .catch(err => {
            M.toast({html: err, classes:'#ef5350 red lighten-1'})
        })

        
    }

    return (

            <div className="mycard">
          <div className="card auth-card input-field">
            <input
            type="text"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
            <input
            type="text"
            placeholder="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            />
            <div className="file-field">
                    <div className="btn">
                        <span>Upload Image</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input type="text" className="file-path validate"/>
                    </div>
                </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>submitPost()}
            >
                Submit Post
            </button>
        </div>
      </div>

    );
};

export default CreatePost;