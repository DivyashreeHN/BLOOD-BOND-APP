import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Form,Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2'
import * as Yup from 'yup';
import ReviewContext from '../../contexts/reviewContext';

export default function ReviewForm({ editReview, toggle }) {
    const { bloodbankId } = useParams();
    const {reviews,reviewDispatch}=useContext(ReviewContext)
    const [formErrors, setFormErrors] = useState({});
    const [form, setForm] = useState({
        name: '',
        description: '',
        ratings: ''
    });
console.log('reviews',reviews.reviewsData)
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        ratings: Yup.number()
            .transform((value, originalValue) => {
                if (typeof originalValue !== 'string') return value;
                return originalValue.trim() === "" ? null : value;
            })
            .required('Ratings are required')
            .min(1, 'Ratings must be at least 1')
            .max(5, 'Ratings can be at most 5')
    });

    useEffect(() => {
        if (editReview) {
            setForm({
                name: editReview.name,
                description: editReview.description,
                ratings: editReview.ratings
            });
        }
    }, [editReview]);

    const clearForm = () => {
        setForm({
            name: '',
            description: '',
            ratings: ''
        });
        setFormErrors({})
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await validationSchema.validate(form, { abortEarly: false });
            setFormErrors({})

            if (editReview) {
                const response = await axios.put(`http://localhost:3080/api/review/${editReview._id}`, form, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                reviewDispatch({ type: 'EDIT_REVIEW', payload: response.data });
                reviewDispatch({ type: 'SET_SERVER_ERRORS', payload: [] });
                clearForm();
                toggle();
            } else {
                const response = await axios.post(`http://localhost:3080/api/review/${bloodbankId}`, form, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                reviewDispatch({ type: 'ADD_REVIEW', payload: response.data });
                reviewDispatch({ type: 'SET_SERVER_ERRORS', payload: [] });
                clearForm();
                Swal.fire({
                    title: 'Success!',
                    text: 'Thank you for review',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
                setFormErrors({})
            }
        } catch (err) {
            if (err.name === 'ValidationError') {
                const validationErrors = {};
                err.inner.forEach((error) => {
                    validationErrors[error.path] = error.message;
                });
                console.log(validationErrors);
                setFormErrors(validationErrors);
            } else {
                reviewDispatch({ type: 'SET_SERVER_ERRORS', payload: err.response.data.errors });
            }
        }
    };

    return (
        <div>
            <Container style={{marginTop:'50px'}}>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className="bg-danger text-white">
                            <Card.Body>
                                <Card.Title className='text-center'>Review Form</Card.Title>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group>
                                        <Form.Label htmlFor='name'>Name</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter your name'
                                            value={form.name}
                                            onChange={handleChange}
                                            id='name'
                                            name='name'
                                            className={formErrors?.name ? 'is-invalid' : ''}
                                        />
                                        {formErrors?.name && (
                                            <div className="invalid-feedback" style={{ color: 'black' }}>
                                                {formErrors.name}
                                            </div>
                                        )}
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label htmlFor='description'>Description</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter a description'
                                            value={form.description}
                                            onChange={handleChange}
                                            id='description'
                                            name='description'
                                            className={formErrors?.description ? 'is-invalid' : ''}
                                        />
                                        {formErrors?.description && (
                                            <div className="invalid-feedback" style={{ color: 'black' }}>
                                                {formErrors.description}
                                            </div>
                                        )}
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label htmlFor='ratings'>Ratings</Form.Label>
                                        <Form.Control
                                            type='number'
                                            placeholder='Enter your ratings'
                                            value={form.ratings}
                                            onChange={handleChange}
                                            id='ratings'
                                            name='ratings'
                                            className={formErrors?.ratings ? 'is-invalid' : ''}
                                        />
                                        {formErrors?.ratings && (
                                            <div className="invalid-feedback" style={{ color: 'black' }}>
                                                {formErrors.ratings}
                                            </div>
                                        )}
                                    </Form.Group>
                                    <div className="d-flex justify-content-center">
                                        <Button type='submit' className='btn btn-light'>Submit</Button>
                                    </div>
                                </Form>
                                {reviews.serverErrors && reviews.serverErrors.length > 0 && (
                                    <Row className="justify-content-center">
                                        <Col md={6}>
                                            <div>
                                                <h4>You are prohibited from submitting this review due to these errors:</h4>
                                                <ul>{reviews.serverErrors.map((err, i) => {
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
