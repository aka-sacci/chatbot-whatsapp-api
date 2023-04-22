import { Router, Request, Response, NextFunction } from "express";
import isAuthedController from "./controllers/auth/isAuthed";
import loginController from "./controllers/auth/login";
import logoutController from "./controllers/auth/logout";
import sessionActivitySetterController from "./controllers/session/sessionActivitySetter";
import sessionActivityGetterController from "./controllers/session/sessionActivityGetter";
import checkContactRegisterController from "./controllers/contact/checkContactRegister";
import returnContactDataController from "./controllers/contact/returnContactData";
//import { iController } from "./@types/myTypes";


const router = Router()

//CONTROLLERS


//TEST ROUTE
router.get('/test', (req: Request, res: Response) => {
    res.status(200).json({header: "teste"})
})

//GET QUOTES ROUTE
//router.get('/getquotes/:quote', GetQuotesController.handle)

//Login Route
router.post('/auth/login', loginController)

//Logout Route
router.get('/auth/logout', logoutController)

//IsAuthed Route
router.get('/auth/isauthed', isAuthedController)

//SessionActivitySetter route
router.post('/session/sessionactivitysetter', sessionActivitySetterController)

//SessionActivityGetter route
router.post('/session/sessionactivitygetter', sessionActivityGetterController)

router.get('/contact/checkcontactregister/:phone', checkContactRegisterController)

router.get('/contact/returncontactdata/:phone', returnContactDataController)

exports.router = router