import { NextFunction, Request, Response } from "express";
import returnSeparateToken from "../../../utils/returnSeparateToken";
import jwt from 'jsonwebtoken'
import { iDecodedJWT, iRequestSession, iReturnObject, iExecuteChange } from "../../../@types/myTypes";
import sessionActivitySetter from "../../../services/session/sessionActivitySetter";

export default async function sessionActivitySetterController(req: Request<{}, {}, iRequestSession>, res: Response, next?: NextFunction) {
    let { sessionNewStatus } = req.body
    let rawCookie: any = req.header('cookie')
    let separateToken = returnSeparateToken(rawCookie, "JWT")
    let mySession = 0;
    let tokenError = new Error

    if (separateToken.tokenExists) {
        jwt.verify(String(separateToken.separateToken), String(process.env.JWT_SECRET), (err: any, decoded: iDecodedJWT | any) => {
            if (err) {
                tokenError.name = err.name;
                tokenError.message = err.message;
                mySession = 0
            } else {
                mySession = Number(decoded.sessionID)
            }
        })
    }

    let result: iExecuteChange = await executeChange(mySession, sessionNewStatus, tokenError)

    res.status(result.statusCode).json({ error: result.message })

}

async function executeChange(sessionID: number, sessionStatusToChange: number, tokenError?: null | Error): Promise<iExecuteChange> {

    let returnObject: iExecuteChange = {
        statusCode: 0,
        message: ""
    }

    if (sessionID != 0) {
        await sessionActivitySetter({
            sessionID: sessionID,
            sessionNewStatus: sessionStatusToChange
        })
            .then((serviceData: iReturnObject) => {
                if (serviceData.success == true) {

                    let wasActivityChanged = checkIfActivityWasChanged(sessionStatusToChange, Number(serviceData.sessionNewStatus))

                    if (wasActivityChanged === true) {
                        returnObject = {
                            statusCode: 200,
                            message: null
                        }
                    }

                    else {
                        let sessionExpiredError = new Error
                        sessionExpiredError.name = "StatusNotChanged"
                        sessionExpiredError.message = "Your session was not changed!"
                        throw sessionExpiredError
                    }
                }
                else {
                    if (serviceData.error?.name == 'ERR_INVALID_SESSION') {
                        returnObject = {
                            statusCode: 403,
                            message: String(serviceData.error)
                        }
                    } else {

                        returnObject = {
                            statusCode: 500,
                            message: String(serviceData.error)
                        }
                    }
                }
            }).catch((err: Error) => {
                returnObject = {
                    statusCode: 400,
                    message: String(err)
                }
            })
    } else {
        returnObject = {
            statusCode: 400,
            message: String(tokenError)
        }
    }

    return returnObject
}

function checkIfActivityWasChanged(changeTo: number, changedTo: number) {
    return changeTo === changedTo ? true : false
}