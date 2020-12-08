import React, { useContext, useEffect, useRef, useState } from 'react';
import M from 'materialize-css'
import '../App.css'
import { UserContext } from '../App';
import Spinner from './Spinner';
import {Link} from 'react-router-dom'
import instaAdd from '../img/insta-add.jpg'
import noPosts from '../img/no-posts.png'

const Profile = () => {
    const [myPics, setMyPics] = useState([])
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState("")

    const inputFile = useRef(null)

    const {state, dispatch} = useContext(UserContext)
    
    useEffect(() => {
        fetch("/myposts", {
            method: "post",
            headers: {
                "Authorization": "Bearer " +localStorage.getItem("jwt")
            }
        }).then(res=> res.json()).then(data=> {
            setMyPics(data)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        if(image) {
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
            console.log(data)
            localStorage.setItem("user", JSON.stringify({...state, image:data.url}))
            dispatch({type:"UPDATE_PIC", payload:data.url})
            fetch("/updatepic", {
                method:"put",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    image:data.url
                })
            }).then(res=>res.json())
            .then(result => {
                console.log(result)
                localStorage.setItem("user", JSON.stringify({...state, image:result.image}))
                dispatch({type:"UPDATE_PIC", payload:result.image})
                // window.location.reload()
            })
            }).catch(err => {
            M.toast({html: err, classes:'#ef5350 red lighten-1'})
            })
            }
        }, [image])

    const updatePhoto = () => {
        inputFile.current.click()
    }

    const newPhoto = (files) => {
        setImage(files)
    }

    return (
        loading?<Spinner/>:
        <div className="profile-body">
            <div className="profile-size">
                <div className="profile-section">
                    {
                        loading?<Spinner/>: <img style={{width: '160px', height:'160px', 
                        borderRadius:'80px'}} src={state?state.image:""} />
                    }
                    <p onClick={() => updatePhoto()}>Change Profile Photo</p>
                    <input ref={inputFile} style={{display:'none'}} type="file" onChange={(e) => newPhoto(e.target.files[0])} />
                </div>
                <div>
                    <h4> {state?state.name:'loading'} </h4>
                    <h4> {state?state.email:'loading'} </h4>
                    <h3> {state.name === 'Pranav' && state.email === 'pranav@gmail.com' ? 'Developer of this Clone' : ''} </h3>

                    <div className="post-size">
                        <div className="profile-details-size"><h5> {myPics.length} </h5><span>posts</span></div>
                        <div className="profile-details-size"><h5> {state?state.followers.length:"0"} </h5><span>followers</span></div>
                        <div className="profile-details-size"><h5> {state?state.following.length:"0"} </h5><span>following</span></div>
                    </div>
                </div>
            </div>
            {
                myPics.length === 0 && loading ? <Spinner/> : <div className="gallery">
                {
                    myPics.map(item => {
                        return <img key={item._id} className="item" src={item.photo} alt={item.title} />
                    })
                }
            </div>
            }
        </div>
    );
};

export default Profile;