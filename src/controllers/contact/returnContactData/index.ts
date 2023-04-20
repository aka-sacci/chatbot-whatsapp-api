import { NextFunction, Request, Response } from "express";
import { iReturnObject } from "../../../@types/myTypes";
import returnContactData from "../../../services/contact/returnContactData";

export default async function returnContactDataController(req: Request<{ phone: string }>, res: Response, next?: NextFunction) {
    let { phone } = req.params
    let serviceResult: iReturnObject
    try {
        serviceResult = await returnContactData({ phone })
    } catch (err: any) {

    }

    res.sendStatus(200)
}