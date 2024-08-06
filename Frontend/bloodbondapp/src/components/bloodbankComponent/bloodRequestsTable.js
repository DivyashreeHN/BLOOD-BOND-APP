import React, { useEffect, useContext,useState} from 'react';
import axios from 'axios';
import BloodRequestContext from '../../contexts/bloodRequestContext';
import ResponseContext from '../../contexts/responseContext';
import { Button,Alert} from 'react-bootstrap';
import {Link} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import { BiMap } from 'react-icons/bi';
export default function BloodRequestsTable() {
    const { bloodRequests, bloodRequestDispatch } = useContext(BloodRequestContext);
    const { responses, responseDispatch } = useContext(ResponseContext);
    const [errors,setErrors]=useState([])
    const navigate=useNavigate()
    console.log('requests',bloodRequests.bloodbankBloodRequests)
    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`http://localhost:3080/api/blood/request/listall`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                console.log('response',response.data);
                bloodRequestDispatch({ type: 'REQUESTS_BLOODBANK', payload: response.data });
                bloodRequestDispatch({ type: 'SET_SERVER_ERRORS', payload: [] });
            } catch (err) {
                bloodRequestDispatch({ type: 'SET_SERVER_ERRORS', payload: err.response?.data?.errors });
                console.log(err.message);
            }
        })();
    }, [bloodRequestDispatch]);

   const handleResponse=async(id)=>{
    console.log('Accept request')
    try{
        const response=await axios.post(`http://localhost:3080/api/response/${id}`,{},{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
        console.log(response.data)
        responseDispatch({type:'ADD_BLOODBANK_RESPONSES',payload:response.data})
        responseDispatch({type:'SET_SERVER_ERRORS',payload:[]})
        setErrors([])
        navigate(`/invoices/${id}`)
    }
    catch(err){
        console.log('error occured')
        console.log(err.response.data.errors)
        responseDispatch({type:'SET_SERVER_ERRORS',payload:err.response.data.errors})
        setErrors([err.response.data.errors])

    }
   }

    return (
        <div className="container">
            <h1 className="my-4">All Blood Requests</h1>
           
            {bloodRequests?.bloodbankBloodRequests?.length > 0 ? (
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Patient Name</th>
                            <th>Blood Type</th>
                            <th>Blood Group</th>
                            <th>Units</th>
                            <th>Date</th>
                            <th>Phone Number</th>
                            <th>Critical</th>
                            <th>Address</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='table-info'>
                        {bloodRequests.bloodbankBloodRequests.map((request) => (
                            <tr key={request._id} className={request.critical === 'yes' ? 'table-danger' : ''}>
                                <td>{request.patientName}</td>
                                <td>{request.blood.bloodType}</td>
                                <td>{request.blood.bloodGroup}</td>
                                <td>{request.units}</td>
                                <td>{new Date(request.date).toLocaleDateString()}</td>
                                <td>{request.atendeePhNumber}</td>
                                <td>{request.critical}</td>
                                <td>
                                    {`${request.donationAddress.building}, ${request.donationAddress.locality}, ${request.donationAddress.city}, ${request.donationAddress.state}, ${request.donationAddress.pincode}, ${request.donationAddress.country}`}
                                </td>
                                <td>
                                <Link to={`/map/${request.geoLocation.coordinates[1]}/${request.geoLocation.coordinates[0]}/${encodeURIComponent(`${request.donationAddress.building}, ${request.donationAddress.locality}, ${request.donationAddress.city}, ${request.donationAddress.state}, ${request.donationAddress.pincode}, ${request.donationAddress.country}`)}`}>
                                        <BiMap size={24} />
                                    </Link>
                                </td>
                                <td><Button className='' onClick={()=>{
                                    handleResponse(request._id)
                                }}>Accept</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No blood requests found</p>
            )}
             {errors?.length>0 && <Alert variant="danger">{errors}</Alert>}
        </div>
    );
}
