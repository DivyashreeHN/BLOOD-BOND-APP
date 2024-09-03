import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
import axios from "axios";
import BloodRequestContext from "../../contexts/bloodRequestContext";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import * as yup from 'yup';
import Swal from 'sweetalert2';

const userAddRequestValidationSchema = yup.object().shape({
    patientName: yup.string().required('Patient Name is required'),
    units: yup.number()
        .transform((value, originalValue) => {
            if (typeof originalValue !== 'string') return value;
            return originalValue.trim() === "" ? null : value;
        })
        .required('units is required')
        .positive('units must be a positive number'),
    blood: yup.object().shape({
        bloodType: yup.string().required('Blood Type is required'),
        bloodGroup: yup.string().required('Blood Group is required'),
    }),
    date: yup.date().required('Donation Date is required'),
    atendeePhNumber: yup.string().required('Attendee Phone Number is required'),
    critical: yup.string().required('Critical status is required'),
    requestType: yup.string().required('Request Type is required'),
    donationAddress: yup.object().shape({
        building: yup.string().required('Building number is required'),
        locality: yup.string().required('Locality is required'),
        city: yup.string().required('City is required'),
        state: yup.string().required('State is required'),
        pincode: yup.string().required('Pincode is required'),
        country: yup.string().required('Country is required'),
    })
});

const initialFormState = {
    patientName: "",
    blood: { 
        bloodType: "",
        bloodGroup: ""
    },
    units: "",
    date: "",
    atendeePhNumber: "",
    critical: "",
    donationAddress: {
        building: "",
        locality: "",
        city: "",
        state: "",
        pincode: "",
        country: ""
    },
    requestType: ""
};

const BloodRequestForm = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { bloodRequestData } = location.state || {};
    const { bloodRequests, bloodRequestDispatch } = useContext(BloodRequestContext);
    const [form, setForm] = useState(initialFormState);
    const [clearServerErrorsTimeout, setClearServerErrorsTimeout] = useState(null);

    useEffect(() => {
        if (bloodRequestData) {
            setForm({
                ...bloodRequestData,
                date: new Date(bloodRequestData.date).toISOString().split("T")[0],
                blood: {
                    bloodGroup: bloodRequestData.blood?.bloodGroup || "",
                    bloodType: bloodRequestData.blood?.bloodType || ""
                },
                requestType: bloodRequestData.requestType,
                donationAddress: {
                    building: bloodRequestData.donationAddress?.building || "",
                    locality: bloodRequestData.donationAddress?.locality || "",
                    city: bloodRequestData.donationAddress?.city || "",
                    state: bloodRequestData.donationAddress?.state || "",
                    pincode: bloodRequestData.donationAddress?.pincode || "",
                    country: bloodRequestData.donationAddress?.country || ""
                }
            });
        } else {
            setForm(initialFormState);
        }
    }, [bloodRequestData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const nameParts = name.split('.');

        if (nameParts.length === 2) {
            setForm((prevForm) => ({
                ...prevForm,
                [nameParts[0]]: {
                    ...prevForm[nameParts[0]],
                    [nameParts[1]]: value
                }
            }));
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                [name]: value
            }));
        }
    };

    const clearForm = () => {
        setForm(initialFormState);
        bloodRequestDispatch({ type: "SET_FORM_ERRORS", payload: {} });
         // Clear form errors
    };

    const clearServerErrors = () => {
        bloodRequestDispatch({ type: "SET_SERVER_ERRORS", payload: [] });
    };
    
    useEffect(() => {
        if (bloodRequests.serverErrors && bloodRequests.serverErrors.length > 0) {
            if (clearServerErrorsTimeout) {
                clearTimeout(clearServerErrorsTimeout);
            }
            const timeout = setTimeout(() => {
                clearServerErrors();
            }, 5000); // Adjust the timeout duration as needed
            setClearServerErrorsTimeout(timeout);
        }
    }, [bloodRequests.serverErrors]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formattedForm = {
                ...form,
                date: form.date && !isNaN(new Date(form.date)) ? new Date(form.date).toISOString().split('T')[0] : null,
                requestType: String(form.requestType)
            };

            console.log("Form before validation:", formattedForm);

            await userAddRequestValidationSchema.validate(formattedForm, { abortEarly: false });

            let response;
            if (bloodRequestData && bloodRequestData._id) {
                response = await axios.put(`http://localhost:3080/api/blood/request/${bloodRequestData._id}`, formattedForm, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    }
                });
                Swal.fire({
                    icon: 'success',
                    title: 'success',
                    text: 'Request edited succesfully',
                })
            } else {
                response = await axios.post('http://localhost:3080/api/blood/request', formattedForm, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    }
                });
                Swal.fire({
                    icon: 'success',
                    title: 'success',
                    text: 'Request added succesfully',
                })
            }

            const data = response.data;
            bloodRequestDispatch({ type: bloodRequestData && bloodRequestData._id ? "EDIT_USER_BLOOD_REQUEST" : "ADD_BLOOD_REQUEST", payload: data });
            clearForm();
            bloodRequestDispatch({type: "SET_SERVER_ERRORS",payload:[]})

        } catch (err) {
            console.error("Error during form submission:", err);
            if (err.name === 'ValidationError') {
                const errors = {};
                err.inner.forEach((e) => {
                    const keys = e.path.split('.');
                    if (keys.length === 2) {
                        if (!errors[keys[0]]) {
                            errors[keys[0]] = {};
                        }
                        errors[keys[0]][keys[1]] = e.message;
                    } else {
                        errors[e.path] = e.message;
                    }
                });
                console.log("Validation errors:", errors);
                bloodRequestDispatch({ type: "SET_FORM_ERRORS", payload: errors });
            } else {
                const errorMessage = err.response?.data?.message || 'An unexpected error occurred';
                console.error("Server Error:", errorMessage);
                bloodRequestDispatch({ type: 'SET_SERVER_ERRORS', payload: err.response.data.errors  });
                Swal.fire({ title: 'Error!', text: errorMessage, icon: 'error', confirmButtonText: 'OK' });
            }
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="bg-danger text-white">
                        <CardBody>
                            <CardTitle className="d-flex justify-content-center" style={{fontSize:'20px'}}>Blood Request Form</CardTitle>
                            <form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="patientName">Patient Name</label>
                                            <input type="text" value={form.patientName} onChange={handleChange} id="patientName" name="patientName" className="form-control" />
                                            {bloodRequests.formErrors.patientName && <div style={{color:'black'}}>{bloodRequests.formErrors.patientName}</div>}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="units">Units</label>
                                            <input type="number" value={form.units} onChange={handleChange} id="units" name="units" className="form-control" />
                                            {bloodRequests.formErrors.units && <div style={{color:'black'}}>{bloodRequests.formErrors.units}</div>}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="bloodType">Blood Type</label>
                                            <select value={form.blood.bloodType} onChange={handleChange} id="bloodType" name="blood.bloodType" className="form-select">
                                                <option value="">Select Blood Type</option>
                                                <option value="plasma">Plasma</option>
                                                <option value="platelet">Platelet</option>
                                                <option value="rbc">RBC</option>
                                            </select>
                                            {bloodRequests.formErrors.blood?.bloodType && <div style={{color:'black'}}>{bloodRequests.formErrors.blood.bloodType}</div>}
                                        </div>
                                    </Col>

                                    {/* Blood Group */}
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="bloodGroup">Blood Group</label>
                                            <select value={form.blood.bloodGroup} onChange={handleChange} id="bloodGroup" name="blood.bloodGroup" className="form-select">
                                                <option value="">Select Blood Group</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                            {bloodRequests.formErrors.blood?.bloodGroup && <div style={{color:'black'}}>{bloodRequests.formErrors.blood.bloodGroup}</div>}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="date">Donation Date</label>
                                            <input type="date" value={form.date} onChange={handleChange} id="date" name="date" className="form-control" />
                                            {bloodRequests.formErrors.date && <div style={{color:'black'}}>{bloodRequests.formErrors.date}</div>}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="atendeePhNumber">Attendee Phone Number</label>
                                            <input type="text" value={form.atendeePhNumber} onChange={handleChange} id="atendeePhNumber" name="atendeePhNumber" className="form-control" />
                                            {bloodRequests.formErrors.atendeePhNumber && <div style={{color:'black'}}>{bloodRequests.formErrors.atendeePhNumber}</div>}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="critical">Critical</label>
                                            <select value={form.critical} onChange={handleChange} id="critical" name="critical" className="form-select">
                                                <option value="">Select Critical</option>
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>
                                            {bloodRequests.formErrors.critical && <div style={{color:'black'}}>{bloodRequests.formErrors.critical}</div>}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="requestType">Request Type</label>
                                            <select value={form.requestType} onChange={handleChange} id="requestType" name="requestType" className="form-select">
                                                <option value="">Select Request Type</option>
                                                <option value="user">User</option>
                                                <option value="bloodbank">Blood Bank</option>
                                                <option value="both">Both</option>
                                            </select>
                                            {bloodRequests.formErrors.requestType && <div style={{color:'black'}}>{bloodRequests.formErrors.requestType}</div>}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="building">Building Number</label>
                                            <input type="text" value={form.donationAddress.building} onChange={handleChange} id="building" name="donationAddress.building" className="form-control" />
                                            {bloodRequests.formErrors.donationAddress?.building && <div style={{color:'black'}}>{bloodRequests.formErrors.donationAddress.building}</div>}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="locality">Locality</label>
                                            <input type="text" value={form.donationAddress.locality} onChange={handleChange} id="locality" name="donationAddress.locality" className="form-control" />
                                            {bloodRequests.formErrors.donationAddress?.locality && <div style={{color:'black'}}>{bloodRequests.formErrors.donationAddress.locality}</div>}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="city">City</label>
                                            <input type="text" value={form.donationAddress.city} onChange={handleChange} id="city" name="donationAddress.city" className="form-control" />
                                            {bloodRequests.formErrors.donationAddress?.city && <div style={{color:'black'}}>{bloodRequests.formErrors.donationAddress.city}</div>}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="state">State</label>
                                            <input type="text" value={form.donationAddress.state} onChange={handleChange} id="state" name="donationAddress.state" className="form-control" />
                                            {bloodRequests.formErrors.donationAddress?.state && <div style={{color:'black'}}>{bloodRequests.formErrors.donationAddress.state}</div>}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="pincode">Pincode</label>
                                            <input type="text" value={form.donationAddress.pincode} onChange={handleChange} id="pincode" name="donationAddress.pincode" className="form-control" />
                                            {bloodRequests.formErrors.donationAddress?.pincode && <div style={{color:'black'}}>{bloodRequests.formErrors.donationAddress.pincode}</div>}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="country">Country</label>
                                            <input type="text" value={form.donationAddress.country} onChange={handleChange} id="country" name="donationAddress.country" className="form-control" />
                                            {bloodRequests.formErrors.donationAddress?.country && <div style={{color:'black'}}>{bloodRequests.formErrors.donationAddress.country}</div>}
                                        </div>
                                    </Col>
                                </Row>

                                <Button type="submit" className="btn btn-dark" style={{marginLeft:'310px',marginTop:'10px'}}>Submit</Button>
                            </form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            {bloodRequests.serverErrors && bloodRequests.serverErrors.length > 0 && (
    <div className="mb-3">
        <h5 style={{ color: 'black' }}>Server Errors:</h5>
        <ul>
            {bloodRequests.serverErrors.map((error, index) => (
                <li key={index}>{error.msg}</li>
            ))}
        </ul>
    </div>
)}
        </Container>
    );
}
export default BloodRequestForm;
