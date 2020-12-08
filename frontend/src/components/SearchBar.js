import React, {useState,useRef,useEffect, useContext} from 'react';
import search from '../img/search.png'
import remove from '../img/remove.png'
import {Table} from 'react-bootstrap'
import Spinner from './Spinner';
import './SearchBar.css'
import { Link } from "react-router-dom";
import { UserContext } from '../App';

const SearchBar = () => {
    const [searchUser, setSearchUser] = useState("")
    const [userDetails, setUserDetails] = useState([])
    const [open, setOpen] = useState(true);
    const {state, dispatch} = useContext(UserContext)
    const wrapperRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, false);
        return () => {
          document.removeEventListener("click", handleClickOutside, false);
        };
      }, []);

      const handleClickOutside = event => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            //alert('Clicked Outside')
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
      };

    const fetchUsers = (query) => {
        setSearchUser(query)
        fetch('/search-users', {
            method:'post',
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                query
            })
        }).then(res=>res.json())
        .then(results=> {
            setUserDetails(results.user)
        })
    }

    const onRemove = (e) => {
        setSearchUser("")
    }

    return (

        <>
            <div id="search-box">
                <img src={search}  />
                <input type="search" id="search-input" value={searchUser} placeholder="Search"
                onChange={(e) => fetchUsers(e.target.value)} />
                {
                        searchUser.length >= 1 ? <img className="clear-icon" src={remove} onClick={(e) => onRemove()}  style={{cursor:'pointer'}} /> : ''
                }
                
            </div>

            {
                searchUser === '' ? '' : (
                    
                            userDetails.length === 0 ? '' : (
                                isVisible && <div ref={wrapperRef}>
                                    <table className="square" style={{color:'black', zIndex:'999', marginTop:'16px',
                                position:'absolute', maxHeight:'362px', backgroundColor:'white'}}>
                                            <tbody>
                                            {
                                                userDetails.map(item => {
                                                    
                                                    return <tr>
                                                            <Link to={item._id !== state._id ? "/profile/"+item._id : '/profile'}
                                                            onClick = {() => {setOpen(false); setSearchUser('')}} target="_parent"
                                                            >
                                                            <td><img style={{width: '50px', height:'50px', borderRadius:'80px'}} src={item.image} /></td>
                                                            <td> {item.name} </td>
                                                            </Link>
                                                           </tr>
                                                           
                                                    
                                                })
                                            }
                                            </tbody>
                                    </table>
                                </div>
                                
                            )

                )

            }
                            
        </>
        
    );
};

export default SearchBar;