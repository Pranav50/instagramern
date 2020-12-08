import React, { useEffect, useState, useContext} from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import {Modal, Button, Table} from 'react-bootstrap'
import '../App.css'
import { UserContext } from '../App';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Home = () => {
    const [data, setData] = useState([])
    const [userProfile, setUserProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const [smShow, setSmShow] = useState(false);
    const [smShow2, setSmShow2] = useState(false);
    const [showfollow,setShowFollow] = useState(true)
    const [newText, setNewText] = useState([])
    const [newText2, setNewText2] = useState([])

    const replaceByIndex = (originArray, index, newItem) => 
    {
        originArray.map((item, i) => i === index ? newItem: item)
    }
    
    // 

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
                  return { ...item, likes: result.likes }
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
                  return { ...item, likes: result.likes }
              }else{
                  return item
              }
          })
          setData(newData)
        }).catch(err=>{
          console.log(err)
      })
  }

    useEffect(() => {
        fetch('/allposts', {
            headers: {
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=> {
            setData(result.posts)
        })
    }, [])


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
                  return {...item,comments: result.comments}
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

  const followUser = (id)=>{

    fetch(`/user/${id}`,{
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt") 
        }
    }).then(res=>res.json())
    .then(result=>{
        setUserProfile(result)
    })
    fetch('/follow',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem('jwt')
        },
        body:JSON.stringify({
            followId:id
        })
    }).then(res=>res.json())
    .then(data=>{
    
        dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
        localStorage.setItem("user",JSON.stringify(data))

         setUserProfile((prevState)=>{
            //  return {
            //      ...prevState,
            //      user:{
            //          ...prevState.user,
            //          followers:[...prevState.user.followers,data._id]
            //         }
            //  }
         })
         setShowFollow(false)
    })
}

const unfollowUser = (id)=>{

    fetch(`/user/${id}`,{
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt") 
        }
    }).then(res=>res.json())
    .then(result=>{
        setUserProfile(result)
    })

    fetch('/unfollow',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem('jwt')
        },
        body:JSON.stringify({
            unfollowId:id
        })
    }).then(res=>res.json())
    .then(data=>{
        
        dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
        localStorage.setItem("user",JSON.stringify(data))
        
         setUserProfile((prevState)=>{
            // const newFollower = prevState.user.followers.filter(item=>item != data._id )
            //  return {
            //      ...prevState,
            //      user:{
            //          ...prevState.user,
            //          followers:newFollower
            //         }
            //  }
         })
         setShowFollow(true)
         
    })
}

const onChange = e => {
    const { value } = e.target;
    setNewText(value);
  };

//   const onSubmit = e => {
//     e.preventDefault();
//     setText("");
//   };

const onHandleSubmit = (newestText) => {
    console.log(newestText)
}

    return (
            <div className="home" >
            {
                data.map((item, index) => {
                    return (
                        <div className="card home-card" key={item._id}>
                                    <div className="profile-card">
                                        <img style={{width: '50px', height:'50px', borderRadius:'80px'}} 
                                        src={item.postedBy.image} />
                                        <span style={{display:'flex', flexWrap:'wrap', width:'85%'}}>
                                        <h5><Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile" } > {item.postedBy.name} </Link></h5>
                                        {
                                        state.following.includes(item.postedBy._id) ?  

                                            <button style={{margin:"3px",width:'65%'}} className="unfollow button-small btn-flat"
                                                    onClick={()=>unfollowUser(item.postedBy._id)}>
                                                    Unfollow
                                            </button>

                                            :
                                            item.postedBy._id == state._id ? '' : 

                                            <button style={{margin:"3px",width:'65%'}} className="follow button-small btn-flat"
                                                    onClick={()=>followUser(item.postedBy._id)}>
                                                    Follow
                                            </button>

                                        }
                        
                                            {
                                            <>
                                            <i className="material-icons" onClick={() => {
                                                item.postedBy._id == state._id ? setSmShow(true) : setSmShow2(true)}} style={{marginTop:'1.1rem', marginLeft:'auto'}}>more_horiz</i> 
                                            <Modal
                                            show={item.postedBy._id == state._id ? smShow : smShow2}
                                            size="sm"
                                            onHide={() => {
                                                item.postedBy._id == state._id ? setSmShow(false) : setSmShow2(false)
                                            }}
                                            centered
                                            ><Modal.Body>
                                                    <ul className="collection" style={{textAlign:'center'}}>                      
                                                        
                                                        {
                                                            item.postedBy._id == state._id ? <li className="collection-item"><button style={{color:'#ED4956'}}  onClick={()=>deletePost(item._id)}>Delete Post</button></li> :
                                                            null

                                                        }

                                                        <li style={{cursor:'pointer'}} className="collection-item" onClick={() => item.postedBy._id == state._id ? setSmShow(false) : setSmShow2(false)}>Cancel</li>
                                                    </ul>
                                                </Modal.Body>
                                            </Modal>
                                            </> 
                                            }

                                        </span>
                                    </div>
                                    <div className="card-image">
                                        <img style={{width: '100%', height:'260px'}} src={item.photo} alt=""/>
                                    </div>
                                    <hr/>

                                                    <div className="like-section">
                                                    {   item.likes.includes(state._id) ? 
                                                        <FavoriteIcon className="like-heart" style={{ fontSize: 25 }} onClick={()=>{unlikePost(item._id)}} /> :
                                                        <FavoriteBorderIcon className="unlike-heart" style={{ fontSize: 25 }} onClick={()=>{likePost(item._id)}} /> 
                                                    }

                                                    <h6>{item.likes.length}</h6>
                                                    </div>
                                                    <br/>



                                    <div className="card-content">
                                        <h6><b>{item.title}</b></h6>
                                        <p>{item.body}</p>
                                        {
                                            item.comments.map(record => {
                                                return (
                                                <>    
                                                <h6 key={record._id}><b className="posted-by">{record.postedBy.name}</b>{record.text}</h6>
                                                </>
                                                
                                                )
                                            })
                                        }

                                        {

                                    // <form onSubmit={(e) => {e.preventDefault(); 
                                    // makeComment(e.target[0].value, item._id)}}>
                                    //     <input type="text" onChange={onChange} />
                                    //     <input type="submit" value="Post" />
                                    // </form>

                                    <>
                                    <form onSubmit={(e) => {e.preventDefault();
                                    makeComment(e.target[0].value, item._id)}}>
                                                    <input type="text" value={newText[item._id] ? newText[item._id] : ""} 
                                                    onChange={onChange} placeholder="add a comment" />
                                                    <button type="submit" disabled={!newText[item._id]}>Post</button>
                                    </form>
                                    {/* {
                                        console.log(newText, newText[item._id])
                                    } */}
                                    </>

                                            // <form onSubmit={(e) => {e.preventDefault();
                                            //     makeComment(e.target[0].value, item._id)}}>
                                            // <input type="text"  placeholder="add a comment" /> 
                                            // </form>
                                        }

                                        {
                                            // <form onSubmit={(e) => {
                                            //     e.preventDefault();
                                            //     makeComment(e.target[0].value, item._id)
                                            //     setNewText("")
                                            // }}>
                                            //     { 
                                            //         <>
                                            //         <input type="text" value={state._id ? newText : newText2} 
                                            //         onChange={onChange} placeholder="add a comment" />
                                            //         <button type="submit" disabled={state._id ? !newText : !newText2}>Post</button>
                                            //         </>
                                            //     }
                                                    
                                                
                                            //     <input type="text" value={newText[index]} 
                                            //     onChange={(e) => setNewText(replaceByIndex(newText, index, e.target.value))} placeholder="add a comment" />
                                            //     <button type="submit" disabled={!newText}>Post</button>
                                            // </form>
                                        } 
                                        
                                        {/* <form onSubmit={(e) => {
                                            e.preventDefault()

                                                makeComment(e.target[0].value, item._id)
                                                   
                                        }}>
                                                <input
                                                    type="text"
                                                    value={text}
                                                    placeholder="add a comment"
                                                    
                                                />
                                                <button type="submit" disabled={!text}>Post</button>
                                        </form> */}
                                        
                                        {/* <form onSubmit={(e) => {
                                            e.preventDefault();
                                            makeComment(e.target[0].value, item._id)
                                        }}>
                                            <input type="text" value={newtext} onChange={onChange} placeholder="add a comment" />
                                            <button type="submit" disabled={!newtext}>Post</button>
                                        </form> */}
                                         
                                    </div>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default Home;