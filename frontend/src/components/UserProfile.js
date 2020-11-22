import React, { useContext, useEffect, useState } from 'react';
import image from '../img/pranav.jpg'
import '../App.css'
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';
import Spinner from './Spinner';
import {Modal, Button, Table} from 'react-bootstrap'
import { Link } from 'react-router-dom';

const UserProfile = () => {
    const [userProfile, setProfile] = useState(null)
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)

    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
          
             setProfile(result)
        })
     },[])

     const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
        
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setShowFollow(false)
        })
    }

    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
            
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true)
             
        })
    }

    return (
        <>
        {userProfile ? 
        <div className="profile-body">
        <div className="profile-size">
            <div>
                <img style={{width: '160px', height:'160px', 
                borderRadius:'80px'}} src={userProfile.user.image} />
            </div>
            <div>
                <h4> {userProfile.user.name} </h4>
                <h4> {userProfile.user.email} </h4>

                <div className="post-size">
                    <div className="profile-details-size"><h5> {userProfile.posts.length} </h5><span>posts</span></div>
                    <div className="profile-details-size"><h5> {userProfile.user.followers.length}</h5><span>followers</span></div>
                    <div className="profile-details-size"><h5> {userProfile.user.following.length} </h5><span>following</span></div>
                </div>
                {state.following.includes(userid) ?
                   <button style={{
                       margin:"10px",
                       width:'100%'
                   }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>unfollowUser()}
                    >
                        Unfollow
                    </button>
                    : 
                    <button
                    style={{
                        margin:"10px",
                        width:'100%'
                    }}
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>followUser()}
                    >
                        Follow
                    </button>
                    }
            </div>
        </div>
        <div className="gallery">
            {
                userProfile.posts.map(item => {
                    return <img key={item._id} className="item" src={item.photo} alt={item.title} />
                })
            }
        </div>
    </div> : <Spinner/> }
        </>
    );
};

export default UserProfile;