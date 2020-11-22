import React, { useContext, useEffect, useState } from 'react';
import image from '../img/pranav.jpg'
import '../App.css'
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';
import Spinner from './Spinner';
import {Modal, Button, Table} from 'react-bootstrap'
import { Link } from 'react-router-dom';

const ShowPost = () => { 
    const [userProfile, setUserProfile] = useState(null)
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [smShow, setSmShow] = useState(false);
    const {postid} = useParams()

    useEffect(()=>{
        fetch(`/post/${postid}`,{ 
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log('POST', result)
        })
     },[])

    return (
        <>
        
        </>
    );
};

export default ShowPost;