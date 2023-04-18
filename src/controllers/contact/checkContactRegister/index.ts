import { NextFunction, Request, Response } from "express";
import { iReturnObject } from "../../../@types/myTypes";
import checkContactRegister from "../../../services/contact/checkContactRegister";

export default async function checkContactRegisterController(req: Request<{ phone: string }>, res: Response, next: NextFunction) {
    let { phone } = req.params
    let serviceResult: iReturnObject

    serviceResult = await checkContactRegister({
        phone
    })

    switch (serviceResult.success) {
        case true:
            let resCode = serviceResult.contactExists ? 200 : 404
            return res.status(resCode).send()
        case false:
            return res.status(500).send({ error: serviceResult.error })
    }
}