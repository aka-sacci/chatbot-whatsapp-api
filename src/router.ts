import { Router, Request, Response, NextFunction } from "express";
import isAuthedController from "./controllers/auth/isAuthed";
import loginController from "./controllers/auth/login";
import logoutController from "./controllers/auth/logout";
import sessionActivitySetterController from "./controllers/session/sessionActivitySetter";
import sessionActivityGetterController from "./controllers/session/sessionActivityGetter";
import checkContactRegisterController from "./controllers/contact/checkContactRegister";
import returnContactDataController from "./controllers/contact/returnContactData";
import registerContactController from "./controllers/contact/registerContact";
import updateContactController from "./controllers/contact/updateContact";
import checkUserDisponibilityController from "./controllers/chat/checkUserDisponibility";
//import { iController } from "./@types/myTypes";


const router = Router()

//CONTROLLERS


//TEST ROUTE
router.get('/test', (req: Request, res: Response) => {
    res.status(200).json({header: "teste"})
})

//GET QUOTES ROUTE
//router.get('/getquotes/:quote', GetQuotesController.handle)

router.post('/auth/login', loginController)

router.get('/auth/logout', logoutController)

router.get('/auth/isauthed', isAuthedController)

router.post('/session/sessionactivitysetter', sessionActivitySetterController)

router.post('/session/sessionactivitygetter', sessionActivityGetterController)

router.get('/contact/checkcontactregister/:phone', checkContactRegisterController)

router.get('/contact/returncontactdata/:phone', returnContactDataController)

router.post('/contact/registercontact', registerContactController)

router.post('/contact/updatecontact', updateContactController)

router.get('/chat/checkuserdisponibility', checkUserDisponibilityController)

exports.router = router