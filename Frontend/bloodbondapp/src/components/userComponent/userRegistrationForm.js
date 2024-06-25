import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PersonCircle, Envelope, Lock, People } from 'react-bootstrap-icons';
import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2'
import UserContext from '../../contexts/userContext';
import backgroundImage from '../../images/backgroundImage1.jpg';
import * as yup from 'yup';

const userValidationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  role: yup.string().required('Role is required'),
});

const UserRegistrationForm = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [successfulRegistration, setSuccessfulRegistration] = useState(false);
  const { users, userDispatch } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userValidationSchema.validate(form, { abortEarly: false });
      const response = await axios.post('http://localhost:3080/api/user/register', form);
      console.log(response.data);
      userDispatch({ type: 'REGISTER_USER', payload: response.data });
      userDispatch({ type: 'SET_SERVER_ERRORS', payload: [] });
      setSuccessfulRegistration(true);
      Swal.fire({
        title: 'Success!',
        text: 'Registration Succesfull',
        icon: 'success',
        confirmButtonText: 'OK'
    })
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = {};
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setFormErrors(errors);
      } else {
        console.error(err);
        userDispatch({ type: 'SET_SERVER_ERRORS', payload: err.response.data.errors });
        Swal.fire({
            title: 'Error!',
            text: err.response?.data?.errors || 'An unexpected error occurred',
            icon: 'error',
            confirmButtonText: 'OK'
        })
      }
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'flex-end', // Move to the right
        alignItems: 'center',
        paddingRight: '50px', // Add some padding to the right
      }}
    >
      <Container style={{ maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '20px', borderRadius: '10px' }}>
        <Row className="justify-content-center">
          <Col md={12}>
            <Card>
              <Card.Body>
                <Card.Title className="text-center">User Registration Form</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="name"><PersonCircle /> User Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter UserName"
                      value={form.username}
                      onChange={handleChange}
                      id="name"
                      name="username"
                    />
                    {formErrors.username && <div className="text-danger">{formErrors.username}</div>}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="email"><Envelope /> Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter Email"
                      value={form.email}
                      onChange={handleChange}
                      id="email"
                      name="email"
                    />
                    {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="password"><Lock /> Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter Password"
                      value={form.password}
                      onChange={handleChange}
                      id="password"
                      name="password"
                    />
                    {formErrors.password && <div className="text-danger">{formErrors.password}</div>}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="role"><People /> Role</Form.Label>
                    <Form.Select
                      value={form.role}
                      onChange={handleChange}
                      id="role"
                      name="role"
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                      <option value="bloodbank">BloodBank</option>
                    </Form.Select>
                    {formErrors.role && <div className="text-danger">{formErrors.role}</div>}
                  </Form.Group>
                  <Button variant="dark" type="submit" className="w-100">Register</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {!successfulRegistration && (
          <div className="text-center mt-3">
            <h3>Already have an account?</h3>
            <Link to="/login">Login</Link>
          </div>
        )}
        {users.serverErrors && users.serverErrors.length > 0 && (
          <div>
            <h4>You are prohibited from registering due to these errors:</h4>
            <ul>
              {users.serverErrors.map((err, i) => (
                <li key={i}>{err.msg}</li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </div>
  );
};

export default UserRegistrationForm;
