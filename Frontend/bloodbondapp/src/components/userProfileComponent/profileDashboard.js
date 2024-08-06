import React, { useEffect,useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { startFetchingUserProfile } from '../../actions/userprofileActions'
import { startFetchingBloodBanksForUsers } from '../../actions/bloodbankActions'
import { Card, Col, Row, Carousel,Modal,Button } from 'react-bootstrap'
import { FaEye } from 'react-icons/fa'
import { BiMap } from 'react-icons/bi'

export default function ProfileDashboard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const singlePro = useSelector((state) => state.profiles.singleProfile)
    const bloodbanks = useSelector((state) => state.bloodbanks.usersBloodbank)
    const [showLicense, setShowLicense] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState(null);
    
    useEffect(() => {
        dispatch(startFetchingUserProfile());
        dispatch(startFetchingBloodBanksForUsers());
    }, [dispatch]);

    const handleAddProfile = () => {
        navigate("/add/profile")
    }

    const handleViewProfile = (profile) => {
        navigate(`/profile/${profile._id}`, { state: { profile } });
    }

    const formatUrl = (path) => {
        // Replace backslashes with forward slashes
        const formattedPath = path.replace(/\\/g, '/');
        // Prefix with base URL
        return `http://localhost:3080/${formattedPath}`;
    };
    const handleViewLicense = (license) => {
        setSelectedLicense(license);
        setShowLicense(true);
    };

    const handleCloseLicense = () => {
        setShowLicense(false);
        setSelectedLicense(null);
    }
    const cardStyle = {
        height: '250px', // Set a fixed height for the card
        justifyContent:'center',
        display:'flex'
    };

    const imageContainerStyle = {
        height: '250px', // Fill the card height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    };

    const imageStyle = {
        height: '100%', // Fill the container height
        objectFit: 'cover', // Maintain aspect ratio and cover the container
    };

    const iconContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            {singlePro?.length === 0 ? (
                <div>
                    <button className='btn btn-primary' onClick={handleAddProfile}>Add Profile</button>
                </div>
            ) : (
                <>
                    {bloodbanks?.length < 1 ? (
                        <h1>OOPS! No blood bank found in your city</h1>
                    ) : (
                        <Row>
                            <div style={{justifyContent:'center', display:'flex',color:'red'}}>
                            <h1>{bloodbanks?.length} bloodbank found in {bloodbanks?.map((bloodbank)=>(bloodbank.address.city))}</h1>
                            </div>

                            {bloodbanks?.map((bloodbank) => (
                                <Col key={bloodbank._id} sm={12} md={10} lg={6}>
                                    <Card className="mb-4" style={cardStyle}>
                                        <Row noGutters>
                                            <Col md={4} style={imageContainerStyle}>
                                                <Carousel>
                                                    {bloodbank.photos.map((photo, i) => (
                                                        <Carousel.Item key={i}>
                                                            <img
                                                                className="d-block w-100"
                                                                src={formatUrl(photo)}
                                                                alt={`Photo ${i}`}
                                                                style={imageStyle}
                                                            />
                                                        </Carousel.Item>
                                                    ))}
                                                </Carousel>
                                            </Col>
                                            <Col md={8}>
                                                <Card.Body>
                                                    <Card.Title>{bloodbank.name}</Card.Title>
                                                    <Card.Text>
                                                        <strong>Address:</strong> {`${bloodbank.address.building}, ${bloodbank.address.locality}, ${bloodbank.address.city}, ${bloodbank.address.state}, ${bloodbank.address.pincode}`}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        <strong>Phone Number:</strong> {bloodbank.phoneNumber}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        <strong>Services:</strong> {bloodbank.services.join(', ')}
                                                    </Card.Text>
                                                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                        <div style={iconContainerStyle} onClick={() => handleViewLicense(bloodbank.license)}>
                                                            <FaEye size={24} />
                                                            <span>View License</span>
                                                        </div>
                                                        <Link to={`/map/${bloodbank.geoLocation.coordinates[1]}/${bloodbank.geoLocation.coordinates[0]}/${encodeURIComponent(`${bloodbank.address.building}, ${bloodbank.address.locality}, ${bloodbank.address.city}, ${bloodbank.address.state}, ${bloodbank.address.pincode}, ${bloodbank.address.country}`)}`}>
                                                            <div style={iconContainerStyle}>
                                                                <BiMap size={24} />
                                                                <span>Location</span>
                                                            </div>
                                                        </Link>

                                                    </div>


                                                </Card.Body>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </>
            )}
            <Modal show={showLicense} onHide={handleCloseLicense}>
                <Modal.Header closeButton>
                    <Modal.Title>License</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedLicense && selectedLicense.map((license, i) => (
                        <img key={i} src={formatUrl(license)} alt={`License ${i}`} style={{ width: '100%' }} />
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLicense}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
