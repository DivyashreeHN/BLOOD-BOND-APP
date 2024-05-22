import {useState} from 'react'
import UserContainer from './components/userComponent/userContainer';
import UserRegistrationForm from './components/userComponent/userRegistrationForm';
import UserLoginForm from './components/userComponent/userLoginForm';
import BloodInventoryForm from './components/bloodInventoryComponent/bloodInventoryForm';
import BloodInventoryTable from './components/bloodInventoryComponent/bloodInventoryTable';
import BloodBankDashboard from './components/bloodbankComponent/bloodbankDashboard';
import AdminDashboard from './components/adminComponent/adminDashboard';
import ProfileDashboard from './components/userProfileComponent/profileDashboard';
import './App.css';
import {Routes,Route,Link} from 'react-router-dom'
import { useReducer } from 'react';
import userReducer from './reducers/userReducer';
import UserContext from './contexts/userContext';

import BloodInventoryContext from './contexts/bloodInventoryContext';
import bloodInventoryReducer from './reducers/bloodInventoryReducer';
function App() {
  const userinitialstate={
    userDetails:[],
    registerData:[],
    loginData:[],
    serverErrors:[],
  }
  const bloodinventoryinitialstate={
    bloodInventoryDetails:[],
    serverErrors:[]
  }
const [users,userDispatch]=useReducer(userReducer,userinitialstate)
const [bloodInventory,bloodInventoryDispatch]=useReducer(bloodInventoryReducer,bloodinventoryinitialstate)
  const [showRegistrationForm,setShowRegistrationForm]=useState(false)
  const handleShowRegistration=()=>{
    setShowRegistrationForm(!showRegistrationForm)
  }
  return (
    <UserContext.Provider value={{users,userDispatch}}>
    <BloodInventoryContext.Provider value={{bloodInventory,bloodInventoryDispatch}}>
    <div className="App">
      <h1>BloodBond App</h1>
      {showRegistrationForm?(<Routes>
        <Route path='/register' element={<UserContainer/>}/>
        <Route path='/login' element={<UserLoginForm col-md-6/>}/>
        <Route path='/bloodbank/dashboard' element={<BloodBankDashboard/>}/>
        <Route path="/bloodbank/:id/blood-inventory-form" element={<BloodInventoryForm/>} />
        <Route path="/bloodbank/:id/show-inventory" element={<BloodInventoryTable/>} />
        <Route path='/user/dashboard' element={<ProfileDashboard/>}/>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
      </Routes>):
      (<Link to='/register' onClick={handleShowRegistration}>Register Now</Link>)}
    </div>
    </BloodInventoryContext.Provider>
    </UserContext.Provider>
    
  );
}

export default App;
