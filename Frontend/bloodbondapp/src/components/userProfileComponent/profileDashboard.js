import React, { useState } from 'react';
import ProfileForm from './profileForm'; // Assuming ProfileForm is defined in a separate file
import BloodRequestForm from './blood-requestForm';
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { startFetchingUserProfile } from '../../actions/userprofileActions';


export default function ProfileDashboard() {
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [showBloodRequestForm, setShowBloodRequestForm] = useState(false);
    const [formTitle, setFormTitle] = useState('');

    ////
    const dispatch=useDispatch()
    const Profiles=useSelector((state)=>{
        return state.profiles.singleProfile
    })
    console.log('profile length',Profiles?.length)
    useEffect(()=>
        {
            dispatch(startFetchingUserProfile())
        },[])
        ///

    const handleProfileClick = () => {
        setShowProfileForm(true);
        setShowBloodRequestForm(false); // Hide BloodRequestForm
        setFormTitle('Add Profile');
    };

    const handleBloodRequestClick = () => {
        setShowBloodRequestForm(true);
        setShowProfileForm(false); // Hide ProfileForm
        setFormTitle('Add Request');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <h3>profile Dashboard</h3>
          {/* <h1>user profile {singlePro.firstName}</h1> */}
        {Profiles?.length===0?(<div>
            <button className='btn btn-primary' onClick={handleProfileClick}>Add Profile</button>
            {/* <button className='btn btn-primary' onClick={handleBloodRequestClick}>Add Request</button> */}
        </div>):(Profiles?.map((ele,index)=>{
            return <div key={index}>
                    <p>firstName:{ele.firstName}</p>   
                    <p>PhoneNumber:{ele.phNo}</p>
                    <p>Address:{ele.address.building},{ele.address.locality},{ele.address.city},{ele.address.pincode},{ele.address.state},{ele.address.country}</p>
                    <p>lastName:{ele.lastName}</p>

                    <button className='btn btn-primary' onClick={handleBloodRequestClick}>Add Request</button>
            </div>
        }))}
         {showProfileForm && <ProfileForm />}
            {showBloodRequestForm && <BloodRequestForm />}

                </div>)}