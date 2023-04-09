import { iReturnObject, iDecodedJWT } from "../../../@types/myTypes";
import jwt from "jsonwebtoken";
const session = require('../../../database/models/').tb_sessions

export default async function logout(params: { token: string }): Promise<iReturnObject> {
    const { token } = params
    let returnObject: iReturnObject;
    let sessionID = 0;
    try {

        jwt.verify(token, String(process.env.JWT_SECRET), (err: any, decoded: iDecodedJWT | any) => {
            if (err) {
                const tokenError = new Error()
                tokenError.message = err.message
                tokenError.name = err.name
                throw tokenError
            } else {
                sessionID = Number(decoded.sessionID)
            }
        })

        await expireSession(sessionID)
        returnObject = {
            success: true
        }
        return returnObject
    } catch (err: any) {
        return {
            success: false,
            error: {
                ...err
            }
        }
    }
}

async function expireSession(sessionID: number): Promise<boolean> {
    const result = session
        .update(
            {
                status: 2, 
                active: 0
            },
            {
                where: {
                    id: sessionID
                }
            })
        .then((queryResult: any) => {
            switch (queryResult.status) {
                case 2:
                    return true
                case 1:
                    const errorToBeThrown = new Error
                    errorToBeThrown.message = "Session was not been expired!"
                    errorToBeThrown.name = "SessionNotExpired"
                    throw errorToBeThrown
            }
        }).catch((err: Error) => {
            const errorToBeThrown = new Error
            errorToBeThrown.message = err.message
            errorToBeThrown.name = err.name
            throw errorToBeThrown
        })
    return result
}
