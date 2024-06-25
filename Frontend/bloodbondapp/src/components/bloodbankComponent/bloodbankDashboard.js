import BloodBankForm from "./bloodbankForm";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { startFetchingBloodBank } from "../../actions/bloodbankActions";
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';

export default function BloodBankDashboard() {
    const [showForm, setShowForm] = useState(false);
    const dispatch = useDispatch();
    const bloodBank = useSelector((state) => state.bloodbanks.bloodbank);

    useEffect(() => {
        dispatch(startFetchingBloodBank());
    }, [dispatch]);

    const handleClick = () => {
        setShowForm(!showForm);
    };

    const formatUrl = (path) => {
        // Replace backslashes with forward slashes
        const formattedPath = path.replace(/\\/g, '/');
        // Prefix with base URL
        return `http://localhost:3080/${formattedPath}`;
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <h3 className="text-center mb-4">Blood Bank Dashboard</h3>
                    {showForm ? (
                        <BloodBankForm />
                    ) : (
                        <>
                            {bloodBank?.length === 0 ? (
                                <div className="text-center">
                                    <Button className='bg-danger text-white' onClick={handleClick}>Add BloodBank</Button>
                                </div>
                            ) : (
                                bloodBank.map((ele, index) => (
                                    <Card key={index} className="bg-danger text-white mb-4" style={{ maxWidth: '400px', margin: 'auto' }}>
                                        <Card.Body>
                                            <Card.Title>{ele.name}</Card.Title>
                                            <Card.Text>
                                                {ele.license && (
                                                    <div>
                                                        <h6>License:</h6>
                                                        <img
                                                            className="d-block w-100"
                                                            src={formatUrl(ele.license[0])}
                                                            alt="License"
                                                            style={{ maxWidth: '100%', maxHeight: '200px' }}
                                                        />
                                                    </div>
                                                )}
                                                {ele.photos && (
                                                    <div>
                                                        <h6>Photos:</h6>
                                                        <Carousel>
                                                            {ele.photos.map((photo, i) => (
                                                                <Carousel.Item key={i}>
                                                                    <img
                                                                        className="d-block w-100"
                                                                        src={formatUrl(photo)}
                                                                        alt={`Photo ${i}`}
                                                                        style={{ maxHeight: '200px' }}
                                                                    />
                                                                </Carousel.Item>
                                                            ))}
                                                        </Carousel>
                                                    </div>
                                                )}
                                                <h6>Contact number:</h6>
                                                <p>{ele.phoneNumber}</p>
                                                <h6>Address:</h6>
                                                <p>{`${ele.address.building}, ${ele.address.locality}, ${ele.address.city}, ${ele.address.pincode}, ${ele.address.state}, ${ele.address.country}`}</p>
                                                <h6>Opening Hours:</h6>
                                                <p>{`${ele.openingHours.opensAt.hour}:${ele.openingHours.opensAt.minutes}:${ele.openingHours.opensAt.period} - ${ele.openingHours.closesAt.hour}:${ele.openingHours.closesAt.minutes}:${ele.openingHours.closesAt.period}`}</p>
                                                <h6>Services:</h6>
                                                {ele.services.map((service, i) => (
                                                    <p key={i}>{service}</p>
                                                ))}
                                            </Card.Text>
                                            <div className="d-flex justify-content-between">
                                                <Button className="btn btn-dark" as={Link} to={`/bloodbank/${ele._id}/blood-inventory-form`} variant="primary">Create Inventory</Button>
                                                <Button className="btn btn-dark" as={Link} to={`/bloodbank/${ele._id}/show-inventory`} variant="primary">Show Inventory</Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
