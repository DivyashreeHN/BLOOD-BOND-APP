import BloodBankForm from "./bloodbankForm"
import {useState} from 'react'
export default function BloodBankDashboard(){
    const [showForm,setShowForm]=useState(false)
    const handleClick=()=>{
        setShowForm(true)
    }
    return(
        <div className="row">
            <h3>BloodBankDashboard</h3>
            {showForm?(<div col-md-6>
                <BloodBankForm/>
            </div>):(<div col-md-6>
            <button  className='btn btn-primary' onClick={handleClick}>Add BloodBank</button>
            </div>)}
            </div>
    )
}