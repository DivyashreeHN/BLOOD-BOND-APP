require('dotenv').config()
const mongoose=require('mongoose')
const express=require('express')
const cors=require('cors')
const {checkSchema}=require('express-validator')
const app=express()
const axios=require('axios')
const port=3080
app.use(express.json())
app.use(cors())


//DB CONNECTION
const configureDB=require('./config/db')
configureDB()
 

//1)***(CONTROLLERS)***//

//IMPORTING USER-CONTROLLER
const userCltr=require('./app/controllers/users-controller')
//IMPORTING BLOOD-REQUEST-CONTROLLER
const bloodRequestCltr=require('./app/controllers/blood-request-controller')
//IMPORTING USERPROFILE-CONTROLLER
const userProfilecltr=require('./app/controllers/users-profile-controller')
const bloodBankCtrlr=require('./app/controllers/bloodBankController')
const bloodInventoryCtrlr=require('./app/controllers/bloodInventoryController')

//2)***(VALIDATORS)***//

//IMPORTING BLOOD-REQUEST-VALIDATION-SCHEMA
const bloodRequestValidationSchema=require('./app/validators/bloodRequest-validation-schema')
//IMPORTING USER-VALIDATION-SCHEMA
const {userRegisterValidationSchema,userLoginValidationSchema}=require('./app/validators/user-validation-schema')
//IMPORTING USERPROFILE-VALIDATION-SCEHMA
const userProfileValidationSchema=require('./app/validators/userProfile-validation-schema')
//IMPORTING REVIEW VALIDATION-SCHEMA
const reviewValidationSchema=require('./app/validators/review-validation-schema')
const {bloodBankValidationSchema,approvalStatusValidationSchema}=require('./app/validators/bloodBankValidations')
const bloodInventoryValidationSchema=require('./app/validators/bloodInventoryValidations')


//IMPORTING RESPONSE VALIDATION-SCHEMA

const responseValidationSchema=require('./app/validators/responseValidation')

//IMPORTING RESPONSE CONTROLLER

const responseCtrl=require('./app/controllers/response-controller')


//3)***(AUTHENTICATION && AUTHORIZATION)***//

//IMPORTING AUTHENTICATION AND AUTHORIZATION
const {authenticateUser,authorizeUser}=require('./app/middlewares/auth')
const upload=require('./app/middlewares/multer')


//4)***(ROUTERS)***//

//ROUTE FOR USER-REGISTER AND LOGIN AND ACCOUNT
app.post('/api/user/register',checkSchema(userRegisterValidationSchema),userCltr.register)
app.post('/api/user/login',checkSchema(userLoginValidationSchema),userCltr.login)
app.get('/api/user/account',authenticateUser,userCltr.account)

//ROUTE FOR USER-PROFILE(CRUD)
app.post('/api/user/profile',authenticateUser,authorizeUser(['user']),checkSchema(userProfileValidationSchema),userProfilecltr.create)
app.get('/api/user/profiles',authenticateUser,authorizeUser(['admin']),userProfilecltr.display)
app.get('/api/user/profile',authenticateUser,authorizeUser(['user']),userProfilecltr.show)
app.delete('/api/user/profile/:id',authenticateUser,authorizeUser(['user']),userProfilecltr.delete)
app.put('/api/user/profile/:id',authenticateUser,authorizeUser(['user']),checkSchema(userProfileValidationSchema),userProfilecltr.update)

//ROUTE FOR BLOOD-REQUEST(CRUD)
app.post('/api/blood/request',authenticateUser,authorizeUser(['user']),checkSchema(bloodRequestValidationSchema),bloodRequestCltr.create)
app.get('/api/blood/request',authenticateUser,authorizeUser(['user']),bloodRequestCltr.display) //this is for particular user who loges in[address]
app.get('/api/blood/request/list',authenticateUser,authorizeUser(['user']),bloodRequestCltr.list) //this is for the request type is user
app.get('/api/blood/request',authenticateUser,authorizeUser(['bloodbank'])) // this is for bloodrequest for particular bloodbank who loges in[address]
app.get('/api/blood/request/list'),authenticateUser,authorizeUser(['bloodbank']) //this is for request type is bloodbank[doubt]
app.put('/api/blood/request/:id',authenticateUser,authorizeUser(['user']),checkSchema(bloodRequestValidationSchema),bloodRequestCltr.update)
app.delete('/api/blood/request/:id',authenticateUser,authorizeUser(['user']),bloodRequestCltr.delete)

//For Admin
app.get('/api/blood/requests',authenticateUser,authorizeUser(['admin']),bloodRequestCltr.admin)

//ROUTES FOR BLOODBANK MODEL
app.post('/api/bloodbanks',authenticateUser,authorizeUser(['bloodbank']),upload.fields([{name:'license',maxCount:1},{name:'photos',maxCount:4}]),checkSchema(bloodBankValidationSchema),bloodBankCtrlr.create)
app.get('/api/bloodbanks/pending',authenticateUser,authorizeUser(['admin']),bloodBankCtrlr.listForApproval)
app.put('/api/bloodbanks/pending/:id',authenticateUser,authorizeUser(['admin']),checkSchema(approvalStatusValidationSchema),bloodBankCtrlr.toApprove)
app.get('/api/bloodbanks/show/:id',authenticateUser,authorizeUser(['admin','user','bloodbank']),bloodBankCtrlr.show)
app.get('/api/bloodbanks/list',authenticateUser,authorizeUser(['admin','user']),bloodBankCtrlr.listAll)
app.get('/api/bloodbanks/display',authenticateUser,authorizeUser(['bloodbank']),bloodBankCtrlr.display)
app.delete('/api/bloodbanks/remove/:id',authenticateUser,authorizeUser(['admin','bloodBank']),bloodBankCtrlr.delete)

//Route for getting bloodbank req for bloodbank
app.get('/api/bloodbanks/request',authenticateUser,authorizeUser(['bloodbank']),bloodRequestCltr.list)

//ROUTES FOR BLOOD INVENTORY MODEL
app.post('/api/bloodinventries/:id',authenticateUser,authorizeUser(['bloodbank']),checkSchema(bloodInventoryValidationSchema),bloodInventoryCtrlr.create)

//RESPONSE added by admin

app.post('/api/response',authenticateUser,authorizeUser(['admin']),checkSchema(responseValidationSchema),responseCtrl.createByAdmin)

//RESPONSE EDITTED BY USER 

app.put('/api/response/:id',authenticateUser,authorizeUser(['user']),checkSchema(responseValidationSchema),responseCtrl.userResponse)

app.listen(port,()=>
{
    console.log('Blood-Bond-App is successfully running on the port',port)
})