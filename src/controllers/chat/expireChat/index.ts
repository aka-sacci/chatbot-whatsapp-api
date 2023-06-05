import { NextFunction, Request, Response } from "express";
import { iExpireChatProps } from "../../../@types/myTypes";
import expireChat from "../../../services/chat/expireChat";

export default async function expireChatController(req: Request<iExpireChatProps>, res: Response, next?: NextFunction) {
    const { chatID, expiredBy } = req.params
    const serviceResult = await expireChat({
        chatID,
        expiredBy
    })

    switch (serviceResult.success) {
        case true:
            res.status(200).send()
            break
        case false:
            let statusCode = serviceResult.error?.name === "ERR_CHAT_NOT_EXISTS" ? 404 : 500
            res.status(statusCode).json({ error: serviceResult.error })
            break
        default:
            let err = new Error
            err.name = 'ERR_UNKNOW'
            err.message = "Service 'expireChat' returned a unknown error!"
            res.status(500).json({ error: err })
    }
}