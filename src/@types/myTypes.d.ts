import { Request, Response, NextFunction } from 'express'

export interface iControllerParams {
    req: Request,
    res: Response,
    next?: NextFunction
}

export interface iLoginParams {
    usid: string,
    password: string
}

export interface iReturnValidateUser {
    isValid: boolean,
    wrongInput: null | "password" | "usid"
}

export interface iUser {
    
    usid: string,
    password: string,
    name: string,
    role: Number,
}

export interface iMockData {
    async insert(connection: any): Promise<void>
    async delete(connection: any): Promise<void>
}

export interface iReturnObject {
    success: boolean,
    hasRows?: boolean,
    message?: string,
    quoteData?: object | number,
    qtd?: object
    error?: Error,
    wrongInput?: string | null
}

export interface iAuthRequestBody {
    usid: string, 
    password: string
}