import { Request, Response, NextFunction } from "express";

export default async function logoutController(req: Request, res: Response, next?: NextFunction) {
    res.clearCookie('JWT')
    res.status(200).send()
}