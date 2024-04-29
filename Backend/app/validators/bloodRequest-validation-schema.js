const { isString } = require('lodash');
const BloodRequest=require('../models/bloodRequest-model');

const bloodRequestValidationSchema={
    patientName:{
        notEmpty:{
            errorMessage:'patient name cannot be empty'
        },
        isString:{
            errorMessage:'name should be in a string'
        },
        trim:true,
        custom:{
            options: async function(value)
            { 
                if(/\d/.test(value))
                {
                    throw new Error('name should not contain numbers')
                }
            }
        }
    },
    blood:{
        notEmpty:{
            errorMessage:'blood is required'
        },
        isObject:{
            errorMessage:'blood field should be an object'
        },
        custom: {
            options: function(value) {
                if (!value || !value.bloodType || !value.bloodGroup) {
                    throw new Error('bloodType and bloodGroup fields are required');
                }
                else{
                    return true
                }
            }
        },
},
    units:{
        notEmpty:{
            errorMessage:'units must required'
        },
        isInt:{
            options:{min:1,max:9},
            errorMessage:'max u can req 9 units and min u can req is 1 unit '
        },
        trim:true
    },
    date:{
        notEmpty:{
            errorMessage:'date cannot be empty'
        },
        isDate:{
            errorMessage:'date should be in a valid format'
        },
        custom:{
            options:async function(value)
            {
                const givenDate = new Date(value); 
                const todayDate = new Date(); 

                const givenYear = givenDate.getFullYear();
                const givenMonth = givenDate.getMonth();
                const givenDay = givenDate.getDate();

                const todayYear = todayDate.getFullYear();
                const todayMonth = todayDate.getMonth();
                const todayDay = todayDate.getDate();

        if (givenYear < todayYear || givenYear === todayYear && givenMonth < todayMonth || givenYear === todayYear && givenMonth === todayMonth && givenDay < todayDay) 
        {
            throw new Error('Please enter a valid date for the blood request.')
        }
    }
}
    },
    atendeePhNumber:{
        notEmpty:{
           errorMessage:'phNo cannot be empty'
        },
        custom:{
            options:async function(value)
            { 
                if(value.length !==10 || isNaN(Number(value)))
                {
                   throw new Error('invalid phone number')
                }
            }
        }
    },
    critical:{
        notEmpty:{
            errorMessage:'the condition cannot be empty'
        },
        isIn:{
            options:[['yes','no']]
        }
    },

    requestType:{
        notEmpty:{
            errorMessage:'the request type is needed'
        },
        isIn:{
            options:[['user','bloodbank','both']]
        }
    },
    donationAddress: {
        custom: {
            options: function (value) {
                if (!value || !value.building || !value.locality || !value.city || !value.state || !value.pincode || !value.country) {
                    throw new Error('Building, locality, city, state, pincode, and country fields are required');
                } else {
                    return true;
                }
            }
        }
}
}
module.exports=bloodRequestValidationSchema