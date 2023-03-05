import { iReturnObject, iReturnValidateUser } from "../../../@types/myTypes";
import jwt from "jsonwebtoken";
import 'dotenv/config'

export default async function isAuthed(params: { token: string }): Promise<iReturnObject> {
    let returnObject: iReturnObject = {
        success: false
    };
    const { token } = params
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
            returnObject = { success: true }
        }
    })

    return returnObject
}