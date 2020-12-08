import React from 'react';
import insta2 from '../img/insta4.gif'
import '../App.css'

const Spinner = () => {
    return (
        <div style={{textAlign:'center', top:'50%', bottom:'0', right:'0', left:'0', position:'absolute', margin:'auto'}}>
            <img height="30px" width="30px" src={insta2} />
        </div>
    );
};

export default Spinner;