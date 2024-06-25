import {Container,Row,Col,Card} from 'react-bootstrap'
import { useState, useContext } from 'react';
import { Envelope, Lock } from 'react-bootstrap-icons';
import axios from 'axios';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import UserContext from '../../contexts/userContext';
import backgroundImage from '../../images/backgroundImage1.jpg' 

export default function UserLoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const { users, userDispatch } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3080/api/user/login', form);
      const token = response.data.token;
      userDispatch({ type: 'LOGIN_USER', payload: token });
      localStorage.setItem('token', token);
      
      alert('Logged in successfully');

      const userDetails = await axios.get('http://localhost:3080/api/user/account', {
        headers: { Authorization: token }
      });

      const { role } = userDetails.data;
      const {username}=userDetails.data
      const userName=username
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'user':
          navigate('/user/dashboard');
          break;
        case 'bloodbank':
          navigate('/bloodbank/dashboard');
          break;
        default:
          // Handle unknown role
          break;
      }

      userDispatch({ type: 'SET_USER', payload: userDetails.data });
      userDispatch({ type: 'SET_SERVER_ERRORS', payload: [] });
      Swal.fire({
        title: 'Success!',
        text: `Welcome ${userName}`,
        icon: 'success',
        confirmButtonText: 'OK'
    })
    } catch (err) {
      handleErrors(err);
    }
  };

  const handleErrors = (err) => {
    if (err.response && err.response.data && err.response.data.errors) {
      userDispatch({ type: 'SET_SERVER_ERRORS', payload: err.response.data.errors });
    } else {
      // Handle other types of errors
    }

}
    return(
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
      <Container style={{ maxWidth: '500px',maxHeight:'500px', backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '20px', borderRadius: '10px' }}>
                <Row className='justify-content-center'>
                    <Col md={12}>
                        <Card>
                            <Card.Body>
                                <Card.Title className="text-center">User Login Form</Card.Title>
                                <form onSubmit={handleSubmit}>
                <div className='form-group'>
                <label className='form-label' htmlFor='email'><Envelope/> Email</label>
                <input type="text"
                placeholder='Enter Email'
                value={form.email}
                onChange={handleChange}
                id='email'
                name='email'
                className='form-control'/>
                </div>
                <div className='form-group'>
                <label className='form-label' htmlFor='password'><Lock/> Password</label>
                <input type="text"
                placeholder='Enter Password'
                value={form.password}
                onChange={handleChange}
                id='password'
                name='password'
                className='form-control'/>
                </div>
                <input variant="dark" type="submit" className="w-100" />
                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {users.serverErrors&&users.serverErrors.length>0?(<div>
                <h4>you are prohibited from logging in due to these errors</h4>
                <ul>
                {users.serverErrors.map((err,i)=>{
                   return <li key={i}>{err.msg}</li>
                })}
                </ul>
            </div>):(" ")}
            </Container>
            </div>
)
  };

  