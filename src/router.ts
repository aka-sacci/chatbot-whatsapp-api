import { Router, Request, Response, NextFunction } from "express";
import isAuthedController from "./controllers/auth/isAuthed";
import loginController from "./controllers/auth/login";
import logoutController from "./controllers/auth/logout";
import sessionActivitySetterController from "./controllers/session/sessionActivitySetter";
import sessionActivityGetterController from "./controllers/session/sessionActivityGetter";
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

exports.router = router