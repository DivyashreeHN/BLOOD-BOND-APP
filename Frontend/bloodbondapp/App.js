import { useState, useReducer } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './Header/header';
import UserContainer from './components/userComponent/userContainer';
import UserLoginForm from './components/userComponent/userLoginForm';
import BloodBankDashboard from './components/bloodbankComponent/bloodbankDashboard';
import ProfileDashboard from '../../../Portfolio Project/BloodBond/Frontend/bloodbondapp/src/components/userProfileComponent/profileDashboard';
import AdminDashboard from '../../../Portfolio Project/BloodBond/Frontend/bloodbondapp/src/components/adminComponent/adminDashboard';
import BloodInventoryForm from '../../../Portfolio Project/BloodBond/Frontend/bloodbondapp/src/components/bloodInventoryComponent/bloodInventoryForm';
import BloodInventoryTable from '../../../Portfolio Project/BloodBond/Frontend/bloodbondapp/src/components/bloodInventoryComponent/bloodInventoryTable';
import BloodRequestsTable from './components/bloodbankComponent/bloodRequestsTable';
import InvoiceForm from './components/bloodbankComponent/invoiceForm';
import './App.css';
import userReducer from '../../../Portfolio Project/BloodBond/Frontend/bloodbondapp/src/reducers/userReducer';
import UserContext from '../../../Portfolio Project/BloodBond/Frontend/bloodbondapp/src/contexts/userContext';

import ResponseContext from './contexts/responseContext';
import responseReducer from '../../../Portfolio Project/BloodBond/Frontend/bloodbondapp/src/reducers/responseReducer';
import bloodRequestReducer from '../../../Portfolio Project/BloodBond/Frontend/bloodbondapp/src/reducers/bloodRequestReducer';
import BloodRequestContext from '../../../Portfolio Project/BloodBond/Frontend/bloodbondapp/src/contexts/bloodRequestContext';
import InvoiceContext from './contexts/invoiceContext';
import InvoiceReducer from './src/reducers/invoiceReducer';
import backgroundImage from './images/backgroundImage.jpeg'
import './App.css';


import bloodInventoryReducer from '../../../Portfolio Project/BloodBond/Frontend/bloodbondapp/src/reducers/bloodInventoryReducer';
import BloodInventoryContext from '../../../Portfolio Project/BloodBond/Frontend/bloodbondapp/src/contexts/bloodInventoryContext';

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

  const bloodRequestInitialState={
    bloodRequests:[],
    userBloodRequests:[],
    bloodBankBloodRequests:[],
    serverErrors:[]
  }

  const responseInitialState={
    responses:[],
    serverErrors:[]
  }
  const invoiceInitialState={
    invoices:[],
    serverErrors:[]
  }
  const [users, userDispatch] = useReducer(userReducer, userInitialState);
  const [bloodInventory, bloodInventoryDispatch] = useReducer(bloodInventoryReducer, bloodInventoryInitialState);
  const[bloodRequests,bloodRequestDispatch]=useReducer(bloodRequestReducer,bloodRequestInitialState)
  const [responses,responseDispatch]=useReducer(responseReducer,responseInitialState)
  const [invoices,invoiceDispatch]=useReducer(InvoiceReducer,invoiceInitialState)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const handleShowRegistration = () => {
    setShowRegistrationForm(!showRegistrationForm);
  };

  return (
    <UserContext.Provider value={{ users, userDispatch }}>
      <BloodInventoryContext.Provider value={{ bloodInventory, bloodInventoryDispatch }}>
        <BloodRequestContext.Provider value={{bloodRequests,bloodRequestDispatch}}>
          <ResponseContext.Provider value={{responses,responseDispatch}}>
            <InvoiceContext.Provider value={{invoices,invoiceDispatch}}>
        <div className="App">
        <Header handleShowRegistration={handleShowRegistration} showRegistrationForm={showRegistrationForm} />
          <h1>BloodBond App</h1>
          {showRegistrationForm ? (
            <Routes>
              <Route path='/register' element={<UserContainer />} />
              <Route path='/login' element={<UserLoginForm />} />
              <Route path='/bloodbank/dashboard' element={<BloodBankDashboard />} />
              <Route path="/bloodbank/:id/blood-inventory-form" element={<BloodInventoryForm />} />
              <Route path='/requests' element={<BloodRequestsTable/>}/>
              <Route path='/invoices/:requestId' element={<InvoiceForm/>}/>
              {/* <Route path="/user/:id/blood-request-form" element={<BloodRequestForm/>}/> */}
              <Route path="/bloodbank/:id/show-inventory" element={<BloodInventoryTable />} />
              <Route path='/user/dashboard' element={<ProfileDashboard />} />
              <Route path='/admin/dashboard' element={<AdminDashboard />} />
            </Routes>
          ) : (
            <Link to='/register' onClick={handleShowRegistration}>Register Now</Link>
          )}
        </div>
        </InvoiceContext.Provider>
        </ResponseContext.Provider>
        </BloodRequestContext.Provider>
      </BloodInventoryContext.Provider>

    </UserContext.Provider>
  );
}

export default App;