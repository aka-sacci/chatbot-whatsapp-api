import { NextFunction, Request, Response } from "express";
import { iContactData } from "../../../@types/myTypes";
import registerContact from "../../../services/contact/registerContact";

export default async function registerContactController(req: Request<{}, {}, iContactData>, res: Response, next?: NextFunction) {
    let serviceResponse = await registerContact(req.body)
    if (serviceResponse.success === true) {
        if (req.body.address) {
            res.status(200).send()
        } else {
            res.status(206).send()
        }
    } else {
        if (serviceResponse.error?.name === "ERR_CONTACT_ALREADY_EXISTS") {
            res.status(406).json({ error: serviceResponse.error })
        } else {
            res.status(500).json({ error: serviceResponse.error })
        }
    }

}