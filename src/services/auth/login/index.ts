import { iLoginParams, iReturnObject, iReturnValidateUser } from "../../../@types/myTypes";
const bcrypt = require('bcrypt');
const user = require('../../../database/models/').tb_user

export default async function login(params: iLoginParams) {
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
            if (queryResult === null) {
                let returnValidateUser: iReturnValidateUser = {
                    isValid: false,
                    wrongInput: "usid"
                }
                return returnValidateUser
            }
            else {
                let returnedPasswordHash = queryResult.password
                let isValid: boolean = bcrypt.compareSync(password, returnedPasswordHash);
                let returnValidateUser: iReturnValidateUser = {
                    isValid,
                    wrongInput: isValid ? null : "password"
                }
                return returnValidateUser
            }
        })
        .catch((err: Error) => {
            const errorToBeThrown = new Error
            errorToBeThrown.message = err.message
            errorToBeThrown.name = err.name
            throw errorToBeThrown
        })
    return result
}