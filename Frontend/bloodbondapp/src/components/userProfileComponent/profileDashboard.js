import React, { useState } from 'react';
import ProfileForm from './profileForm'; // Assuming ProfileForm is defined in a separate file
import BloodRequestForm from './blood-requestForm';
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { startFetchingUserProfile,startDeletingUserProfile,startEditingUserProfile } from '../../actions/userprofileActions';


export default function ProfileDashboard() {
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [showBloodRequestForm, setShowBloodRequestForm] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const [editProfileData, setEditProfileData] = useState(null)

    ////
    const dispatch=useDispatch()
    const singlePro=useSelector((state)=>{
        return state.profiles.singleProfile
    })
    console.log('profile length',singlePro.length)
    useEffect(()=>
        {
            dispatch(startFetchingUserProfile())
        },[])
        ///

    const handleProfileClick = () => {
        setShowProfileForm(true);
        setShowBloodRequestForm(false); // Hide BloodRequestForm
        setFormTitle('Add Profile');
        setEditProfileData(null)
    };

    const handleBloodRequestClick = () => {
        setShowBloodRequestForm(true);
        setShowProfileForm(false); // Hide ProfileForm
        setFormTitle('Add Request');
        setEditProfileData(null)
    };
    
    const handleProfileDelete=(id)=>
        {
            dispatch(startDeletingUserProfile(id))
        }

    const handleProfileEdit=(id)=>
        {
            const profileToEdit = singlePro.find((profile) => profile._id === id);
            setEditProfileData(profileToEdit);
            setShowProfileForm(true);
            setShowBloodRequestForm(false);
            setFormTitle('Edit Profile')
        }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <h3>profile Dashboard</h3>
       
        {singlePro?.length===0?(<div>
            <button className='btn btn-primary' onClick={handleProfileClick}>Add Profile</button>
            {/* <button className='btn btn-primary' onClick={handleBloodRequestClick}>Add Request</button> */}
        </div>):(singlePro?.map((ele,index)=>{
            return <div key={index}>
                    <p>firstName:{ele.firstName}</p> 
                    <p>lastName:{ele.lastName}</p>
                    <p>DOB:{ele.dob}</p>  
                    <p>Gender:{ele.gender}</p>
                    <p>PhoneNumber:{ele.phNo}</p>
                    <p>BloodType:{ele.blood.bloodType}</p>
                    <p>BloodGroup:{ele.blood.bloodGroup}</p>
                    <p>LastBloodDonationDate:{ele.lastBloodDonationDate}</p>
                    <p>Address:{ele.address.building},{ele.address.locality},{ele.address.city},{ele.address.pincode},{ele.address.state},{ele.address.country}</p>
                    <p>weight:{ele.weight}</p>
                    <p>tested+veForHiv:{ele.testedPositiveForHiv}</p>
                    <p>tatto and body piercing:{ele.tattoBodyPiercing}</p>

                    <button className='btn btn-primary' onClick={handleBloodRequestClick}>Add Request</button>  |  

                    <button className='btn btn-primary' onClick={()=>
                    handleProfileDelete(ele._id)
                    }>Delete Profile</button>
                      |  
                    <button className='btn btn-primary' onClick={()=>
                    handleProfileEdit(ele._id)
                    }>Edit Profile</button>
                   
            </div>
        }))}
             {showProfileForm && <ProfileForm  formTitle={formTitle} profileData={editProfileData}/>} 
            {showBloodRequestForm && <BloodRequestForm />}

                </div>)}
        
    
