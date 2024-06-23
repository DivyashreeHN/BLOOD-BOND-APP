import { useState } from "react";
import { useDispatch } from 'react-redux';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { startAddBloodBank } from "../../actions/bloodbankActions";

export default function BloodBankForm() {
        
    const dispatch=useDispatch()
    const [form,setForm]=useState({
        name:'',
        phoneNumber:'',
        address:{
            building:'',
            locality:'',
            city:'',
            state:'',
            pincode:'',
            country:''
        },
        geoLocation:{
            type:'',
            coordinates:[]
        },
        availableBlood:[],
        openingHours:{
            opensAt:{
                hour:'',
                minutes:'',
                period:''
            },
            closesAt:{
                chour:'',
                cminutesminutes:'',
                cperiod:''
            }
        },
        services:[],
        license:[],
        photos:[],
        isApproved:''

    })
    const handleChange=(e)=>{
        const {name,value}=e.target
        if(name.startsWith('address')){
            setForm((prevForm)=>(
                {...prevForm,address:{...prevForm.address,[name.split('.')[1]]:value}})
            )
        }
        else if (name === 'services') {
            setForm({ ...form, [name]: value.split(',') }); // updating form.services to be an array
        }
        else if (name.startsWith("opensAt") || name.startsWith("closesAt")) {
            const [parent, child] = name.split(".");
            setForm((prevForm) => ({
              ...prevForm,
              openingHours: {
                ...prevForm.openingHours,
                [parent]: { ...prevForm.openingHours[parent], [child]: value },
              },
            }));
          } 
        else{
            setForm({...form,[name]:value})
        }
        
    }
    const handleFileChange = (e, formData = new FormData()) => {
        const files = Array.from(e.target.files);
        const { name } = e.target;
        files.forEach((file, index) => {
            formData.append(`${name}[${index}]`, file);
        });
        // Update the form state
        setForm((prevForm) => ({
            ...prevForm,
            [name]: [...(prevForm[name] || []), ...files], // Append new files to existing array
        }));
    }
    
    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }
    
           
        

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(form);
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('phoneNumber', form.phoneNumber);
        const { building, locality, city, state, pincode, country } = form.address;
        formData.append('address[building]', building);
        formData.append('address[locality]', locality);
        formData.append('address[city]', city);
        formData.append('address[state]', state);
        formData.append('address[pincode]', pincode);
        formData.append('address[country]', country);
        if (form.openingHours.opensAt && form.openingHours.closesAt) {
            const { opensAt, closesAt } = form.openingHours;
            const { hour, minutes, period } = opensAt;
            formData.append('openingHours[opensAt][hour]', hour)
            formData.append('openingHours[opensAt][minutes]', minutes)
            formData.append('openingHours[opensAt][period]', period)
            const { chour, cminutes, cperiod } = closesAt;
            formData.append('openingHours[closesAt][hour]', chour)
            formData.append('openingHours[closesAt][minutes]', cminutes)
            formData.append('openingHours[closesAt][period]', cperiod)
        }
        if (Array.isArray(form.services) && form.services.length > 0) {
            form.services.forEach((service) => {
                formData.append('services', service);
            });
        }
        Object.entries(form.license).forEach((ele) =>
          formData.append("license", ele[1])
        );
        Object.entries(form.photos).forEach((ele) =>
          formData.append("photos", ele[1])
        );
        
    
        console.log(formData);
    
        const clearForm = () => {
            setForm({
                name: '',
                phoneNumber: '',
                address: {
                    building: '',
                    locality: '',
                    city: '',
                    state: '',
                    pincode: '',
                    country: ''
                },
                geoLocation: {
                    type: '',
                    coordinates: []
                },
                availableBlood: [],
                openingHours: {
                    opensAt: {
                        hour: '',
                        minutes: '',
                        period: ''
                    },
                    closesAt: {
                        chour: '',
                        cminutes: '',
                        cperiod: ''
                    }
                },
                services: [],
                license: [],
                photos: [],
                isApproved: ''
            });
        };
        dispatch(startAddBloodBank(formData, clearForm,form));
        
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="bg-danger text-black">
                        <Card.Body>
                            <Card.Title>Blood Bank Form</Card.Title>
                            <form onSubmit={handleSubmit}>
                            <Row>
                <Col md={6}>
                <div className="form-group">
                <label className="form-label" htmlFor="name">
                    BloodBank Name
                </label>
                <input type="text"
                value={form.name}
                onChange={handleChange}
                id="name"
                name="name"
                className="form-control"/>
            </div></Col>
            <Col md={6}>
            <div className="form-group">
                <label className="form-label" htmlFor="phone">PhoneNumber</label>
                <input type="text"
                value={form.phoneNumber}
                onChange={handleChange}
                id="phone"
                name="phoneNumber"
                className="form-control"/>
            </div></Col>
            <Col md={6}>
                <div className="form-group">
                    <label className="form-label" htmlFor="building">Building No</label>
                    <input type="text"
                    value={ form.address && form.address.building}
                    onChange={handleChange}
                    id="building"
                    name="address.building"
                    className="form-control"/>
                </div></Col>
                <Col md={6}>
                <div className="form-group">
                    <label className="form-label" htmlFor="locality">locality</label>
                    <input type="text"
                    value={form.address && form.address.locality}
                    onChange={handleChange}
                    id="locality"
                    name="address.locality"
                    className="form-control"/>
                </div></Col>
                <Col md={6}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="city">City</label>
                        <input type="text"
                        value={form.address && form.address.city}
                        onChange={handleChange}
                        id="city"
                        name="address.city"
                        className="form-control"/>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="state"> State</label>
                        <input type="text"
                        value={form.address && form.address.state}
                        onChange={handleChange}
                        id="state"
                        name="address.state"
                        className="form-control"/>
                    </div>
                </Col>
                
                <Col md={6}>
                    <label className="form-label" htmlFor="pincode">Pincode</label>
                    <input type="text"
                    value={form.address && form.address.pincode}
                    onChange={handleChange}
                    id="pincode"
                    name="address.pincode"
                    className="form-control"/>
                </Col>
                <Col md={6}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="country">Country</label>
                        <input type="text"
                        value={form.address && form.address.country}
                        onChange={handleChange}
                        id="country"
                        name="address.country"
                        className="form-control"/>
                    </div>
                </Col>
                <label style={{textAlign: "left"}}>OpensAt</label>
                <Col md={4}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="hour">hour</label>
                        <input type="text"
                        value={form.openingHours.opensAt&&form.openingHours.opensAt.hour}
                        onChange={handleChange}
                        id="hour"
                        name="opensAt.hour"
                        className="form-control"/>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="minutes">minutes</label>
                        <input type="text"
                        value={ form.openingHours.opensAt&&form.openingHours.opensAt.minutes}
                        onChange={handleChange}
                        id="minutes"
                        name="opensAt.minutes"
                        className="form-control"/>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="period">Period</label>
                        <input type="text"
                        value={form.openingHours.opensAt&&form.openingHours.opensAt.period}
                        onChange={handleChange}
                        id="period"
                        name="opensAt.period"
                        className="form-control"/>
                    </div>
                </Col>
                <label style={{textAlign:'left'}}>ClosesAt</label>
                <Col md={4}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="chour">hour</label>
                        <input type="text"
                        value={form.openingHours.closesAt&&form.openingHours.closesAt.chour}
                        onChange={handleChange}
                        id="chour"
                        name="closesAt.chour"
                        className="form-control"/>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="cminutes">minutes</label>
                        <input type="text"
                        value={ form.openingHours.closesAt&&form.openingHours.closesAt.cminutes}
                        onChange={handleChange}
                        id="cminutes"
                        name="closesAt.cminutes"
                        className="form-control"/>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="cperiod">Period</label>
                        <input type="text"
                        value={form.openingHours.closesAt&&form.openingHours.closesAt.cperiod}
                        onChange={handleChange}
                        id="cperiod"
                        name="closesAt.cperiod"
                        className="form-control"/>
                    </div>
                    </Col>
                    <Col md={12}>
                    <div className="form-group">
                    <label className="form-label" htmlFor="license">License</label>
                    <input type="file"
                    onChange={handleFileChange}
                    id="license"
                    name="license"
                    className="form-control"/>
                    </div>
                    </Col>
                    <Col md={12}>
                    <div className="form-group">
                    <label className="form-label" htmlFor="photos">Photos</label>
                    <input type="file"
                    onChange={handleFileChange}
                    id="photos"
                    name="photos"
                    multiple
                    className="form-control"/>
                    </div>
                    </Col>
                    <Col md={12}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="services">Services</label>
                        <input type="text"
                        value={form.services.join(',')}
                        onChange={handleChange}
                        id="services"
                        name="services"
                        className="form-control"/>
                        <Col md={12}>
                        <div className="form-group">
                            <label  style={{textAlign:'left'}}className="form-label" htmlFor="status">isApproved</label><br/>
                            <input type="radio"
                            value={form.isApproved}
                            onChange={handleRadioChange}
                            id="pending"
                            name="isApproved"/>
                            <label htmlFor="pending">Pending</label>{" "}
                            <input type="radio"
                            value={form.isApproved}
                            onChange={handleRadioChange}
                            id="approved"
                            name="isApproved"/>
                            <label htmlFor="approved">Approved</label>{" "}
                            <input type="radio"
                            value={form.isApproved}
                            onChange={handleRadioChange}
                            id="rejected"
                            name="isApproved"/>
                            <label htmlFor="rejected">Rejected</label>
                        </div>
                    </Col>
                        <Col md={12}>
                            <input type="submit" className="btn btn-dark"/>
                        </Col>
                    </div>
                </Col>
                </Row>
                 </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}