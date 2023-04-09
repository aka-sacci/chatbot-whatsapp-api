import { iLoginParams, iReturnObject, iReturnValidateUser } from "../../../@types/myTypes";
const bcrypt = require('bcrypt');
const user = require('../../../database/models/').tb_user
const session = require('../../../database/models/').tb_sessions

export default async function login (params: iLoginParams) {
    const { usid, password } = params
    let returnObject: iReturnObject;
    try {
        const isUserValid = await validateUser({ usid, password })
        if (isUserValid.isValid === false) returnObject = {
            success: true,
            hasRows: false,
            wrongInput: isUserValid.wrongInput
        }
        else returnObject = {
            success: true,
            hasRows: true,
            sessionID: isUserValid.sessionID
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

async function validateUser(params: iLoginParams): Promise<iReturnValidateUser> {
    let { password, usid } = params
    const result = await user
        .findOne({
            where: {
                usid: usid
            }
        })
        .then((queryResult: any) => {
            return queryResult
        })

        .catch((err: Error) => {
            const errorToBeThrown = new Error
            errorToBeThrown.message = err.message
            errorToBeThrown.name = err.name
            throw errorToBeThrown
        })

    const returnObject: iReturnValidateUser = await defineReturnObject(result, usid, password)
    return returnObject


}


async function defineReturnObject(result: any, usid: string, password: string): Promise<iReturnValidateUser> {
    let returnValidateUser: iReturnValidateUser;
    switch (result) {
        case null:
            returnValidateUser = {
                isValid: false,
                wrongInput: "usid"
            }
            return returnValidateUser
        default:
            let returnedPasswordHash = result.password
            let isValid: boolean = bcrypt.compareSync(password, returnedPasswordHash)
            if (isValid) {
                await killOpenSession(usid)
                let sessionID = await openNewSession(usid)
                return returnValidateUser = {
                    isValid: true,
                    wrongInput: null,
                    sessionID
                }
            }
            else {
                return returnValidateUser = {
                    isValid: false,
                    wrongInput: 'password'
                }
            }
    }

}

async function killOpenSession(usid: string): Promise<void> {
    await session
        .update({ status: 2, active: 0 },
            {
                where: {
                    status: 1,
                    user: usid
                }
            })
        .then()
        .catch((err: Error) => {
            const errorToBeThrown = new Error
            errorToBeThrown.message = err.message
            errorToBeThrown.name = err.name
            throw errorToBeThrown
        })
    return session
}

async function openNewSession(usid: string): Promise<string> {
    const result = await session
        .create({
            status: 1,
            user: usid,
            active: 1
        })
        .then((res: any) => {
            return res.id
        })
        .catch((err: Error) => {
            const errorToBeThrown = new Error
            errorToBeThrown.message = err.message
            errorToBeThrown.name = err.name
            throw errorToBeThrown
        })
    return result
}