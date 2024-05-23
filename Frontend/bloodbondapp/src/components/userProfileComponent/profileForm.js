import { useDispatch} from 'react-redux'
import { useState } from "react"
import {Row,Col} from "reactstrap"
import {startAddProfile} from '../../actions/userprofileActions'
export default function ProfileForm()
{
    const dispatch=useDispatch()
    const[form,setForm]=useState({
        firstName:'',
        lastName:'',
        dob:'',
        gender:'',
        phNo:'',
        blood:{
            bloodType:'',
            bloodGroup:''
        },
        lastBloodDonationDate:'',
        address:{
            building:'',
            locality:'',
            city:'',
            state:'',
            pincode:'',
            country:''
        },
        geolocation:{
            type:'',
            coordinates:[]
        },
        weight:'',
        testedPositiveForHiv:'',
        tattoBodyPiercing:''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name.includes('.')) {
            // Nested fields
            const [fieldName, nestedField] = name.split('.');
            setForm(prevForm => ({
                ...prevForm,
                [fieldName]: {
                    ...prevForm[fieldName],
                    [nestedField]: value
                }
            }));
        } else {
            // Non-nested fields
            setForm(prevForm => ({
                ...prevForm,
                [name]: value
            }));
        }
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    const clearForm = () => {
        setForm({
            firstName:'',
            lastName:'',
            dob:'',
            gender:'',
            phNo:'',
            blood:{
                bloodType:'',
                bloodGroup:''
            },
            lastBloodDonationDate:'',
            address:{
                building:'',
                locality:'',
                city:'',
                state:'',
                pincode:'',
                country:''
            },
            geolocation:{
                type:'',
                coordinates:[]
            },
            weight:'',
            testedPositiveForHiv:'',
            tattoBodyPiercing:''
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        
<<<<<<< HEAD
        console.log('it is form',form)
=======
        console.log(form)
>>>>>>> 0c0108e00081d257199244c0c7f41c2cae8ea7e3
        try{
        dispatch(startAddProfile(form,clearForm));
        }  
        catch(err)
        {
            console.log(err,'error in submitting form')
        }    
    }
    return(
       <>
       <form onSubmit={handleSubmit}>
<Row>

{/*1) firstName */}

<Col md={6}>
        <div className="form-group">
            <label className="form-label" htmlFor="firstName">
            firstName
            </label>
            <input type="text" value={form.firstName} onChange={handleChange}
            id="firstName"
            name="firstName"
            className="form-control"/>
        </div>
</Col>


{/*2) lastName */}

<Col md={6}>
        <div className="form-group">
            <label className="form-label" htmlFor="lastName">
            lastName
            </label>
            <input type="text" value={form.lastName} onChange={handleChange}
            id="lastName"
            name="lastName"
            className="form-control"/>
        </div>
</Col>

{/*3) dob */}

<Col md={6}>
    <div className="form-group">
        <label className="form-label" htmlFor="dob">dob</label>
        <input type="date" value={form.dob} onChange={handleChange}
        id="dob"
        name="dob"
        className="form-control"/>
    </div>
</Col>

{/*4) lastBloodDonationDate */}

<Col md={6}>
    <div className="form-group">
        <label className="form-label" htmlFor="lastBloodDonationDate">lastBloodDonationDate</label>
        <input type="date" value={form.lastBloodDonationDate} onChange={handleChange}
        id="lastBloodDonationDate"
        name="lastBloodDonationDate"
        className="form-control"/>
    </div>
</Col>

{/* 5) weight  */}

<Col md={6}>
    <div className="form-group">
        <label className="form-label" htmlFor="weight">weight</label>
        <input type="number" value={form.weight} onChange={handleChange}
        id="weight"
        name="weight"
        className="form-control"/>
    </div>
</Col>

{/* 6)  phNo */}
<Col md={6}>    
        <div className="form-group">
            <label className="form-label" htmlFor="phNo">phNo</label>
            <input type="text"
            value={form.phNo}
            onChange={handleChange}
            id="phNo"
            name="phNo"
            className="form-control"/>
        </div>
</Col>

{/* 7) building no */}

<Col md={6}>
             <div className="form-group">
                <label className="form-label" htmlFor="building">Building No</label>
                <input type="text"
                value={form.address&& form.address.building}
                onChange={handleChange}
                id="building"
                name="address.building"
                className="form-control"/>   
             </div>
</Col>

{/* 8) locality */}

<Col md={6}>
        <div className="form-group">
            <label className="form-label" htmlFor="locality">locality</label>
            <input type="text"
            value={form.address && form.address.locality}
            onChange={handleChange}
            id="locality"
            name="address.locality"
            className="form-control"/>
        </div>
</Col>

{/* 9) city */}

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

{/* 10) state */}

<Col md={6}>
        <div className="form-group">
            <label className="form-label" htmlFor="state">State</label>
            <input type="text"
            value={form.address &&form.address.state}
            onChange={handleChange}
            id="state"
            name="address.state"
            className="form-control"/>
        </div>
</Col>

{/* 11) pincode */}

<Col md={6}>
        <div className="form-group">
            <label className="form-label" htmlFor="pincode">Pincode</label>
            <input type="text"
            value={form.address &&form.address.pincode}
            onChange={handleChange}
            id="pincode"
            name="address.pincode"
            className="form-control"/>
        </div>
</Col>

{/* 12) country */}

<Col md={6}>
        <div className="form-group">
            <label className="form-label" htmlFor="country">country</label>
            <input type="text"
            value={form.address &&form.address.country}
            onChange={handleChange}
            id="country"
            name="address.country"
            className="form-control"/>
        </div>
</Col><br></br>

<<<<<<< HEAD

{/* 16) blood */}

<label style={{textAlign:'left'}}>blood</label>  
=======
{/* 13) gender */}

<Col md={6}>
    <div className="form-group">
        <label style={{ textAlign: "left" }}>gender</label><br />
        <input type="radio" 
        value="male" 
        checked={form.gender === "male"} 
        onChange={handleRadioChange} 
        id="male" 
        name="gender" />
        <label htmlFor="male">male</label>{" "}

        <input type="radio" 
        value="female" 
        checked={form.gender === "female"} 
        onChange={handleRadioChange} 
        id="female" name="gender" />
        <label htmlFor="female">female</label>
    </div>
</Col>

{/* 14) tattoBodyPiercing */}

<Col md={6}>
    <div className="form-group">
        <label style={{ textAlign: "left" }}>tattoBodyPiercing</label><br />
        <input type="radio" 
        value="yes" 
        checked={form.tattoBodyPiercing === "yes"} 
        onChange={handleRadioChange} 
        id="yes" 
        name="tattoBodyPiercing" />
        <label htmlFor="yes">yes</label>{" "}

        <input type="radio" 
        value="no" 
        checked={form.tattoBodyPiercing === "no"} 
        onChange={handleRadioChange} 
        id="no" name="tattoBodyPiercing" />
        <label htmlFor="no">no</label>
    </div>
</Col>

{/*  15) testedPositiveForHiv  */}

<Col md={6}>
    <div className="form-group">
        <label style={{ textAlign: "left" }}>testedPositiveForHiv</label><br />
        <input type="radio" 
        value="yes" 
        checked={form.testedPositiveForHiv === "yes"} 
        onChange={handleRadioChange} 
        id="yes" 
        name="testedPositiveForHiv" />
        <label htmlFor="yes">yes</label>{" "}

        <input type="radio" 
        value="no" 
        checked={form.testedPositiveForHiv === "no"} 
        onChange={handleRadioChange} 
        id="no" 
        name="testedPositiveForHiv" />
        <label htmlFor="no">no</label>
    </div>
</Col>

{/* 16) blood */}

            <label style={{textAlign:'left'}}>blood</label>  
>>>>>>> 0c0108e00081d257199244c0c7f41c2cae8ea7e3
                <Col md={6}>
                <div className="form-group">
                    <label className='form-label' htmlFor='bloodType'>bloodType</label>
                    <select value={form.blood && form.blood.bloodType}
                            onChange={handleChange}
                            id='bloodType'
                            name='blood.bloodType'
                            className='form-select'>
                                <option value="">Select BloodType</option>
                                <option value="plasma">plasma</option>
                                <option value="platelet">platelet</option>
                                <option value="rbc">rbc</option>
                            </select>
                            </div>
                            </Col>

            <Col md={6}>
                <div className='form-group'>
                    <label className='form-label' htmlFor='bloodGroup'>bloodGroup</label>
                    <select value={form.blood && form.blood.bloodGroup}
                            onChange={handleChange}
                            id='bloodGroup'
                            name='blood.bloodGroup'
                            className='form-select'>
                                <option value="">Select bloodGroup</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>      
                </div>
            </Col>

<<<<<<< HEAD
{/* 13) gender */}
<Col xs={12} md={6}>
    <div className="form-group" style={{ width: '100%' }}>
        <label style={{ textAlign: 'left', width: '100%', display: 'block' }}>Gender</label>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
                <input
                    type="radio"
                    value="male"
                    checked={form.gender === "male"}
                    onChange={handleRadioChange}
                    id="male"
                    name="gender"
                    style={{ marginRight: '0.5rem' }}
                />
                <label htmlFor="male">Male</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    type="radio"
                    value="female"
                    checked={form.gender === "female"}
                    onChange={handleRadioChange}
                    id="female"
                    name="gender"
                    style={{ marginRight: '0.5rem' }}
                />
                <label htmlFor="female">Female</label>
            </div>
        </div>
    </div>
</Col>

<Col xs={12} md={6}>
    <div className="form-group" style={{ width: '100%' }}>
        <label style={{ textAlign: 'left', width: '100%', display: 'block' }}>Tatto Body Piercing</label>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
                <input
                    type="radio"
                    value="yes"
                    checked={form.tattoBodyPiercing === "yes"}
                    onChange={handleRadioChange}
                    id="yes"
                    name="tattoBodyPiercing"
                    style={{ marginRight: '0.5rem' }}
                />
                <label htmlFor="yes">Yes</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    type="radio"
                    value="no"
                    checked={form.tattoBodyPiercing === "no"}
                    onChange={handleRadioChange}
                    id="no"
                    name="tattoBodyPiercing"
                    style={{ marginRight: '0.5rem' }}
                />
                <label htmlFor="no">No</label><br></br>
            </div>
        </div>
    </div>
</Col>


{/*  15) testedPositiveForHiv  */}

<Col xs={12} md={12}>
    <div className="form-group" style={{ width: '100%' }}>
        <label style={{ textAlign: 'left', width: '100%', display: 'block' }}>Tested Positive For HIV</label>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
                <input
                    type="radio"
                    value="yes"
                    checked={form.testedPositiveForHiv === "yes"}
                    onChange={handleRadioChange}
                    id="yes"
                    name="testedPositiveForHiv"
                    style={{ marginRight: '0.5rem' }}
                />
                <label htmlFor="yes">Yes</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    type="radio"
                    value="no"
                    checked={form.testedPositiveForHiv === "no"}
                    onChange={handleRadioChange}
                    id="no"
                    name="testedPositiveForHiv"
                    style={{ marginRight: '0.5rem' }}
                />
                <label htmlFor="no">No</label>
            </div>
        </div>
    </div>
</Col>




=======
>>>>>>> 0c0108e00081d257199244c0c7f41c2cae8ea7e3

{/* <label style={{textAlign: 'left'}}>blood</label>  
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label" htmlFor="bloodType">bloodType</label>
                        <select 
                            value={form.blood && form.blood.bloodType}
                            onChange={handleChange}
                            id="bloodType"
                            name="blood.bloodType"
                            className="form-select"
                        >
                            <option value="">Select BloodType</option>
                            <option value="plasma">plasma</option>
                            <option value="platelet">platelet</option>
                            <option value="rbc">rbc</option>
                        </select>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label" htmlFor="bloodGroup">bloodGroup</label>
                        <select 
                            value={form.blood && form.blood.bloodGroup}
                            onChange={handleChange}
                            id="bloodGroup"
                            name="blood.bloodGroup"
                            className="form-select"
                        >
                            <option value="">Select bloodGroup</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>      
                    </div>
                </div>
            </div> */}
{/* submit button */}
                        <Col md={12}>
                            <input type="submit"/>
                        </Col>
                    
                
</Row>

       </form>
<<<<<<< HEAD
       </>
    )
}
=======
       </>
    )
}
>>>>>>> 0c0108e00081d257199244c0c7f41c2cae8ea7e3
