
import BloodBankForm from "./bloodbankForm"
import axios from 'axios'
import BloodInventoryForm from "../bloodInventoryComponent/bloodInventoryForm"
import BloodInventoryTable from "../bloodInventoryComponent/bloodInventoryTable"
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { startFetchingBloodBank } from "../../actions/bloodbankActions"
import BloodRequestContext from "../../contexts/bloodRequestContext"
import { useContext } from "react"
import { Card, Button,Container,Row,Col } from 'react-bootstrap'
import {Link} from 'react-router-dom'

export default function BloodBankDashboard() {
    const [inventory, setInventory] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [showInventoryTable, setShowInventoryTable] = useState(false)
    const {bloodRequests,bloodRequestDispatch}=useContext(BloodRequestContext)
    const dispatch = useDispatch()
    const bloodBank = useSelector((state) => {
        return state.bloodbanks.bloodbank
    })
    const id = bloodBank[0]?._id
    useEffect(() => {
        dispatch(startFetchingBloodBank())
    }, [])

    const handleClick = () => {
        setShowForm(!showForm)
    }
    const formatUrl = (path) => {
        // Replace backslashes with forward slashes
        const formattedPath = path.replace(/\\/g, '/')
        console.log(formattedPath)
        // Prefix with base URL
        return `http://localhost:3080/${formattedPath}`
    }

    
    // const handleInventory = () => {
    //     console.log('creating inventory ....')
    //     console.log('id', id)
    //     setInventory(!inventory)
    //     console.log(inventory)
    // }

    // const toggleShowInventory = () => {
    //     setShowInventoryTable(!showInventoryTable)
    // }

    return(
        <div className="row">
            <h3>BloodBankDashboard</h3>
            {showForm ? (
                <div col-md-6>
                    <BloodBankForm />
                </div>
            ) : (
                <>
                {bloodBank?.length===0?(<div>
            <button className='bg-danger text-white' onClick={handleClick}>Add BloodBank</button>
        </div>):(bloodBank?.map((ele,index)=>{
            console.log("License URL:", ele.license)
            console.log("Photos URLs:", ele.photos)
            return <div key={index}>
                <Container>
                <Row className="justify-content-center">
                <Col md={6}>
                <Card className="bg-danger text-black">
                <Card.Body>
                <Card.Title>{ele.name}</Card.Title>
                <Card.Text>
                {ele.license && (
                 <div>
                 <h6>License:</h6>
                 <img className="img-fluid"src={formatUrl(ele.license[0])} alt="License" />
                 </div>
                 )}
                 {ele.photos && (
                 <div>
                 <h6>Photos:</h6>
                 {ele.photos.map((photo, i) => (
                 <img className="img-fluid mb-2" key={i} src={formatUrl(photo)} alt={`Photo ${i}`} />
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
                <div className="d-flex justify-content-between">
                                    <Button className="btn btn-dark" style={{ marginRight: '10px' }} as={Link} to={`/bloodbank/${ele._id}/blood-inventory-form`} variant="primary">Create Inventory</Button>
                                    <Button className="btn btn-dark" style={{ marginLeft: '10px' }} as={Link} to={`/bloodbank/${ele._id}/show-inventory`} variant="primary">Show Inventory</Button>
                </div>
                </Card.Body>
                </Card>
                </Col>
                </Row>
                </Container>
                <div>
                    <Button className="btn btn-dark"  as={Link} to={`/requests`} >Blood Requests</Button>
                </div>
            </div>
        }))}
                </>)
        
            }
            </div>
    )
}

