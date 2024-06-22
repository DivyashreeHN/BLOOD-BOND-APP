import {useState,useContext} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import {PersonCircle,Envelope,Lock,People} from 'react-bootstrap-icons'
import {Container,Card,Row,Col} from 'react-bootstrap'
import UserContext from '../../contexts/userContext'
import * as yup from 'yup'
const userValidationSchema=yup.object().shape({
    username:yup.string().required('username is required'),
    email:yup.string().required('email is required'),
    password:yup.string().required('password is required'),
    role:yup.string().required('role is required')
})
export default function UserRegistrationForm(){
    const [form,setForm]=useState({
        username:'',
        email:'',
        password:'',
        role:'',
    })
    const [formErrors,setFormErrors]=useState({})
    const [successfulRegistration,setSuccessfulRegistration]=useState(false)
    const {users,userDispatch}=useContext(UserContext)
    const handleChange=(e)=>{
        const {name,value}=e.target
        setForm({...form,[name]:value})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            const response=await axios.post('http://localhost:3080/api/user/register',form)
            console.log(response.data)
            userDispatch({type:'REGISTER_USER',payload:response.data})
            userDispatch({type:'SET_SERVER_ERRORS',payload:[]})
            setSuccessfulRegistration(true)
        }catch(err){
            
                console.log(err)
                userDispatch({type:'SET_SERVER_ERRORS',payload:err.response.data.errors})
            }
           
        }
    return(
        <>
        {successfulRegistration?(<div>
            <h3>Registration Successful</h3>
            <Link to='/login'>Login</Link>
            </div>):(<div>
            <Container>
                <Row className='justify-content-center'>
                    <Col md={6}>
                        <Card className='bg-danger text-black'>
                            <Card.Body>
                            <Card.Title>User Registration Form</Card.Title>
                            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label" htmlFor="name"><PersonCircle/> User Name</label>
                <input type="text"
                placeholder='Enter UserName'
                value={form.username}
                onChange={handleChange}
                id='name'
                name='username'
                className='form-control'
                />
            </div>
            {formErrors&&formErrors.username&&<div className='errorMessage'>{formErrors.username}</div>}
            <div className="form-group">
                <label className="form-label" htmlFor="email"><Envelope/>Email</label>
                <input type="text"
                placeholder='Enter Email'
                value={form.email}
                onChange={handleChange}
                id='email'
                name='email'
                className='form-control'
                />
            </div>
            {formErrors&&formErrors.email&&<div className='errorMessage'>{formErrors.email}</div>}
            <div className="form-group">
                <label className="form-label" htmlFor="password"><Lock/>Password</label>
                <input type="text"
                placeholder='Enter Password'
                value={form.password}
                onChange={handleChange}
                id='password'
                name='password'
                className='form-control'
                />
            </div>
            {formErrors&&formErrors.password&&<div className='errorMessage'>{formErrors.password}</div>}
            <div className="form-group">
                <label className="form-label" htmlFor="role"><People/>Role</label>
                <select value={form.role}
                placeholder='Select Role'
                 onChange={handleChange}
                 id='role'
                 name='role'
                 className='form-select'>
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="bloodbank">BloodBank</option>
                </select>
            </div>
            {formErrors&&formErrors.role&&<div className='errorMessage'>{formErrors.role}</div>}
            <input type='submit' className='btn btn-dark'/>
            
        </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        
        <h3>Already have an account ?</h3><Link to='/login'>Login</Link>
        {users.serverErrors&&users.serverErrors.length>0?(<div>
                <h4>you are prohibited from registering due to these errors</h4>
                <ul>
                {users.serverErrors.map((err,i)=>{
                    return <li key={i}>{err.msg}</li>
                })}
                </ul>
            </div>):(" ")}
        </div>)}
        
        </>
    )
}
