const { response } = require('express')
const response=require('../models/responseModel')
const historyCtrl={}
historyCtrl.historyOfUser=async(req,res)=>{
    const id=req.params.id
    try{
        const responses=await response.find({responderId:id})
        for(const response of responses)
            {
                const accepted=await response.find({status:'accepted'})
                if(accepted)
                    {
                        
                    }
            }

    }
    catch(err){
        return res.status(500).json({ error: 'internal server error' })
    }

}

    