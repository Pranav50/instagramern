import React, {useContext, useState} from 'react';
import {Link, useHistory} from 'react-router-dom'
import { UserContext } from '../App';
import {Menu,MenuItem,MenuButton,MenuDivider} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import './Navbar.css'
import '../App.css'
import profile from '../img/profile.png'
import createPost from '../img/create-post.png'
import followingPost from '../img/following-post.png'
import SearchBar from './SearchBar';

const Navbar = () => {
    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)

        const renderMenu = () => {
            if(state) {
                return <Menu menuButton={<img style={{width: '40px', height:'40px', marginTop:'10px', borderRadius:'80px'}} 
                src={state?state.image:""} />}>
                
                <MenuItem href="/profile">
                    <img height="16px" width="16px" style={{marginRight:'15px'}} src={profile}  />
                    Profile
                </MenuItem>
                <MenuItem href="/createpost">
                    <img height="16px" width="16px" style={{marginRight:'15px'}} src={createPost}  />
                    Create Posts
                </MenuItem>
                <MenuItem href="/myfollowingpost">
                    <img height="16px" width="16px" style={{marginRight:'15px'}} src={followingPost} /> 
                    Following Posts
                </MenuItem>
                <MenuDivider />
                <MenuItem 
                onClick={()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    history.push('/signin')
                  }}
                >
                    Logout
                </MenuItem>
                </Menu>
            } else {
                return
            }
        }

        const renderNav = () => {
            if(state) {
                return <nav className="nav-container">
                    <div className="nav-wrapper white">
                        <Link to={state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
                        <ul id="nav-mobile" className="right">
                            <li><SearchBar/></li>
                        </ul>
                    </div>
                    </nav> 
            } else {
                return
            }
        }

    return (
        <>
        <div className="big-container">
        <div className="menu-container">
            {/* {menus} */}
            {renderMenu()}
        
        </div>
                {renderNav()}
        </div>
        </>
    );
};

export default Navbar;