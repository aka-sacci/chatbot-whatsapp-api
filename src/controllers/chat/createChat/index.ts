import { NextFunction, Request, Response } from "express";
import { iAppendedFile, iCreateChatController, iReturnObject } from "../../../@types/myTypes";
import createChat from "../../../services/chat/createChat";
import deleteMedia from "../../../utils/deleteMedia";

export default async function createChatController(req: Request<{}, {}, iCreateChatController>, res: Response, next?: NextFunction) {
    let { sessionID, contact } = req.body
    let requestedFile: iAppendedFile | undefined = req.file
    let serviceResult: iReturnObject = await createChat({ sessionID, contact })

    switch (serviceResult.success) {
        case true:
            let { chatID } = serviceResult
            res.status(201).json({ chatID })
            break;
        case false:
            await deleteMedia(requestedFile?.filename, 'userPhotos')
            let { error } = serviceResult
            res.status(500).json({ error })
            break;
        default:
            await deleteMedia(requestedFile?.filename, 'userPhotos')
            res.status(500).json({ error })
            break;
    }

}