import {useEffect, createContext, useReducer, useContext} from 'react'
import './App.css';
import Navbar from './components/Navbar'
import Home from './components/Home'
import Signup from './components/Signup'
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'
import Profile from './components/Profile';
import Signin from './components/Signin';
import CreatePost from './components/CreatePost';
import {reducer, initialState} from '../src/reducers/useReducer'
import UserProfile from './components/UserProfile';
import SubscribesUserPost from './components/SubscribesUserPosts';
import ShowPost from './components/ShowPost';

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user) {
      dispatch({type:"USER", payload:user})
    } else {
      if(!history.location.pathname.startsWith('/reset'))
      history.push('/signin')
    }
  }, [])
  return (
    <Switch> 
      <Route exact path="/" >
      <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/createpost">
        <CreatePost/>
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/post/:postid">
        <ShowPost />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribesUserPost/>
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>      
        <Navbar/>
        <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
