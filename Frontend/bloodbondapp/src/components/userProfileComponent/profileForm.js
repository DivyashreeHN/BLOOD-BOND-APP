import { useDispatch } from 'react-redux';
import { useState, useEffect } from "react";
import { Row, Col, Container, Card, CardBody, CardTitle } from "reactstrap";
import { startAddProfile, startEditingUserProfile } from '../../actions/userprofileActions';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ProfileForm() {
    const location = useLocation();
    const { profileData } = location.state || {};
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        phNo: '',
        blood: {
            
            bloodGroup: ''
        },
        lastBloodDonationDate: '',
        address: {
            building: '',
            locality: '',
            city: '',
            state: '',
            pincode: '',
            country: ''
        },
        geolocation: {
            type: '',
            coordinates: []
        },
        weight: '',
        testedPositiveForHiv: '',
        tattoBodyPiercing: ''
    });

    useEffect(() => {
        if (profileData) {
            setForm({
                ...profileData,
                dob: new Date(profileData.dob).toISOString().split('T')[0],
                lastBloodDonationDate: new Date(profileData.lastBloodDonationDate).toISOString().split('T')[0],
                blood: {
                    bloodGroup: profileData.blood.bloodGroup,
                    
                },
                address: {
                    building: profileData.address?.building || '',
                    locality: profileData.address?.locality || '',
                    city: profileData.address?.city || '',
                    state: profileData.address?.state || '',
                    pincode: profileData.address?.pincode || '',
                    country: profileData.address?.country || ''
                }
            });
        }
    }, [profileData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');

        if (keys.length === 2) {
            setForm((prevForm) => ({
                ...prevForm,
                [keys[0]]: {
                    ...prevForm[keys[0]],
                    [keys[1]]: value,
                },
            }));
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                [name]: value,
            }));
        }
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const clearForm = () => {
        setForm({
            firstName: '',
            lastName: '',
            dob: '',
            gender: '',
            phNo: '',
            blood: {
               
                bloodGroup: ''
            },
            lastBloodDonationDate: '',
            address: {
                building: '',
                locality: '',
                city: '',
                state: '',
                pincode: '',
                country: ''
            },
            geolocation: {
                type: '',
                coordinates: []
            },
            weight: '',
            testedPositiveForHiv: '',
            tattoBodyPiercing: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formattedForm = {
                ...form,
                dob: new Date(form.dob).toISOString().split('T')[0],
                lastBloodDonationDate: new Date(form.lastBloodDonationDate).toISOString().split('T')[0]
            };

            if (profileData) {
                dispatch(startEditingUserProfile(profileData._id, formattedForm, clearForm));
            } else {
                dispatch(startAddProfile(formattedForm, clearForm));
            }

            navigate('/user/dashboard');
        } catch (err) {
            console.log(err, 'error in submitting form');
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="bg-danger text-white">
                        <CardBody>
                            <CardTitle>Profile Form</CardTitle>
                            <form onSubmit={handleSubmit}>
                                <Row>
                                    {/* 1) firstName */}
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="firstName">
                                                First Name
                                            </label>
                                            <input type="text" value={form.firstName} onChange={handleChange}
                                                id="firstName"
                                                name="firstName"
                                                className="form-control" />
                                        </div>
                                    </Col>

                                    {/* 2) lastName */}
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="lastName">
                                                Last Name
                                            </label>
                                            <input type="text" value={form.lastName} onChange={handleChange}
                                                id="lastName"
                                                name="lastName"
                                                className="form-control" />
                                        </div>
                                    </Col>

                                    {/* 3) dob */}
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="dob">Date of Birth</label>
                                            <input type="date" value={form.dob} onChange={handleChange}
                                                id="dob"
                                                name="dob"
                                                className="form-control" />
                                        </div>
                                    </Col>

                                    {/* 4) lastBloodDonationDate */}
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="lastBloodDonationDate">Last Blood Donation Date</label>
                                            <input type="date" value={form.lastBloodDonationDate} onChange={handleChange}
                                                id="lastBloodDonationDate"
                                                name="lastBloodDonationDate"
                                                className="form-control" />
                                        </div>
                                    </Col>

                                    {/* 5) weight */}
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="weight">Weight</label>
                                            <input type="number" value={form.weight} onChange={handleChange}
                                                id="weight"
                                                name="weight"
                                                className="form-control" />
                                        </div>
                                    </Col>

                                    {/* 6) phNo */}
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="phNo">Phone Number</label>
                                            <input type="text"
                                                value={form.phNo}
                                                onChange={handleChange}
                                                id="phNo"
                                                name="phNo"
                                                className="form-control" />
                                        </div>
                                    </Col>

                                    {/* 7) building */}
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="building">Building No</label>
                                            <input type="text"
                                                value={form.address?.building}
                                                onChange={handleChange}
                                                id="building"
                                                name="address.building"
                                                className="form-control" />
                                        </div>
                                    </Col>

                                    {/* 8) locality */}
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="locality">Locality</label>
                                            <input type="text"
                                                value={form.address?.locality}
                                                onChange={handleChange}
                                                id="locality"
                                                name="address.locality"
                                                className="form-control" />
                                        </div>
                                    </Col>

                                    {/* 9) city */}
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="city">City</label>
                                            <input type="text"
                                                value={form.address?.city}
                                                onChange={handleChange}
                                                id="city"
                                                name="address.city"
                                                className="form-control" />
                                        </div>
                                    </Col>

                                    {/* 10) state */}
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="state">State</label>
                                            <input type="text"
                                                value={form.address?.state}
                                                onChange={handleChange}
                                                id="state"
                                                name="address.state"
                                                className="form-control" />
                                        </div>
                                    </Col>

                                    {/* 11) pincode */}
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="pincode">Pincode</label>
                                            <input type="text"
                                                value={form.address?.pincode}
                                                onChange={handleChange}
                                                id="pincode"
                                                name="address.pincode"
                                                className="form-control" />
                                        </div>
                                    </Col>

                                    {/* 12) country */}
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="country">Country</label>
                                            <input type="text"
                                                value={form.address?.country}
                                                onChange={handleChange}
                                                id="country"
                                                name="address.country"
                                                className="form-control" />
                                        </div>
                                    </Col>

                                    
                                    {/* 13) blood */}
                                    <label style={{ textAlign: 'left' }}>Blood</label>
                                    

                                    <Col md={6}>
                                        <div className='form-group'>
                                            <label className='form-label' htmlFor='bloodGroup'>Blood Group</label>
                                            <select value={form.blood?.bloodGroup}
                                                onChange={handleChange}
                                                id='bloodGroup'
                                                name='blood.bloodGroup'
                                                className='form-select'>
                                                <option value="">Select Blood Group</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        </div>
                                    </Col>
{/* 14) gender */}
<Col md={6}>
                                        <div className="form-group">
                                            <label style={{ textAlign: "left" }}>Gender</label><br />
                                            <input type="radio"
                                                value="male"
                                                checked={form.gender === "male"}
                                                onChange={handleRadioChange}
                                                id="male"
                                                name="gender" />
                                            <label htmlFor="male">Male</label>{" "}

                                            <input type="radio"
                                                value="female"
                                                checked={form.gender === "female"}
                                                onChange={handleRadioChange}
                                                id="female" name="gender" />
                                            <label htmlFor="female">Female</label>
                                        </div>
                                    </Col>

                                    {/* 15) tattoBodyPiercing */}
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label style={{ textAlign: "left" }}>Tattoo/Body Piercing in Last Six Month</label><br />
                                            <input type="radio"
                                                value="yes"
                                                checked={form.tattoBodyPiercing === "yes"}
                                                onChange={handleRadioChange}
                                                id="yes"
                                                name="tattoBodyPiercing" />
                                            <label htmlFor="yes">Yes</label>{" "}

                                            <input type="radio"
                                                value="no"
                                                checked={form.tattoBodyPiercing === "no"}
                                                onChange={handleRadioChange}
                                                id="no" name="tattoBodyPiercing" />
                                            <label htmlFor="no">No</label>
                                        </div>
                                    </Col>

                  {/* 16) testedPositiveForHiv */}
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label style={{ textAlign: "left" }}>Tested Positive for HIV</label><br />
                                            <input type="radio"
                                                value="yes"
                                                checked={form.testedPositiveForHiv === "yes"}
                                                onChange={handleRadioChange}
                                                id="yes"
                                                name="testedPositiveForHiv" />
                                            <label htmlFor="yes">Yes</label>{" "}

                                            <input type="radio"
                                                value="no"
                                                checked={form.testedPositiveForHiv === "no"}
                                                onChange={handleRadioChange}
                                                id="no" name="testedPositiveForHiv" />
                                            <label htmlFor="no">No</label>
                                        </div>
                                    </Col>

                                    {/* submit button */}
                                    <Col md={12}>
                                        <input type="submit" className="btn btn-primary mt-3" />
                                    </Col>
                                </Row>
                            </form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
