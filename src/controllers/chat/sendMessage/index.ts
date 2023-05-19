import { NextFunction, Request, Response } from "express";
import { iAppendedFile, iReturnObject, iSendMessageController } from "../../../@types/myTypes";
import sendMessage from "../../../services/chat/sendMessage";
import { stringify } from "querystring";
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
        await deleteMedia(requestedFile?.filename)
        let statusCode = returnStatusCode(String(serviceResult.error?.name))
        res.status(statusCode).send({ error: serviceResult.error })
    }

}

async function deleteMedia(mediaSrc: string | undefined) {

    if (mediaSrc != undefined) {
        let mediaPath = path.join(process.cwd(), '/src/assets/talks/' + mediaSrc)
        await fs.unlink(mediaPath, () => {
            return
        });
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