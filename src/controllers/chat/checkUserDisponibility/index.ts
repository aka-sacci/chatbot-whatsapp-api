import { NextFunction, Request, Response } from "express";
import { iReturnObject } from "../../../@types/myTypes";
import checkUserDisponibility from "../../../services/chat/checkUserDisponibility";

export default async function checkUserDisponibilityController(req: Request, res: Response, next?: NextFunction) {
    let serviceResult: iReturnObject = await checkUserDisponibility()
    switch (serviceResult.success) {
        case true:
            res.status(200).json({ sessionID: serviceResult.sessionID })
            break
        case false:
            serviceResult.error?.name === "ERR_NO_USERS_AVALIABLE" ?
                res.status(404).json({ error: serviceResult.error }) :
                res.status(500).json({ error: serviceResult.error })
            break
    }
}