import { Request, Response, NextFunction } from "express";
import { iReturnObject } from "../../../@types/myTypes";
import isAuthed from "../../../services/auth/isAuthed";

export default async function isAuthedController(req: Request, res: Response, next?: NextFunction): Promise<void> {
    var result: iReturnObject
    const token = req.cookies['JWT']
    if (token != undefined) {
        result = await isAuthed({
            token
        })

        switch (result.success) {
            case true:
                res.status(200).send()
                break;
            case false:
                res.clearCookie('JWT')
                res.status(403).send()
                break
        }
    } else {
        res.clearCookie('JWT')
        res.status(401).send()
    }
}