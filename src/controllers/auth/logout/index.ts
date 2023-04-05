import { Request, Response, NextFunction } from "express";
import { iReturnObject, iReturnSeparateToken } from "../../../@types/myTypes";
import logout from "../../../services/auth/logout";


export default async function logoutController(req: Request, res: Response, next?: NextFunction) {
    let rawJWT: any = req.header('cookie')
    let separateToken = returnSeparateToken(rawJWT, "JWT")

    if (separateToken.tokenExists) {
        await logout({ token: String(separateToken.separateToken) })
    }

    res.clearCookie('JWT')
    res.status(200).send()
}

function returnSeparateToken(fullCookie: String, tokenName: String): iReturnSeparateToken {
    let returnValue: iReturnSeparateToken = {
        tokenExists: false
    }
    let value = `; ${fullCookie}`;
    let parts = value.split(`; ${tokenName}=`);

    if (parts.length === 2) {
        let token = String(String(parts.pop()).split(';').shift());
        returnValue = {
            tokenExists: true,
            separateToken: token
        }
    }

    return returnValue
}
