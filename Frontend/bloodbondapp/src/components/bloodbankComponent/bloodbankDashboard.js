import BloodBankForm from "./bloodbankForm"
import {useState,useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux"
import { startFetchingBloodBank } from "../../actions/bloodbankActions"
import { Card, Button } from 'react-bootstrap'
export default function BloodBankDashboard(){
    const dispatch=useDispatch()
    const bloodBank=useSelector((state)=>{
        return state.bloodbanks.bloodbank
    })
    console.log(bloodBank.length)
    const [showForm,setShowForm]=useState(false)
    useEffect(()=>{
       dispatch(startFetchingBloodBank())
    },[])
    const handleClick=()=>{
        setShowForm(true)
    }
    return(
        <div className="row">
            <h3>BloodBankDashboard</h3>
        {bloodBank?.length===0?(<div>
            <button className='btn btn-primary' onClick={handleClick}>Add BloodBank</button>
        </div>):(bloodBank?.map((ele,index)=>{
            return <div key={index}>
                <Card style={{ width: '18rem', margin: '1rem' }}>
                <Card.Body>
                <Card.Title>{ele.name}</Card.Title>
                <Card.Text>
                {ele.license && (
                 <div>
                 <h6>License:</h6>
                 <img src={ele.license} alt="License" />
                 </div>
                 )}
                 {ele.photos && (
                 <div>
                 <h6>Photos:</h6>
                 {ele.photos.map((photo, i) => (
                 <img key={i} src={photo} alt={`Photo ${i}`} />
                 ))}
                </div>
                 )}
                    <h6>Contact number:</h6><p>{ele.phoneNumber}</p>
                    <h6>Address:</h6><p>{ele.address.building},{ele.address.locality},{ele.address.city},{ele.address.pincode},{ele.address.state},{ele.address.country}</p>
                    <h6>Opening Hours:</h6><p>{ele.openingHours.opensAt.hour}:{ele.openingHours.opensAt.minutes}:{ele.openingHours.opensAt.period}-{ele.openingHours.closesAt.hour}:{ele.openingHours.closesAt.minutes}:{ele.openingHours.closesAt.period}</p>
                    <h6>Services:</h6>{ele.services.map((service,i)=>{
                        return <p key={i}>{service}</p>
                    })}
                </Card.Text>
                </Card.Body>
                </Card>
            </div>
        }))}
        {showForm&& ( <div col-md-6>
                    <BloodBankForm />
                </div>)}
            </div>
    )
}