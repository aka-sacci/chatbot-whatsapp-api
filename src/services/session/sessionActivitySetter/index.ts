import { iReturnObject, iSessionActivitySetter } from "../../../@types/myTypes";
const bcrypt = require('bcrypt');
const session = require('../../../database/models/').tb_sessions

export default async function sessionActivitySetter(params: iSessionActivitySetter): Promise<iReturnObject> {
    let { sessionID, sessionNewStatus } = params
    let returnObject: iReturnObject

    try {
        let isSeessionValid = await checkIfSessionIsValid(sessionID)
        if (isSeessionValid) {
            await changeSessionActiveStatus(sessionID, sessionNewStatus)
            returnObject = {
                success: true,
                sessionNewStatus
            }
        } else {
            let returnedError = new Error()
            returnedError.name = "ERR_INVALID_SESSION"
            returnedError.message = 'Cannot change the status of a expired session!'
            returnObject = {
                success: false,
                error: returnedError
            }
        }
    } catch (err: any | Error) {
        let returnedError = new Error()
        returnedError.name = err.name
        returnedError.message = err.message
        returnObject = {
            success: false,
            error: returnedError
        }
    }

    return returnObject
}

async function checkIfSessionIsValid(sessionID: number): Promise<boolean> {
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
        })
    return result
}

async function changeSessionActiveStatus(sessionID: number, newActiveStatus: number): Promise<void> {
    await session
        .update(
            {
                active: newActiveStatus
            },
            {
                where: {
                    id: sessionID
                }
            })
        .then((queryResult: any) => {
            switch (queryResult.status) {
                case !sessionID:
                    const errorToBeThrown = new Error
                    errorToBeThrown.message = "Session was not been expired!"
                    errorToBeThrown.name = "SessionNotExpired"
                    throw errorToBeThrown
            }
        })
}