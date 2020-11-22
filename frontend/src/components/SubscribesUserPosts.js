import React, { useEffect, useState, useContext} from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import '../App.css'
import { UserContext } from '../App';
import { Link } from 'react-router-dom';
import Home from './Home';
import Spinner from './Spinner';

const SubscribesUserPost = () => {
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [loading, setLoading] = useState("")

    useEffect(() => {
        fetch('/getsubposts', {
            headers: {
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=> {
            //console.log(result)
            setData(result.posts)
        })
    }, [])

    const likePost = (id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
                 //   console.log(result)
          const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
          })
          setData(newData)
        }).catch(err=>{
            console.log(err)
        })
  }
  const unlikePost = (id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
          //   console.log(result)
          const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
          })
          setData(newData)
        }).catch(err=>{
          console.log(err)
      })
  }

  const likeComment = (id)=>{
    fetch('/likecomment',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId:id
        })
    }).then(res=>res.json())
    .then(result=>{
             //   console.log(result)
      const newData = data.map(item=>{
          if(item._id==result._id){
              return result
          }else{
              return item
          }
      })
      setData(newData)
    }).catch(err=>{
        console.log(err)
    })
}
const unlikeComment = (id)=>{
    fetch('/unlikecomment',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId:id
        })
    }).then(res=>res.json())
    .then(result=>{
      //   console.log(result)
      const newData = data.map(item=>{
          if(item._id==result._id){
              return result
          }else{
              return item
          }
      })
      setData(newData)
    }).catch(err=>{
      console.log(err)
  })
}

    const makeComment = (text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
           })
          setData(newData)
        }).catch(err=>{
            console.log(err)
        })
  }

  const deletePost = (postid) => {
      fetch(`/deletepost/${postid}`, {
          method:"delete",
          headers: {
              Authorization:"Bearer "+localStorage.getItem("jwt")
          }
      }).then(res=>res.json())
      .then(result => {
          console.log(result)
          const newData = data.filter(item => {
              return item._id !== result._id
          })
          setData(newData)
      })
  }

    return (
                loading && data.length === 0?<Spinner/>: [
                    data.length !== 0 ? <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                                    <div className="profile-card"  >
                                        <img style={{width: '50px', height:'50px', borderRadius:'80px'}} 
                                        src={item.postedBy.image} />
                                        <span style={{display:'flex', flexWrap:'wrap', width:'85%'}}>
                                        <h5 style={{width:'90%'}}><Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile" } > {item.postedBy.name} </Link></h5>
                                            {item.postedBy._id == state._id && <i className="material-icons" style={{ width:'20%'}}
                                            onClick={() => deletePost(item._id)} style={{marginTop:'1.1rem', color:'#d63031'}}>delete</i> }
                                        </span>
                                    </div>
                                    <div className="card-image">
                                        <img style={{width: '100%', height:'260px'}} src={item.photo} alt=""/>
                                    </div>
                                        <div className="like-section">
                                        <span>
                                        {   item.likes.includes(state._id) ? 
                                            <FavoriteIcon className="like-heart" style={{ fontSize: 25 }} onClick={()=>{unlikePost(item._id)}} /> :
                                            <FavoriteBorderIcon className="unlike-heart" style={{ fontSize: 25 }} onClick={()=>{likePost(item._id)}} /> 
                                        }
                                        </span>
                                        <h6>{item.likes.length}</h6>
                                        </div>
                                    <div className="card-content">
                                        <h6><b>{item.title}</b></h6>
                                        <p>{item.body}</p>
                                        {
                                            item.comments.map(record => {
                                                return (
                                                    
                                                <h6 key={record._id}><b className="posted-by">{record.postedBy.name}</b>{record.text}</h6>
                                                
                                                )
                                            })
                                        }
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            makeComment(e.target[0].value, item._id)
                                        }}>
                                            <input type="text" placeholder="add a comment" />
                                        </form>
                                         
                                    </div>
                        </div>
                    )
                })
            }
        </div> : <h2 style={{fontFamily:'Nanum Gothic', textAlign:'center'}}> You are not following any posts </h2>
                ]
    );
};

export default SubscribesUserPost;