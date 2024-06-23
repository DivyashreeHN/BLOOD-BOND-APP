// Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';

const Header = ({ handleShowRegistration, showRegistrationForm }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">BloodBond App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            
          </Nav>
          <Nav>
            {showRegistrationForm ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register" onClick={handleShowRegistration}>Register Now</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
