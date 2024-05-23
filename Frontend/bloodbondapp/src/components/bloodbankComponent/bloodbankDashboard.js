import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { startFetchingBloodBank } from '../../actions/bloodbankActions';
import BloodBankForm from './bloodbankForm';

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
    return `http://localhost:3080/${path.replace(/\\/g, '/')}`;
  };

  return (
    <div className="row">
      <h3>BloodBankDashboard</h3>
      {showForm ? (
        <div className="col-md-6">
          <BloodBankForm />
        </div>
      ) : (
        <>
          {bloodBank.length === 0 ? (
            <div>
              <button className="bg-danger text-white" onClick={handleClick}>Add BloodBank</button>
            </div>
          ) : (
            bloodBank.map((ele, index) => (
              <div key={index}>
                <Container>
                  <Row className="justify-content-center">
                    <Col md={6}>
                      <Card className="bg-danger text-white">
                        <Card.Body>
                          <Card.Title>{ele.name}</Card.Title>
                          <Card.Text>
                            {ele.license && (
                              <div>
                                <h6>License:</h6>
                                <img className="img-fluid" src={formatUrl(ele.license[0])} alt="License" />
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
                            <h6>Address:</h6><p>{`${ele.address.building}, ${ele.address.locality}, ${ele.address.city}, ${ele.address.pincode}, ${ele.address.state}, ${ele.address.country}`}</p>
                            <h6>Opening Hours:</h6><p>{`${ele.openingHours.opensAt.hour}:${ele.openingHours.opensAt.minutes} ${ele.openingHours.opensAt.period} - ${ele.openingHours.closesAt.hour}:${ele.openingHours.closesAt.minutes} ${ele.openingHours.closesAt.period}`}</p>
                            <h6>Services:</h6>{ele.services.map((service, i) => <p key={i}>{service}</p>)}
                          </Card.Text>
                          <div className="d-flex justify-content-between">
                            <Button className="btn btn-light" style={{ marginRight: '10px' }} as={Link} to={`/bloodbank/${ele._id}/blood-inventory-form`} variant="primary">Create Inventory</Button>
                            <Button className="btn btn-light" style={{ marginLeft: '10px' }} as={Link} to={`/bloodbank/${ele._id}/show-inventory`} variant="primary">Show Inventory</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
