import React from 'react';
import { useState } from 'react';
import { Link, useMatch } from 'react-router-dom';
import { Navbar, Nav ,Dropdown} from 'react-bootstrap';
import { House,PersonFill } from 'react-bootstrap-icons'
import logo from '../images/Logo.jpg'
const Header = ({ handleShowRegistration, showRegistrationForm, showButtons }) => {
  const matchBloodBankDashboard = useMatch('/bloodbank/dashboard');
  const matchBloodRequestsPage = useMatch('/requests');
  const matchBloodInventoryForm = useMatch('/bloodbank/:id/blood-inventory-form');
  const matchBloodInventory = useMatch('/bloodbank/:id/show-inventory');
  const matchUserDashboard = useMatch('/user/dashboard');
  const matchRegistrationPage=useMatch('/register')
  const matchLoginPage=useMatch('/login')
  const matchInvoices=useMatch('/invoices/:requestId')
  const matchMyRequests=useMatch('/my/requests')
  const matchViewRequests=useMatch('/view/requests')
  const matchViewOtherRequests=useMatch('/view/other/requests')
  const matchAddRequests=useMatch('/add/request')
  const matchResponseHistory=useMatch('/user/response/history')
  const matchViewProfiles=useMatch('/view/profiles/admin')
  const matchAdminRequests=useMatch('/view/requests/admin')
  const matchAdminDashboard=useMatch('/admin/dashboard')
  const matchBloodBankResponseHistory=useMatch('/view/all/bloodbank/responses')
  const matchUserResponses=useMatch('/responses/:requestId/user')
  const matchBloodBankResponses=useMatch('/responses/:requestId/bloodbank')
  const [showEmail, setShowEmail] = useState(false);
  const email = localStorage.getItem('email');

  const toggleEmail = () => {
    setShowEmail(!showEmail);
  };
  const isAuthPage = matchRegistrationPage || matchLoginPage;
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">
      <img
      src={logo} 
      alt="BloodBond App Logo"
      width="50" 
      height="40"
      className="d-inline-block align-top"
      />{'  '}
      BloodBond App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {(matchBloodInventory || matchBloodInventoryForm || matchBloodRequestsPage || matchInvoices || matchBloodBankResponseHistory) && (
            <Nav.Link as={Link} to="/bloodbank/dashboard"><House size={24} /></Nav.Link>
          )}
          {(matchMyRequests || matchViewRequests || matchViewOtherRequests || matchBloodBankResponses || matchUserResponses || matchAddRequests || matchResponseHistory) && (
            <Nav.Link as={Link} to="/user/dashboard"><House size={24} /></Nav.Link>
          )}
          {(matchViewProfiles || matchAdminRequests)&&(
            <Nav.Link as={Link} to='/admin/dashboard'><House size={24} /></Nav.Link>
          )}
          { (matchRegistrationPage || matchLoginPage) && (
            <>
              <Nav.Link as={Link} to="/register" className="mx-1">Register Now</Nav.Link>
              <Nav.Link as={Link} to="/login" className="mx-1">Login</Nav.Link>
            </>
          )}
          {matchBloodBankDashboard && (
            <>
              <Nav.Link as={Link} to="/requests" className="mx-1">Blood Requests</Nav.Link>
              <Nav.Link as={Link} to='/view/all/bloodbank/responses'>My Responses</Nav.Link>
              <Nav.Link as={Link} to="/register" className="mx-1">Logout</Nav.Link>
            </>
          )}
          {(matchBloodRequestsPage || matchBloodInventoryForm || matchUserResponses || matchBloodBankResponses || matchBloodBankResponseHistory || matchBloodInventory || matchInvoices || matchMyRequests || matchViewRequests || matchViewOtherRequests || matchAddRequests || matchResponseHistory || matchViewProfiles || matchAdminRequests) && (
            <Nav.Link as={Link} to="/register" className="mx-1">Logout</Nav.Link>
          )}
          {matchUserDashboard && (
            <>
              <Nav.Link as={Link} to="/my/requests">My Requests</Nav.Link>
              <Nav.Link as={Link} to="/view/requests">View Requests</Nav.Link>
              <Nav.Link as={Link} to="/view/other/requests">View Other Requests</Nav.Link>
              <Nav.Link as={Link} to="/add/request">Add Request</Nav.Link>
              <Nav.Link as={Link} to="/user/response/history">ResponseHistory</Nav.Link>
              <Nav.Link as={Link} to="/register" className="mx-1">Logout</Nav.Link>
            </>
          )}
          {matchAdminDashboard && (
            <>
            <Nav.Link as={Link} to="/view/profiles/admin">ViewProfiles</Nav.Link>
            <Nav.Link as={Link} to="/view/requests/admin"> View Requests</Nav.Link>
            <Nav.Link as={Link} to="/register" className="mx-1">Logout</Nav.Link>
            </>
          )}
           {!isAuthPage && (
                <Dropdown align="end" onToggle={toggleEmail}>
                  <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    <PersonFill size={24} />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {showEmail && (
                      <Dropdown.Item>
                        {email ? email : "No Email Available"}
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
