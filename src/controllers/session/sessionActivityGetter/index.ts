import { NextFunction, Request, Response } from "express";
import returnSeparateToken from "../../../utils/returnSeparateToken";
import jwt from 'jsonwebtoken'
import { iDecodedJWT, iReturnObject, iGetActivityStatus } from "../../../@types/myTypes";
import sessionActivityGetter from "../../../services/session/sessionActivityGetter";

export default async function sessionActivityGetterController(req: Request, res: Response, next?: NextFunction) {
    let rawCookie: any = req.header('cookie')
    let separateToken = returnSeparateToken(rawCookie, "JWT")
    let mySession = 0;
    let tokenError = new Error

    if (separateToken.tokenExists) {
        jwt.verify(String(separateToken.separateToken), String(process.env.JWT_SECRET), (err: any, decoded: iDecodedJWT | any) => {
            if (err) {
                tokenError.name = err.name;
                tokenError.message = err.message;
                res.status(400).json({ error: tokenError })

            } else {
                mySession = Number(decoded.sessionID)
            }
        })
    }

    if (!res.headersSent) {
        let result: iGetActivityStatus = await getActivityStatus(mySession)
        res.status(result.statusCode).json({
            error: result.message,
            isSessionActive: result.active
        })
    }
}

async function getActivityStatus(sessionID: number): Promise<iGetActivityStatus> {
    let activityStatus: iGetActivityStatus = {
        statusCode: 0
    }

    await sessionActivityGetter({
        sessionID
    }).then((serviceData: iReturnObject) => {
        switch (serviceData.success) {
            case true:
                return activityStatus = {
                    statusCode: 200,
                    active: serviceData.isSessionActive
                }
            case false:
                let errorToBeThrown = new Error
                errorToBeThrown.name = String(serviceData.error?.name)
                errorToBeThrown.message = String(serviceData.error?.message)
                throw errorToBeThrown
        }
    })
        .catch((err: Error) => {
            activityStatus = {
                statusCode: 500,
                message: String(err)
            }
        })

    return activityStatus
}