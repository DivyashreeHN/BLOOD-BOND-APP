import { useState, useReducer } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import UserContainer from './components/userComponent/userContainer';
import UserLoginForm from './components/userComponent/userLoginForm';
import BloodBankDashboard from './components/bloodbankComponent/bloodbankDashboard';
import ProfileDashboard from './components/userProfileComponent/profileDashboard';
import AdminDashboard from './components/adminComponent/adminDashboard';
import BloodInventoryForm from './components/bloodInventoryComponent/bloodInventoryForm';
import BloodInventoryTable from './components/bloodInventoryComponent/bloodInventoryTable';
import ProfileForm from './components/userProfileComponent/profileForm';
///
import ViewProfile from './components/userProfileComponent/viewProfile'
import ViewHisRequest from './components/userProfileComponent/viewHisBloodRequest';
//
import BloodRequestForm from './components/userProfileComponent/blood-requestForm';
import bloodRequestReducer from './reducers/bloodRequestReducer';
import BloodRequestContext from './contexts/bloodRequestContext';

import './App.css';
//
import bloodResponseReducer from './reducers/responseReducer';
import BloodResponseContext from './contexts/bloodResponseContext';
//
import userReducer from './reducers/userReducer';
import bloodInventoryReducer from './reducers/bloodInventoryReducer';

import UserContext from './contexts/userContext';
import BloodInventoryContext from './contexts/bloodInventoryContext';

function App() {
  const userInitialState = {
    userDetails: [],
    registerData: [],
    loginData: [],
    serverErrors: [],
  };

  const bloodInventoryInitialState = {
    bloodInventoryDetails: [],
    serverErrors: [],
  };

  //
  const bloodRequestInitialState={
    bloodRequests:[],//all bloodRequest
    userBloodRequests:[], //his(MY) request
    bloodRequestToAdmin:[], 
    requestToUser:[], //request to user
    otherRequestToUser:[],
    serverErrors:[]
  }

  //
  const bloodResponseInitialState={
    responseByAdmin:[],
    responseByUser:[],
    serverErrors:[]
  }
  const [users, userDispatch] = useReducer(userReducer, userInitialState);
  //
  const [bloodInventory, bloodInventoryDispatch] = useReducer(bloodInventoryReducer, bloodInventoryInitialState);
  //
  const[bloodRequests,bloodRequestDispatch]=useReducer(bloodRequestReducer,bloodRequestInitialState)
  //
  const[bloodResponses,bloodResponseDispatch]=useReducer(bloodResponseReducer,bloodResponseInitialState)
  //
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const handleShowRegistration = () => {
    setShowRegistrationForm(!showRegistrationForm);
  };

  return (
    <UserContext.Provider value={{ users, userDispatch }}>
      <BloodInventoryContext.Provider value={{ bloodInventory, bloodInventoryDispatch }}>
        <BloodRequestContext.Provider value={{bloodRequests,bloodRequestDispatch}}>
          <BloodResponseContext.Provider value={{bloodResponses,bloodResponseDispatch}}>
        <div className="App">
          <h1>BloodBond App</h1>
          {showRegistrationForm ? (
            <Routes>
              <Route path='/register' element={<UserContainer />} />
              <Route path='/login' element={<UserLoginForm />} />
              <Route path='/bloodbank/dashboard' element={<BloodBankDashboard />} />
              <Route path="/bloodbank/:id/blood-inventory-form" element={<BloodInventoryForm />} />
              ///
              <Route path="/profile/:id/profileForm" element={<ProfileForm/>}/>
              <Route path="/profile/:id" element={<ViewProfile />} />
              <Route path="/user/requests" element={<ViewHisRequest/>}/>
              <Route path="/edit-request/:id" element={<BloodRequestForm/>}/>
              {/* <Route path="/user/:id/blood-request-form" element={<BloodRequestForm/>}/> */}
              <Route path="/bloodbank/:id/show-inventory" element={<BloodInventoryTable />} />
              <Route path='/user/dashboard' element={<ProfileDashboard />} />
              <Route path='/admin/dashboard' element={<AdminDashboard />} />
            </Routes>
          ) : (
            <Link to='/register' onClick={handleShowRegistration}>Register Now</Link>
          )}
        </div>
        </BloodResponseContext.Provider>
        </BloodRequestContext.Provider>
      </BloodInventoryContext.Provider>
   
    </UserContext.Provider>
  );
}

export default App;
