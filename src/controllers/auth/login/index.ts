import { Request, Response, NextFunction } from "express";
import 'dotenv/config'
const jwt = require('jsonwebtoken')

import login from "../../../../src/services/auth/login"
import { iAuthRequestBody, iReturnObject } from "../../../@types/myTypes";

export default async function loginController(req: Request<{}, {}, iAuthRequestBody>, res: Response, next?: NextFunction): Promise<void> {
    var result: iReturnObject
    const { usid, password } = req.body
    result = await login({
        usid,
        password
    })

    switch (result.success) {
        case true:
            if (result.hasRows === true) {
                const token = jwt.sign({ usid: usid, sessionID: result.sessionID },
                    process.env.JWT_SECRET,
                    {}
                )
                res.status(200).cookie("JWT", token, {
                    path: "/",
                    httpOnly: true
                }).send()
            } else {
                res.status(404).json({ wrongInput: result.wrongInput })
            }
            break;
        case false:
            res.status(500).json({ error: result.error })
            break

    }
} 