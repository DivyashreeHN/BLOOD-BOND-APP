import {useState} from "react"
import ShowProfiles from "./showProfile"
export default function AdminDashboard() 
{
    const [showProfile,setshowProfile]=useState(false)
    const handleClick=() => 
        {
        setshowProfile(true)
    }
    return (
        
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h3>AdminDashboard</h3>
              <button className="btn btn-primary" onClick={handleClick}>view Profiles</button>
            {showProfile && <ShowProfiles />} 
        </div>
    )
<<<<<<< HEAD
}
=======
}
>>>>>>> 0c0108e00081d257199244c0c7f41c2cae8ea7e3
