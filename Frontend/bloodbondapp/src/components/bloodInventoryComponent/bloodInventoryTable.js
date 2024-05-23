import { useParams } from "react-router-dom"
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useEffect,useState } from "react"
import { useContext } from "react"
import { PencilSquare, Trash } from 'react-bootstrap-icons'
import { Container,Row,Col,Card, Button } from "react-bootstrap"
import BloodInventoryContext from "../../contexts/bloodInventoryContext"
import BloodInventoryForm from "./bloodInventoryForm";
import axios from 'axios'
export default function BloodInventoryTable(){
const {bloodInventory,bloodInventoryDispatch}=useContext(BloodInventoryContext)
const {id}=useParams()
const [editBlood,setEditBlood]=useState('')
const [modal,setModal]=useState(false)
useEffect(()=>{
(async()=>{
const response=await axios.get(`http://localhost:3080/api/bloodinventries/${id}`,{
    headers:{
        Authorization:localStorage.getItem('token')
    }
})
bloodInventoryDispatch({type:'LIST_BLOODINVENTORY', payload:response.data})
})();
},[bloodInventoryDispatch,id])
const toggle=()=>{
    setModal(!modal)
}
const handleDelete=async(id)=>{
try{
const response=await axios.delete(`http://localhost:3080/api/bloodinventries/${id}`,{
    headers:{
        Authorization:localStorage.getItem('token')
    }
})
bloodInventoryDispatch({type:'REMOVE_BLOOD',payload:response.data})
}catch(err){
bloodInventoryDispatch({type:'SET_SERVER_ERRORS',payload:err.response.data.errors})
}
}

    return(
        <div>
            <Container>
            <h4 className="my-6">Blood Inventory</h4>
            <Row>
                {bloodInventory.bloodInventoryDetails.length>0?(bloodInventory.bloodInventoryDetails.map((Blood)=>{
                    return <Col md={6} className="mb-4" key={Blood._id}>
                    <Card className="bg-danger text-white">
                        <Card.Body>
                            <Card.Title>Blood Group:{Blood.blood.bloodGroup}</Card.Title>
                            <Card.Text>
                                <strong>Blood Type:</strong>{Blood.blood.bloodType}<br/>
                                <strong>Units:</strong>{Blood.units}<br/>
                                <strong>Donation Date:</strong>{new Date(Blood.donationDate).toLocaleDateString()}<br/>
                                <strong>Expiry Date:</strong>{new Date(Blood.expiryDate).toLocaleDateString()}<br/>
                                <strong>Status:</strong>{Blood.status}
                            </Card.Text>
                            <div>
                            <Button className='btn btn-light' style={{ marginRight: '10px' }} onClick={()=>{
                                setEditBlood(Blood)
                                toggle()}
                                }><PencilSquare/>Edit</Button>
                            <Button className='btn btn-light' style={{ marginLeft: '10px' }} onClick={()=>{handleDelete(Blood._id)}}><Trash/>Delete</Button>
                            </div>
                        </Card.Body>
                    </Card>
                    </Col>
                })):(<Col>
                <p>No blood found in inventory</p>
                </Col>)}
            </Row>
            </Container>
            <Modal isOpen={modal} toggle={toggle} >
        <ModalHeader toggle={toggle}>BloodInventory</ModalHeader>
        <ModalBody>
          <BloodInventoryForm editBlood={editBlood} toggle={toggle}/>
        </ModalBody>
        <ModalFooter>
          <Button className="bg-danger text-white" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
        </div>
    )
}