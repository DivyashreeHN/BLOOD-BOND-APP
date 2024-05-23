import {useState,useContext, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {Card,Container,Row,Col} from 'react-bootstrap'
import axios from 'axios'
import BloodInventoryContext from '../../contexts/bloodInventoryContext'
export default function BloodInventoryForm({editBlood,toggle}){
    const {id} =useParams()
    const {bloodInventory,bloodInventoryDispatch}=useContext(BloodInventoryContext)
    const [form,setForm]=useState({
        blood:{
            bloodType:'',
            bloodGroup:''
        },
        units:'',
        donationDate:'',
        status:''
    })
    useEffect(() => {
        if (editBlood) {
            setForm({
                blood: {
                    bloodGroup:editBlood.blood.bloodGroup,
                    bloodType: editBlood.blood.bloodType
            },
                units: editBlood.units,
                donationDate: new Date(editBlood.donationDate).toISOString().split('T')[0],
                status: editBlood.status
            });
        }
    }, [editBlood])
    const clearForm=()=>{
        setForm({
            blood:{
                bloodType:'',
                bloodGroup:''
            },
            units:'',
            donationDate:'',
            status:''
        })
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        if (name.startsWith('blood')) {
            setForm((prevForm) => ({
                ...prevForm,
                blood: {
                    ...prevForm.blood,
                    [name]: value,
                },
            }));
        } else {
            setForm({ ...form, [name]: value });
        }
    }
    const handleRadioChange=(e)=>{
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })
    }
    const handleSubmit=async (e)=>{
        e.preventDefault()
        console.log('form',form)
        try{
        if(editBlood){
            const response=await axios.put(`http://localhost:3080/api/bloodinventries/${editBlood._id}`,form,{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            })
            console.log(response)
            bloodInventoryDispatch({type:'EDIT_BLOODINVENTORY',payload:response.data})
            bloodInventoryDispatch({type:'SET_SERVER_ERRORS',payload:[]})
            clearForm()
            toggle()
        }
        else{
            const response=await axios.post(`http://localhost:3080/api/bloodinventries/${id}`,form,{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            })
            console.log(response.data)
            bloodInventoryDispatch({type:'ADD_BLOODINVENTORY', payload:response.data})
            bloodInventoryDispatch({type:'SET_SERVER_ERRORS',payload:[]})
            clearForm()
        }
            
        }catch(err){
            console.log(err)
            bloodInventoryDispatch({type:'SET_SERVER_ERRORS',payload:err.response.data.errors})
        }
    }
    return (
        <div>
            <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                <Card className="bg-danger text-white">
                <Card.Body>
                    <Card.Title>BloodInventory Form</Card.Title>
                    <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                            <label className='form-label' htmlFor='type'>Blood Type</label>
                            <select 
                            value={form.blood.bloodType}
                            onChange={handleChange}
                            id='type'
                            name='bloodType'
                            className='form-select'
                            >
                                <option value=" ">select BloodType</option>
                                <option>RBC</option>
                                <option>platelets</option>
                                <option>plasma</option>
                                <option>wholeBlood</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <label className='form-label' htmlFor='group'>Blood Group</label>
                            <select 
                            value={form.blood.bloodGroup}
                            onChange={handleChange}
                            id='group'
                            name='bloodGroup'
                            className='form-select'>
                            <option value=" ">Select BloodGroup</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <label className='form-label' htmlFor='units'>units</label>
                            <input type='text'
                            placeholder='Enter units'
                            value={form.units}
                            onChange={handleChange}
                            id='units'
                            name='units'
                            className='form-control'
                            />
                        </div>
                        <div className='form-group'>
                            <label className='form-label' htmlFor='date'>Donation Date</label>
                            <input type='date'
                            placeholder='Enter donation date'
                            value={form.donationDate}
                            onChange={handleChange}
                            id='date'
                            name='donationDate'
                            className='form-control'
                            />
                        </div>
                        <div className="form-group">
                            <label  className="form-label" htmlFor="status">status</label><br/>
                            <input type="radio"
                            value="available"
                            onChange={handleRadioChange}
                            id="available"
                            name="status"/>
                            <label htmlFor="available">available</label>{" "}
                            <input type="radio"
                            value="booked"
                            onChange={handleRadioChange}
                            id="booked"
                            name="status"/>
                            <label htmlFor="booked">booked</label>{" "}
                            <input type="radio"
                            value="expired"
                            onChange={handleRadioChange}
                            id="expired"
                            name="status"/>
                            <label htmlFor="expired">expired</label>
                            </div>
                        <input type='submit' className='btn btn-light'/>
                    </form>
                </Card.Body>
            </Card>
            </Col>
            </Row>
            
            {bloodInventory.serverErrors&& bloodInventory.serverErrors.length>0?(
                 <Row className="justify-content-center">
                 <Col md={6}>
            <div>
                <h4>You are prohibited from saving this blood deatails due to these errors</h4>
                <ul>{bloodInventory.serverErrors.map((err,i)=>{
                    return <li key={i}>{err.msg}</li>
                    })}</ul>
            </div>
            </Col>
            </Row>)
            
            :(" ")}
            </Container>
        </div>
    )
}