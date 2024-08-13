import { useState, useReducer, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header/header';
import UserContainer from './components/userComponent/userContainer';
import UserLoginForm from './components/userComponent/userLoginForm';
import BloodBankDashboard from './components/bloodbankComponent/bloodbankDashboard';
import ProfileDashboard from './components/userProfileComponent/profileDashboard';
import AdminDashboard from './components/adminComponent/adminDashboard';
import BloodInventoryForm from './components/bloodInventoryComponent/bloodInventoryForm';
import BloodInventoryTable from './components/bloodInventoryComponent/bloodInventoryTable';
import ProfileForm from './components/userProfileComponent/profileForm';
import ViewProfile from './components/userProfileComponent/viewProfile';
import ViewMyRequests from './components/userProfileComponent/viewMyBloodRequest';
import ViewOtherRequests from './components/userProfileComponent/viewOtherRequests';
import ViewRequests from './components/userProfileComponent/viewRequests';
import ShowProfiles from './components/adminComponent/showProfile';
import ShowBloodRequests from './components/adminComponent/showBloodRequests';
import ShowBloodBankRequests from './components/adminComponent/showBloodBanksRequest';
import BloodRequestForm from './components/userProfileComponent/blood-requestForm';
import BloodRequestsTable from './components/bloodbankComponent/bloodRequestsTable';
import InvoiceForm from './components/bloodbankComponent/invoiceForm';
import './App.css';
import userReducer from './reducers/userReducer';
import UserContext from './contexts/userContext';
import ResponseContext from "./contexts/responseContext";
import responseReducer from './reducers/responseReducer';
import bloodRequestReducer from './reducers/bloodRequestReducer';
import BloodRequestContext from './contexts/bloodRequestContext';
import InvoiceContext from './contexts/invoiceContext';
import InvoiceReducer from './reducers/invoiceReducer';
import bloodInventoryReducer from './reducers/bloodInventoryReducer';
import BloodInventoryContext from './contexts/bloodInventoryContext';
import UserResponses from './components/userProfileComponent/userResponses';
import BloodbankResponses from './components/userProfileComponent/bloodbankResponses';
import ViewInvoice from './components/userProfileComponent/viewInvoice';
import Success from './components/userProfileComponent/paymentSuccess';
import Cancel from './components/userProfileComponent/paymentCancel';
import MapView from './components/userProfileComponent/mapView';
import userHistoryReducer from './reducers/userHistoryReducer';
import UserHistoryContext from './contexts/userHistoryContext';
import UserResponseHistory from './components/userProfileComponent/viewMyResponseHistory';

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
    formErrors: {}
  };

  const bloodRequestInitialState = {
    bloodRequests: [],
    userBloodRequests: [],
    bloodRequestToAdmin: [],
    requestToUser: [],
    otherRequestToUser: [],
    bloodbankBloodRequests: [],
    serverErrors: [],
    formErrors:[]
  };

  const responseInitialState = {
    responsesData: [],
    serverErrors: []
  };

  const invoiceInitialState = {
    invoiceData: [],
    serverErrors: []
  };

  const userHistoryInitialState={
    userResponsesHistory:[],
    serverErrors:[]
  }

  const [users, userDispatch] = useReducer(userReducer, userInitialState);
  const [bloodInventory, bloodInventoryDispatch] = useReducer(bloodInventoryReducer, bloodInventoryInitialState);
  const [bloodRequests, bloodRequestDispatch] = useReducer(bloodRequestReducer, bloodRequestInitialState);
  const [responses, responseDispatch] = useReducer(responseReducer, responseInitialState);
  const [invoices, invoiceDispatch] = useReducer(InvoiceReducer, invoiceInitialState);

  const[userHistories,userHistoryDispatch]=useReducer(userHistoryReducer,userHistoryInitialState)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const handleShowRegistration = () => {
    setShowRegistrationForm(!showRegistrationForm);
  };

  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Get the navigate function

  // Redirect to /register on initial load
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/register');
    }
  }, [navigate, location.pathname]);

  return (
    <UserContext.Provider value={{ users, userDispatch }}>
      <BloodInventoryContext.Provider value={{ bloodInventory, bloodInventoryDispatch }}>
        <BloodRequestContext.Provider value={{ bloodRequests, bloodRequestDispatch }}>
          <ResponseContext.Provider value={{ responses, responseDispatch }}>
            <InvoiceContext.Provider value={{ invoices, invoiceDispatch }}>
              <UserHistoryContext.Provider value={{userHistories,userHistoryDispatch}}>
              <div>
             <Header
                  handleShowRegistration={handleShowRegistration}
                  showRegistrationForm={showRegistrationForm}
                  showButtons={!showRegistrationForm}
                  currentPath={location.pathname} // Pass the current path to Header
                />
                
                <Routes>
                  <Route path='/register' element={<UserContainer />} />
                  <Route path='/login' element={<UserLoginForm />} />
                  <Route path='/bloodbank/dashboard' element={<BloodBankDashboard />} />
                  <Route path="/bloodbank/:id/blood-inventory-form" element={<BloodInventoryForm />} />
                  <Route path="/profile/:id/profileForm" element={<ProfileForm />} />
                  <Route path='/requests' element={<BloodRequestsTable />} />
                  <Route path='/invoices/:requestId' element={<InvoiceForm />} />
                  <Route path="/add/request" element={<BloodRequestForm />} />
                  <Route path="/add/profile" element={<ProfileForm />} />
                  <Route path="/profile/:id" element={<ViewProfile />} />
                  <Route path="/my/requests" element={<ViewMyRequests />} />
                  <Route path="/edit-request/:id" element={<BloodRequestForm />} />
                  <Route path="/add/profile" element={<ProfileForm />} />
                  <Route path="/add/request" element={<BloodRequestForm />} />
                  <Route path="/view/other/requests" element={<ViewOtherRequests />} />
                  <Route path="/view/requests" element={<ViewRequests />} />
                  <Route path="/view/profiles/admin" element={<ShowProfiles />} />
                  <Route path="/view/requests/admin" element={<ShowBloodRequests />} />
                  <Route path="/view/bloodbank-requests/admin" element={<ShowBloodBankRequests />} />
                  <Route path="/bloodbank/:id/show-inventory" element={<BloodInventoryTable />} />
                  <Route path='/responses/:requestId/user' element={<UserResponses/>}/>
                  <Route path='/responses/:requestId/bloodbank' element={<BloodbankResponses/>}/>
                  <Route path='/view/invoice/:requestId/:responderId' element={<ViewInvoice/>}/>
                  <Route path='/user/dashboard' element={<ProfileDashboard />} />
                  <Route path='/admin/dashboard' element={<AdminDashboard />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/cancel" element={<Cancel />} />
                  <Route path="/map/:lat/:lng/:address" element={<MapView />} />
                  <Route path='/user/response/history' element={<UserResponseHistory/>}/>
                </Routes>
                </div>
                </UserHistoryContext.Provider>
            </InvoiceContext.Provider>
          </ResponseContext.Provider>
        </BloodRequestContext.Provider>
      </BloodInventoryContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
