import { NextFunction, Request, Response } from "express";
import { iAppendedFile, iReturnObject, iSendMessageController } from "../../../@types/myTypes";
import sendMessage from "../../../services/chat/sendMessage";
import deleteMedia from "../../../utils/deleteMedia";
const path = require('path');
const fs = require('fs');

export default async function sendMessageController(req: Request<{}, {}, iSendMessageController>, res: Response, next: NextFunction) {
    let requestedFile: iAppendedFile | undefined = req.file
    let { chat, sender, type, content } = req.body

    let serviceResult: iReturnObject = await sendMessage(
        {
            chat,
            sender,
            message: {
                type,
                content,
                filename: requestedFile?.filename
            }
        }
    )


    if (serviceResult.success) {
        res.status(200).send()
    } else {
        await deleteMedia(requestedFile?.filename, 'talks')
        let statusCode = returnStatusCode(String(serviceResult.error?.name))
        res.status(statusCode).send({ error: serviceResult.error })
    }

}

function returnStatusCode(errorName: string): number {
    switch (errorName) {
        case 'ERR_CHAT_NOT_EXISTS':
            return 404
        case 'ERR_CHAT_INVALID':
            return 403
        default:
            return 500
    }
}