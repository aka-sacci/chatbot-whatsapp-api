import { Request, Response, NextFunction } from 'express'
import { isMapIterator } from 'util/types'

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
    wrongInput: null | "password" | "usid",
    sessionID?: string
}

export interface iUser {

    usid: string,
    password: string,
    name: string,
    role: Number,
    store: Number
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
    wrongInput?: string | null,
    sessionID?: string | null,
    sessionNewStatus?: number,
    isSessionActive?: boolean,
    contactExists?: boolean,
    contactData?: iContactData,
    contactID?: number,
    userID?: string,
    chatID?: number
}

export interface iRequestSession {
    sessionNewStatus: number
}

export interface iAuthRequestBody {
    usid: string,
    password: string
}

export interface iReturnSeparateToken {
    tokenExists: boolean,
    separateToken?: String
}

export interface iSessionActivitySetter {
    sessionID: number,
    sessionNewStatus: number
}

export interface iDecodedJWT {
    usid: string,
    sessionID: number,
}

export interface iExecuteChange {
    statusCode: number,
    message: null | string
}

export interface iSessionActivityGetter {
    sessionID: number
}

export interface iGetActivityStatus {
    statusCode: number,
    active?: boolean,
    message?: null | string
}

export interface iContactAddress {
    id?: number | null
    street: string,
    number: number,
    district: string,
    cep: number,
    complement?: string
}

export interface iCheckContactRegister {
    phone: string
}

export interface iContactData {
    phone: string,
    name: string,
    registered: boolean,
    address?: iContactAddress,
    statusCode?: number
}

export interface iSession {
    id: string,
    status: number,
    user: string,
    active: boolean,
    createdAt: string,
    updatedAt: string
}

export interface iOpenedChatsByUser {
    user: string,
    openedChats: number,
    activeSession: string
}

export interface iMessage {
    id?: number
    type: 'chat' | 'image' | 'audio' | 'video' | 'sticker' | 'ptt' | 'reply' | 'document';
    content: string,
    filename?: string
}

export interface iAppendedFile {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    path: string,
    size: number
}

export interface iSendMessageController {
    talkID: string,
    chat: number,
    sender: number,
    type: 'chat' | 'image' | 'audio' | 'video' | 'sticker' | 'ptt' | 'reply' | 'document';
    content: string,
    filename?: string,
    replyTo?: string
}

export interface iCreateChatController {
    sessionID: number,
    contact: string
}

export interface iExpireChatProps {
    chatID: number, 
    expiredBy: "inactivity" | "user" | "contact"
}