import { NextFunction, Request, Response } from "express";

export default async function sendMessageController(req: Request, res: Response, next: NextFunction) {
    console.log(req.file);
    res.status(200).send('Upload de imagem realizado com sucesso');
}