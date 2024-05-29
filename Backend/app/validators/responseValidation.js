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
       
        optional: true,
        notEmpty: {
            errorMessage: 'status cannot be empty',
        },
        isIn:{
            options:[['accepted','rejected']]
        }
    }
}
module.exports=responseValidationSchema