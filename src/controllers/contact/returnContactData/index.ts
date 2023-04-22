import { NextFunction, Request, Response } from "express";
import { iContactData, iReturnObject } from "../../../@types/myTypes";
import returnContactData from "../../../services/contact/returnContactData";

export default async function returnContactDataController(req: Request<{ phone: string }>, res: Response, next?: NextFunction) {
    let { phone } = req.params
    let serviceResult: iReturnObject
    try {
        serviceResult = await returnContactData({ phone })
        let contactData = getContactData(serviceResult)
        res.status(Number(contactData.statusCode)).json({ ...contactData })
    } catch (err: any) {
        let errToBeThrown = new Error
        errToBeThrown.name = err.name
        errToBeThrown.message = err.message

        let errorStatusCode = errToBeThrown.name == "ERR_CONTACT_NOT_EXISTS" ? 404 : 500
        res.status(errorStatusCode).json({ error: errToBeThrown })
    }

}

function getContactData(serviceResult: iReturnObject): iContactData {
    if (!serviceResult.success) {
        throw serviceResult.error
    } else {
        if (serviceResult.contactData?.address) {
            return {
                statusCode: 200,
                ...serviceResult.contactData
            }
        } else {
            return {
                statusCode: 206,
                phone: String(serviceResult.contactData?.phone),
                name: String(serviceResult.contactData?.name),
                registered: Boolean(serviceResult.contactData?.registered)
            }
        }
    }
}