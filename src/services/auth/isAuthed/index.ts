import { iReturnObject, iReturnValidateUser } from "../../../@types/myTypes";
import jwt from "jsonwebtoken";
import 'dotenv/config'
const session = require('../../../database/models/').tb_sessions

export default async function isAuthed(params: { token: string }): Promise<iReturnObject> {
    let returnObject: iReturnObject = {
        success: false
    };
    const { token } = params
    let sessionID = 0;

    jwt.verify(token, String(process.env.JWT_SECRET), (err: any, decoded: any) => {
        if (err) {
            const tokenError = new Error()
            tokenError.message = err.message
            tokenError.name = err.name
            returnObject = {
                success: false,
                error: tokenError
            }

        } else {
            sessionID = Number(decoded.sessionID)
        }
    })
    if (sessionID != 0) {
        try {
            let isSessionValid = await checkIfSessionIsValid(sessionID)
            if (isSessionValid) {
                returnObject = { success: true }
            } else {
                const tokenError = new Error()
                tokenError.message = "Session is Expired!"
                tokenError.name = "SessionExpiredError"
                returnObject = {
                    success: false,
                    error: tokenError
                }
            }
        }
        catch (err: any) {
            returnObject = {
                success: false,
                error: err
            }
        }
    }

    return returnObject
}

async function checkIfSessionIsValid(sessionID: number): Promise<Boolean> {
    const result = session
        .findOne(
            {
                where: {
                    id: sessionID
                }
            })
        .then((queryResult: any) => {
            switch (queryResult.status) {
                case 1:
                    return true
                case 2:
                    return false
            }
        }).catch((err: Error) => {
            const errorToBeThrown = new Error
            errorToBeThrown.message = err.message
            errorToBeThrown.name = err.name
            throw errorToBeThrown
        })
    return result
}
