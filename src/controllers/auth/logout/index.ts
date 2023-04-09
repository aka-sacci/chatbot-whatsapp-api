import { Request, Response, NextFunction } from "express";
import logout from "../../../services/auth/logout";
import returnSeparateToken from "../../../utils/returnSeparateToken";


export default async function logoutController(req: Request, res: Response, next?: NextFunction) {
    let rawCookie: any = req.header('cookie')
    let separateToken = returnSeparateToken(rawCookie, "JWT")

    if (separateToken.tokenExists) {
        await logout({ token: String(separateToken.separateToken) })
    }

    res.clearCookie('JWT')
    res.status(200).send()
}
