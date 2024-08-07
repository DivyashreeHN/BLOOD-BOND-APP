import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import * as Yup from 'yup';
import BloodInventoryContext from '../../contexts/bloodInventoryContext';

export default function BloodInventoryForm({ editBlood, toggle }) {
    const { id } = useParams();
    const { bloodInventory, bloodInventoryDispatch } = useContext(BloodInventoryContext);

    const [form, setForm] = useState({
        blood: {
            bloodType: '',
            bloodGroup: ''
        },
        units: '',
        donationDate: '',
        status: ''
    });

    const validationSchema = Yup.object().shape({
        blood: Yup.object().shape({
            bloodType: Yup.string().required('Blood Type is required'),
            bloodGroup: Yup.string().required('Blood Group is required')
        }),
        
        units: Yup.number()
        .transform((value, originalValue) => {
            
            if (typeof originalValue !== 'string') return value;
            return originalValue.trim() === "" ? null : value;
        })
        .required('Units are required').positive('Units must be a positive number'),
        
        donationDate: Yup.date()
        .transform((value, originalValue) => { 
            if (typeof originalValue !== 'string') return value;
            return originalValue.trim() === "" ? null : value;
        })
        .required('Donation Date is required'),

        status: Yup.string().required('Status is required')
    });

    useEffect(() => {
        if (editBlood) {
            setForm({
                blood: {
                    bloodGroup: editBlood.blood.bloodGroup,
                    bloodType: editBlood.blood.bloodType
                },
                units: editBlood.units,
                donationDate: new Date(editBlood.donationDate).toISOString().split('T')[0],
                status: editBlood.status
            });
        }
    }, [editBlood]);

    const clearForm = () => {
        setForm({
            blood: {
                bloodType: '',
                bloodGroup: ''
            },
            units: '',
            donationDate: '',
            status: ''
        });
        bloodInventoryDispatch({ type: 'SET_FORM_ERRORS', payload: {} });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('blood')) {
            setForm((prevForm) => ({
                ...prevForm,
                blood: {
                    ...prevForm.blood,
                    [name]: value,
                },
            }));
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await validationSchema.validate(form, { abortEarly: false });
            bloodInventoryDispatch({ type: 'SET_FORM_ERRORS', payload: {} });

            if (editBlood) {
                const response = await axios.put(`http://localhost:3080/api/bloodinventries/${editBlood._id}`, form, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                bloodInventoryDispatch({ type: 'EDIT_BLOODINVENTORY', payload: response.data });
                bloodInventoryDispatch({ type: 'SET_SERVER_ERRORS', payload: [] });
                clearForm();
                toggle();
            } else {
                const response = await axios.post(`http://localhost:3080/api/bloodinventries/${id}`, form, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                bloodInventoryDispatch({ type: 'ADD_BLOODINVENTORY', payload: response.data });
                bloodInventoryDispatch({ type: 'SET_SERVER_ERRORS', payload: [] });
                clearForm();
            }
        } catch (err) {
            if (err.name === 'ValidationError') {
                const validationErrors = {};
                err.inner.forEach((error) => {
                    validationErrors[error.path] = error.message;
                });
                bloodInventoryDispatch({ type: 'SET_FORM_ERRORS', payload: validationErrors });
            } else {
                bloodInventoryDispatch({ type: 'SET_SERVER_ERRORS', payload: err.response.data.errors });
            }
        }
    };

    return (
        <div>
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className="bg-danger text-white">
                            <Card.Body>
                                <Card.Title className='text-center'>BloodInventory Form</Card.Title>
                                <form onSubmit={handleSubmit}>
                                    <div className='form-group'>
                                        <label className='form-label' htmlFor='type'>Blood Type</label>
                                        <select
                                            value={form.blood.bloodType}
                                            onChange={handleChange}
                                            id='type'
                                            name='bloodType'
                                            className={`form-select ${bloodInventory.formErrors?.['blood.bloodType'] ? 'is-invalid' : ''}`}
                                        >
                                            <option value="">Select BloodType</option>
                                            <option value="RBC">RBC</option>
                                            <option value="platelets">platelets</option>
                                            <option value="plasma">plasma</option>
                                            <option value="wholeBlood">wholeBlood</option>
                                        </select>
                                        {bloodInventory.formErrors?.['blood.bloodType'] && (
                                            <div className="invalid-feedback" style={{ color: 'black' }}>
                                                {bloodInventory.formErrors['blood.bloodType']}
                                            </div>
                                        )}
                                    </div>
                                    <div className='form-group'>
                                        <label className='form-label' htmlFor='group'>Blood Group</label>
                                        <select
                                            value={form.blood.bloodGroup}
                                            onChange={handleChange}
                                            id='group'
                                            name='bloodGroup'
                                            className={`form-select ${bloodInventory.formErrors?.['blood.bloodGroup'] ? 'is-invalid' : ''}`}
                                        >
                                            <option value="">Select BloodGroup</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                        {bloodInventory.formErrors?.['blood.bloodGroup'] && (
                                            <div className="invalid-feedback" style={{ color: 'black' }}>
                                                {bloodInventory.formErrors['blood.bloodGroup']}
                                            </div>
                                        )}
                                    </div>
                                    <div className='form-group'>
                                        <label className='form-label' htmlFor='units'>Units</label>
                                        <input
                                            type='text'
                                            placeholder='Enter units'
                                            value={form.units}
                                            onChange={handleChange}
                                            id='units'
                                            name='units'
                                            className={`form-control ${bloodInventory.formErrors?.units ? 'is-invalid' : ''}`}
                                        />
                                        {bloodInventory.formErrors?.units && (
                                            <div className="invalid-feedback" style={{ color: 'black' }}>
                                                {bloodInventory.formErrors.units}
                                            </div>
                                        )}
                                    </div>
                                    <div className='form-group'>
                                        <label className='form-label' htmlFor='date'>Donation Date</label>
                                        <input
                                            type='date'
                                            placeholder='Enter donation date'
                                            value={form.donationDate}
                                            onChange={handleChange}
                                            id='date'
                                            name='donationDate'
                                            className={`form-control ${bloodInventory.formErrors?.donationDate ? 'is-invalid' : ''}`}
                                        />
                                        {bloodInventory.formErrors?.donationDate && (
                                            <div className="invalid-feedback" style={{ color: 'black' }}>
                                                {bloodInventory.formErrors.donationDate}
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="status">Status</label><br />
                                        <input
                                            type="radio"
                                            value="available"
                                            onChange={handleRadioChange}
                                            id="available"
                                            name="status"
                                            className={bloodInventory.formErrors?.status ? 'is-invalid' : ''}
                                        />
                                        <label htmlFor="available">Available</label>{" "}
                                        <input
                                            type="radio"
                                            value="booked"
                                            onChange={handleRadioChange}
                                            id="booked"
                                            name="status"
                                            className={bloodInventory.formErrors?.status ? 'is-invalid' : ''}
                                        />
                                        <label htmlFor="booked">Booked</label>{" "}
                                        <input
                                            type="radio"
                                            value="expired"
                                            onChange={handleRadioChange}
                                            id="expired"
                                            name="status"
                                            className={bloodInventory.formErrors?.status ? 'is-invalid' : ''}
                                        />
                                        <label htmlFor="expired">Expired</label>
                                        {bloodInventory.formErrors?.status && (
                                            <div className="invalid-feedback" style={{ color: 'black' }}>
                                                {bloodInventory.formErrors.status}
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <input type='submit' className='btn btn-light' />
                                    </div>
                                </form>
                                {bloodInventory.serverErrors && bloodInventory.serverErrors.length > 0 && (
                                    <Row className="justify-content-center">
                                        <Col md={6}>
                                            <div>
                                                <h4>You are prohibited from saving these blood details due to these errors:</h4>
                                                <ul>{bloodInventory.serverErrors.map((err, i) => {
                                                    return <li key={i}>{err.msg}</li>
                                                })}</ul>
                                            </div>
                                        </Col>
                                    </Row>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
