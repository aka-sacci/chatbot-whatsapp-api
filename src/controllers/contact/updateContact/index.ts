import { NextFunction, Request, Response } from "express";
import { iContactData } from "../../../@types/myTypes";
import updateContact from "../../../services/contact/updateContact";

export default async function updateContactController(req: Request<{}, {}, iContactData>, res: Response, next?: NextFunction) {
    let serviceResponse = await updateContact(req.body)
    if (serviceResponse.success) {
        res.status(200).send()
    } else {
        let statusCode
        serviceResponse.error?.name === "ERR_CONTACT_INVALID" ? statusCode = 404 : statusCode = 500
        res.status(statusCode).json({ error: serviceResponse.error })
    }
}