import { iReturnObject } from "../../../@types/myTypes";
const sessions = require('../../../database/models/').tb_sessions
const chats = require('../../../database/models/').tb_chats
const chatsHistory = require('../../../database/models/').tb_chats_history

export default async function createChat(params: { sessionID: number, contact: string }): Promise<iReturnObject> {
    let { sessionID, contact } = params

    try {
        await getIfSessionExists(sessionID)
        let insertedChat = await insertChat(contact)
        await insertChatHistory(insertedChat, sessionID)
        return {
            success: true,
            chatID: insertedChat
        }
    } catch (err: any) {
        return {
            success: false,
            error: err
        }
    }
}

async function getIfSessionExists(sessionID: Number): Promise<void> {
    let err = new Error
    await sessions.
        findOne({
            where: {
                id: sessionID,
            }
        })
        .then((queryResult: any) => {
            if (queryResult === null) {
                err.name = "ERR_SESSION_NOT_EXISTS"
                err.message = "This session doesn´t exists!"
                throw err
            }
            else {
                switch (queryResult.active) {
                    case true:
                        return
                    default:
                        err.name = "ERR_INVALID_SESSION"
                        err.message = "This session is expired!"
                        throw err
                }
            }
        })
}

async function insertChat(contact: string): Promise<number> {
    let result = await chats.
        create(
            {
                contact,
                status: 1
            }
        )
        .then((insertedData: any) => {
            return Number(insertedData.id)
        })
        .catch((err: Error) => {
            let myErr = new Error
            myErr.name = err.name === "SequelizeForeignKeyConstraintError" ? 'ERR_USER_NOT_EXISTS' : err.name
            myErr.message = err.name === "SequelizeForeignKeyConstraintError" ? 'This user doesn´t exists!' : err.message
            throw myErr
        })
    return result
}

async function insertChatHistory(chat: number, session: number): Promise<void> {
    await chatsHistory.
        create(
            {
                chat,
                session,
                action: 1
            }
        )
        .then()
}