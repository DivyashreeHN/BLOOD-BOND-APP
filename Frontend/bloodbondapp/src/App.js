import {useState} from 'react'
import UserContainer from './components/userComponent/userContainer'
import UserLoginForm from './components/userComponent/userLoginForm'
import BloodBankDashboard from './components/bloodbankComponent/bloodbankDashboard'
import ProfileDashboard from './components/userProfileComponent/profileDashboard'
import AdminDashboard from './components/adminComponent/adminDashboard'
import './App.css'
import {Routes,Route,Link} from 'react-router-dom'
import { useReducer } from 'react'
import userReducer from './reducers/userReducer'
import UserContext from './contexts/userContext'
function App() {
  const userinitialstate={
    userDetails:[],
    registerData:[],
    loginData:[],
    serverErrors:[],
  }
const [users,userDispatch]=useReducer(userReducer,userinitialstate)
  const [showRegistrationForm,setShowRegistrationForm]=useState(false)
  const handleShowRegistration=()=>{
    setShowRegistrationForm(true)
  }
  return (
    <UserContext.Provider value={{users,userDispatch}}>
      <div className="App">
      <h1>BloodBond App</h1>
      {showRegistrationForm?(<Routes>
        <Route path='/register' element={<UserContainer/>}/>
        <Route path='/login' element={<UserLoginForm col-md-6/>}/>
        <Route path='/bloodbank/dashboard' element={<BloodBankDashboard/>}/>
        <Route path='/user/dashboard' element={<ProfileDashboard/>}/>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
      </Routes>):
      (<Link to='/register' onClick={handleShowRegistration}>Register Now</Link>)}
    </div>
    </UserContext.Provider> 
  )
}
export default App


