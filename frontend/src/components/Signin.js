import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom'

import M from 'materialize-css'
import { UserContext } from '../App';

const Signin = () => {
    const {state, dispatch} = useContext(UserContext)
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")

    const history = useHistory()

    const postData = () => {
         if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return M.toast({html: "Invalid Email", classes:'#ef5350 red lighten-1'})
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                pass
            })
        }).then(res=> res.json()).then(data=> {
            if(data.error) {
                M.toast({html: data.error, classes:'#ef5350 red lighten-1'})
            } else {
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({type:"USER", payload: data.user})
                M.toast({html: "Signed In Success", classes:'#66bb6a green lighten-1'})
                history.push('/')
            }
            
        })
    }

    return (
        <>
        <div className="mycard">
          <div className="card auth-card input-field">
            <h2>Instagram</h2>
            <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder="password"
            value={pass}
            onChange={(e)=>setPass(e.target.value)}
            />
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>postData()}
            >
                Log in
            </button>
    
        </div>
      </div>
          <div className="card auth-card">
          <h5>
            <span style={{fontSize:'16px'}}>Don't have account ?</span><Link to="/signup">
                <span style={{color:'#1e90ff',fontSize:'16px', fontWeight:'bold', marginLeft:'5px'}}>Sign up</span></Link>
            </h5>
          </div>
      </>
    );
};

export default Signin;