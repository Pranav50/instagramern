import React, {useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    const history = useHistory()

    useEffect(() => {
        if(url) {
            uploadFields()
        }
    }, [url])

    const uploadPic = () => {
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

    const uploadFields = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return M.toast({html: "Invalid Email", classes:'#ef5350 red lighten-1'})
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                pass,
                email
            })
        }).then(res=> res.json()).then(data=> {
            if(data.error) {
                M.toast({html: data.error, classes:'#ef5350 red lighten-1'})
            } else {
                M.toast({html: data.message, classes:'#66bb6a green lighten-1'})
                history.push('/signin')
            }
            
        })
    }

    const postData = () => {
        if(image) {
            uploadPic()
        } else {
            uploadFields()
        }
         
    }

    return (
        <>
            <div className="mycard">
          <div className="card auth-card input-field">
            <h2>Instagram</h2>
            <p style={{textAlign:'center', color:'#747d8c', fontWeight:'bold'}}>Signup to see photos from your friends.</p>
            <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />
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
            {/* <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e)=> setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input type="text" className="file-path validate" type="text" />
                </div>
            </div> */}
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>postData()}
            >
                Signup
            </button>
            
            {/* Create Later */}
            {/* <h6>
                <Link to="/reset">Forgot password ?</Link>
            </h6> */}
    
        </div>
      </div>
          <div className="card auth-card">
          <h5>
            <span style={{fontSize:'16px'}}>Have an account ?</span><Link to="/signin">
                <span style={{color:'#1e90ff',fontSize:'16px',  fontWeight:'bold', marginLeft:'5px'}}>Log in</span></Link>
            </h5>
          </div>
        </>
    );
};

export default Signup;