const responseValidationSchema={
    // responderId:{
    //     isMongoId:{
    //         errorMessage:"it should be valid mongoID"
    //     }
    // },
    // bloodRequestID:{
    //     isMongoId:{
    //         errorMessage:"it should be valid mongoID"
    //     }
    // },
    status:{
       
        notEmpty:{
            errorMessage:'status cannot be empty'
        },
        isIn:{
            options:[['accepted','rejected','pending']]
        }
    }
}
module.exports=responseValidationSchema