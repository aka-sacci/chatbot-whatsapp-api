import { NextFunction, Request, Response } from "express";
import { iReturnObject } from "../../../@types/myTypes";
import createChat from "../../../services/chat/createChat";

export default async function createChatController(req: Request<{ sessionID: number, contact: string }>, res: Response, next?: NextFunction) {
    let { sessionID, contact } = req.params
    let serviceResult: iReturnObject = await createChat({ sessionID, contact })

    switch (serviceResult.success) {
        case true:
            let { chatID } = serviceResult
            res.status(201).json({ chatID })
            break;
        case false:
            let { error } = serviceResult
            res.status(500).json({ error })
            break;
        default:
            res.status(500).json({ error })
            break;
    }

}