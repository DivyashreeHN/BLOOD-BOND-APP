import React, { useState, useEffect, useContext } from "react";
import { Row, Col } from "reactstrap";
import axios from "axios";
import BloodRequestContext from "../../contexts/bloodRequestContext";
import { useDispatch } from "react-redux";

export default function BloodRequestForm({ formTitle, bloodRequestData }) {
    const dispatch = useDispatch();
    const { bloodRequests, bloodRequestDispatch } = useContext(BloodRequestContext);

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

    const [form, setForm] = useState(initialFormState);

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
        setForm((prevForm) => ({
            ...prevForm,
            blood: {
                ...prevForm.blood,
                [name]: value
            }
        }));
    };

    const clearForm = () => {
        setForm(initialFormState);
    };

    useEffect(() => {
        if (bloodRequestData) {
            setForm({
                ...bloodRequestData,
                date: new Date(bloodRequestData.date).toISOString().split("T")[0],
                blood: {
                    bloodGroup: bloodRequestData.blood?.bloodGroup || "",
                    bloodType: bloodRequestData.blood?.bloodType || ""
                },
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
            clearForm();
        }
    }, [bloodRequestData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('form', form);
        try {
            const formattedForm = {
                ...form,
                date: new Date(form.date).toISOString().split('T')[0],
            };
            if (bloodRequestData && bloodRequestData._id) {
                const response = await axios.put(`http://localhost:3080/api/blood/request/${bloodRequestData._id}`, form, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    }
                });
    
                const data = response.data;
                console.log('blood request edited data', data); // Log the response data if needed
    
                bloodRequestDispatch({ type: "EDIT_USER_BLOOD_REQUEST", payload: data });
                clearForm();
            } else {
                const response = await axios.post('http://localhost:3080/api/blood/request', form, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    }
                });
    
                const data = response.data;
                console.log('blood request data', data); // Log the response data if needed
    
                bloodRequestDispatch({ type: "ADD_BLOOD_REQUEST", payload: data });
                clearForm();
            }
        } catch (error) {
            console.error('Error in submitting form:', error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
            <Row>

{/* patientName */}
 
<Col md={6}>
            <div className="form-group">
            <label className="form-label" htmlFor="patientName">
            patientName
            </label>
            <input type="text" value={form.patientName} onChange={handleChange}
            id="patientName"
            name="patientName"
            className="form-control"/>
           </div>
</Col>
 
{/* units */}

<Col md={6}>
    <div className="form-group">
        <label className="form-label" htmlFor="units">units</label>
        <input type="number" value={form.units} onChange={handleChange}
        id="units"
        name="units"
        className="form-control"/>
    </div>
</Col>


 {/* blood >>>here i want to fetch (type and group) in available from bloodinventory*/}

 <label style={{textAlign:'left'}}>blood</label>
                    <Col md={6}>
                        <div className="form-group">
                            <label className='form-label' htmlFor='bloodType'>Blood Type</label>
                            <select value={form.blood&&form.blood.bloodType}
                                onChange={handleChange}
                                id='bloodType'
                                name='blood.bloodType'
                                className='form-select'>
                                <option value="">Select Blood Type</option>
                                <option value="plasma">Plasma</option>
                                <option value="platelet">Platelet</option>
                                <option value="rbc">RBC</option>
                            </select>
                        </div>
                    </Col>

                    <Col md={6}>
                        <div className='form-group'>
                            <label className='form-label' htmlFor='bloodGroup'>Blood Group</label>
                            <select value={form.blood&&form.blood.bloodGroup} 
    onChange={handleChange} 
    id='bloodGroup' 
    name='blood.bloodGroup' 
    className='form-select'
>
    <option value=" ">Select Blood Group</option>
    <option value="A+">A+</option>
    <option value="A-">A-</option>
    <option value="AB+">AB+</option>
    <option value="AB-">AB-</option>
    <option value="O+">O+</option>
    <option value="O-">O-</option>
</select>

                        </div>
                    </Col>

{/* date */}

<Col md={6}>
    <div className="form-group">
        <label className="form-label" htmlFor="date">date</label>
        <input type="date" value={form.date} onChange={handleChange}
        id="date"
        name="date"
        className="form-control"/>
    </div>
</Col>

{/* atendeePhNumber*/}

<Col md={6}>    
        <div className="form-group">
            <label className="form-label" htmlFor="atendeePhNumber">atendeePhNumber</label>
            <input type="text"
            value={form.atendeePhNumber}
            onChange={handleChange}
            id="atendeePhNumber"
            name="atendeePhNumber"
            className="form-control"/>
        </div>
</Col>

{/* critical */}

<Col md={6}>
    <div className="form-group">
        <label style={{ textAlign: "left" }}>critical</label><br />
        <input type="radio" 
        value="yes" 
        checked={form.critical === "yes"} 
        onChange={handleRadioChange} 
        id="yes" 
        name="critical" />
        <label htmlFor="yes">yes</label>{" "}

        <input type="radio" 
        value="no" 
        checked={form.critical === "no"} 
        onChange={handleRadioChange} 
        id="no" name="critical" />
        <label htmlFor="no">no</label>
    </div>
</Col>

{/* requestType */}

<Col md={6}>
                <div className="form-group">
                    <label className='form-label' htmlFor='requestType'>requestType</label>
                    <select value={form.requestType}
                            onChange={handleChange}
                            id='requestType'
                            name='requestType'
                            className='form-select'>
                                <option value="">Select requestType</option>
                                <option value="user">User</option>
                                <option value="bloodbank">BloodBank</option>
                                <option value="both">Both</option>
                            </select>
                            </div>
</Col>



{/* building no */}

<Col md={6}>
             <div className="form-group">
                <label className="form-label" htmlFor="building">Building No</label>
                <input type="text"
                value={form.donationAddress&& form.donationAddress.building}
                onChange={handleChange}
                id="building"
                name="donationAddress.building"
                className="form-control"/>   
             </div>
</Col>

{/* 8) locality */}

<Col md={6}>
        <div className="form-group">
            <label className="form-label" htmlFor="locality">locality</label>
            <input type="text"
            value={form.donationAddress && form.donationAddress.locality}
            onChange={handleChange}
            id="locality"
            name="donationAddress.locality"
            className="form-control"/>
        </div>
</Col>

{/* 9) city */}

<Col md={6}>
        <div className="form-group">
            <label className="form-label" htmlFor="city">City</label>
            <input type="text"
            value={form.donationAddress && form.donationAddress.city}
            onChange={handleChange}
            id="city"
            name="donationAddress.city"
            className="form-control"/>
        </div>
</Col>

{/* 10) state */}

<Col md={6}>
        <div className="form-group">
            <label className="form-label" htmlFor="state">State</label>
            <input type="text"
            value={form.donationAddress &&form.donationAddress.state}
            onChange={handleChange}
            id="state"
            name="donationAddress.state"
            className="form-control"/>
        </div>
</Col>

{/* 11) pincode */}

<Col md={6}>
        <div className="form-group">
            <label className="form-label" htmlFor="pincode">Pincode</label>
            <input type="text"
            value={form.donationAddress &&form.donationAddress.pincode}
            onChange={handleChange}
            id="pincode"
            name="donationAddress.pincode"
            className="form-control"/>
        </div>
</Col>

{/* 12) country */}

<Col md={6}>
        <div className="form-group">
            <label className="form-label" htmlFor="country">country</label>
            <input type="text"
            value={form.donationAddress &&form.donationAddress.country}
            onChange={handleChange}
            id="country"
            name="donationAddress.country"
            className="form-control"/>
        </div>
</Col><br></br>
                </Row>
                <Col md={12}>
                <input type="submit"/>
                </Col>
            </form>
        </>
    );

}




