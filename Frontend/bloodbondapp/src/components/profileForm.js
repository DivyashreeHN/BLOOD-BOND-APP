import { useState } from "react"
import {Row,Col} from "reactstrap"
export default function ProfileForm()
{
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
        Geolocation:{
            type:'',
            coordinates:[]
        },
        weight:'',
        testedPositiveForHiv:'',
        tattoBodyPiercing:''
    })

    const handleChange=(e)=>
    {
        const {name,value}=e.target
        if(name.startsWith('address'))
        {
            setForm((prevForm)=>
        (
            {...prevForm,address:{...prevForm.address,[name.split('.')[1]]:value}})
            )
        }
        else{
        setForm({...form,[name]:value})
        }
    }

    
    return(
       <>
       <form>
<Row>
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
<Col md={6}>
    <div className="form-group">
        <label className="form-label" htmlFor="dateOfBirth">dob</label>
        <input type="date" value={form.dob} onChange={handleChange}
        id="dateOfBirth"
        name="dob"
        className="form-control"/>
    </div>
</Col>

<Col md={6}>    
        <div className="form-group">
            <label className="form-label" htmlFor="phone">phoneNumber</label>
            <input type="text"
            value={form.phNo}
            onChange={handleChange}
            id="phone"
            name="phNo"
            className="form-control"/>
        </div>
</Col>
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
            <label className="form-label" htmlFor="state">State</label>
            <input type="text"
            value={form.address &&form.address.state}
            onChange={handleChange}
            id="state"
            name="address.state"
            className="form-control"/>
        </div>
</Col>
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
<Col md={6}>
    <div className="form-group">
        <label style={{ textAlign: "left" }}>Gender</label><br />
        <input type="radio" value="Male" checked={form.gender === "Male"} onChange={handleChange} id="male" name="gender" /><label htmlFor="male">Male</label>{" "}
        <input type="radio" value="Female" checked={form.gender === "Female"} onChange={handleChange} id="female" name="gender" /><label htmlFor="female">Female</label>
    </div>
</Col>
<Col md={6}>
    <div className="form-group">
        <label style={{textAlign:'left'}}className="form-label" htmlFor="blood">Blood</label>
    </div>
</Col>
</Row>

       </form>
       </>
    )
}