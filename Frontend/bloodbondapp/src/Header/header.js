import React from 'react';
import { Link, useMatch } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';

const Header = ({ handleShowRegistration, showRegistrationForm, showButtons }) => {
  const matchBloodBankDashboard = useMatch('/bloodbank/dashboard');
  const matchBloodRequestsPage = useMatch('/requests');
  const matchBloodInventoryForm = useMatch('/bloodbank/:id/blood-inventory-form');
  const matchBloodInventory = useMatch('/bloodbank/:id/show-inventory');

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">BloodBond App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto"> {/* Use ms-auto for Bootstrap 5 or ml-auto for Bootstrap 4 */}
          {showButtons && !matchBloodBankDashboard && !matchBloodRequestsPage && !matchBloodInventoryForm && !matchBloodInventory && (
            <>
              <Button variant="outline-light" as={Link} to="/register" className="mx-1">Register Now</Button>
              <Button variant="outline-light" as={Link} to="/login" className="mx-1">Login</Button>
            </>
          )}
          {matchBloodBankDashboard && (
            <>
              <Button variant="outline-light" as={Link} to="/requests" className="mx-1">Blood Requests</Button>
              <Button variant="outline-light" as={Link} to="/register" className="mx-1">Logout</Button>
            </>
          )}
          {(matchBloodRequestsPage || matchBloodInventoryForm || matchBloodInventory) && (
            <Button variant="outline-light" as={Link} to="/register" className="mx-1">Logout</Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
