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
import createChatController from "./controllers/chat/createChat";
import sendMessageController from "./controllers/chat/sendMessage";
import expireChatController from "./controllers/chat/expireChat";
//import { iController } from "./@types/myTypes";


const router = Router()
const multer = require('multer')
const path = require('path');

//Upload Middlewares
//talk middleware
const talkMediaStorage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: Function) {
        cb(null, './src/assets/talks');
    },
    filename: function (req: Request, file: any, cb: Function) {
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const newName = uniqueSuffix + extension;
        cb(null, newName);
    }
})
const talkMediaUpload = multer({ storage: talkMediaStorage })

const userPhotoStorage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: Function) {
        cb(null, './src/assets/users/profilePics/')
    },
    filename: function (req: Request, file: any, cb: Function) {
        const extension = path.extname(file.originalname);
        const contactPhone = req.body.contact
        const fullName = contactPhone + extension
        cb(null, fullName)
    }
})

const userPhotoUpload = multer({ storage: userPhotoStorage })

//CONTROLLERS
//TEST ROUTE
router.get('/test', (req: Request, res: Response) => {
    res.status(200).json({ header: "teste" })
})


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

router.post('/chat/createchat', userPhotoUpload.single('userPhoto'), createChatController)

router.post('/chat/sendmessage', talkMediaUpload.single('file'), sendMessageController)

router.get('/chat/expirechat/:chatID/:expiredBy', expireChatController)

exports.router = router