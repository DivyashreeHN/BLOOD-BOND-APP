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
const [filters,setFilters]=useState({
    bloodGroup:'',
    bloodType:'',
    status:'',
    expiryDate:''
})
const [modal,setModal]=useState(false)
const [page,setPage]=useState(1)
const [totalPages,setTotalPages]=useState(1)
useEffect(()=>{
fetchBloodInventory();
},[bloodInventoryDispatch,id])
const fetchBloodInventory=async()=>{
    try{
        const response=await axios.get(`http://localhost:3080/api/bloodinventries/${id}`,{
             params: {...filters,page,limit:10} ,
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
        const { bloods, totalBloods, totalPages, currentPage } = response.data;
        bloodInventoryDispatch({type:'LIST_BLOODINVENTORY', payload:bloods})
        bloodInventoryDispatch({type:'SET_SERVER_ERRORS', payload:[]})
        setTotalPages(totalPages); 
        setFilters({
            bloodGroup:'',
            bloodType:'',
            status:'',
            expiryDate:''
        })
    }catch(err){
        if (err.response && err.response.status === 401) {
            // Handle unauthorized access, e.g., redirect to login
            alert('Session expired. Please log in again.');
            // Redirect to login or re-authenticate
        } else {
            bloodInventoryDispatch({
                type: 'SET_SERVER_ERRORS',
                payload: err.response?.data?.errors || ['An error occurred while processing your request.']
            });
        }
    }
}
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
            <h4 className="text-center" >Blood Inventory</h4>
            <Row>
                <Col>
                <select value={filters.bloodGroup}
                onChange={(e)=>setFilters({...filters,bloodGroup:e.target.value})}>
                    <option>select bloodGroup</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                </select>
                </Col>
                <Col>
                <select value={filters.bloodType}
                onChange={(e)=>setFilters({...filters,bloodType:e.target.value})}>
                    <option>select bloodType</option>
                    <option value="RBC">RBC</option>
                    <option value="platelets">platelets</option>
                    <option value="plasma">plasma</option>
                    <option value="wholeBlood">wholeBlood</option>
                </select>
                </Col>
                <Col md={3}>
                        <input 
                            type="text" 
                            placeholder="Status" 
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        />
                    </Col>
                    <Col md={3}>
                        <input 
                            type="date" 
                            placeholder="Expiry Date" 
                            value={filters.expiryDate}
                            onChange={(e) => setFilters({ ...filters, expiryDate: e.target.value })}
                            className="form-control"
                        />
                    </Col>
                    <Col md={2}>
                        <Button onClick={fetchBloodInventory} className="btn btn-dark">Filter</Button>
                    </Col>

                </Row>
            <Row className="justify-content-center">
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
                <div className="d-flex justify-content-center btn btn-danger" style={{marginTop:'50px',width:'250px',marginLeft:'400px'}}>
                    No blood found in inventory
                </div>
                </Col>)}
            </Row>
            {bloodInventory.bloodInventoryDetails.length>0 && (
                <Row>
                <Col className="d-flex justify-content-center">
                    <Button disabled={page === 1} onClick={() => setPage(page - 1)} className="btn btn-danger">Previous</Button>
                    <span style={{ margin: '0 10px' }}>Page {page} of {totalPages}</span>
                    <Button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="btn btn-danger">Next</Button>
                </Col>
            </Row>
            )}
            
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