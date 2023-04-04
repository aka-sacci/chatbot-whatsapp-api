import { Request, Response, NextFunction } from "express";
import { iReturnObject } from "../../../@types/myTypes";
import logout from "../../../services/auth/logout";

export default async function logoutController(req: Request, res: Response, next?: NextFunction) {
    let rawJWT: any = req.header('cookie')

    
    //const value = `; ${rawJWT}`;
    //let parts = value.split(`; "JWT"=`);
    //if (parts.length === 2) return parts.pop().split(';').shift();
     
    //let cleanedJWT = String(rawJWT?.substring(4))
    //var result: iReturnObject
    //result = await logout({ token: cleanedJWT })
    res.clearCookie('JWT')
    res.status(200).send()
}
