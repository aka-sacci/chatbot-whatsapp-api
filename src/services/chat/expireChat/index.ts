import { iExpireChatProps, iReturnObject } from "../../../@types/myTypes";
const chats = require('../../../database/models/').tb_chats
const chatsHistory = require('../../../database/models/').tb_chats_history

export default async function expireChat(props: iExpireChatProps): Promise<iReturnObject> {
    try {
        let { chatID, expiredBy } = props
        let newChatStatus = returnExpireStatusID(expiredBy)
        await execExpireChat(chatID, newChatStatus)
        let sessionID = await getSessionID(chatID)
        await insertChatHistory(chatID, sessionID)

        return {
            success: true
        }

    } catch (err: any) {
        let errToBeThrown = new Error
        errToBeThrown.name = err.name
        errToBeThrown.message = err.message

        return {
            success: false,
            error: errToBeThrown
        }
    }
}

function returnExpireStatusID(expiredBy: "inactivity" | "user" | "contact"): number {
    switch (expiredBy) {
        case "inactivity":
            return 2
        case "user":
            return 3
        case "contact":
            return 4
    }
}

async function execExpireChat(chatID: number, newStatus: number): Promise<void> {
    await chats
        .update(
            {
                status: newStatus
            },
            {
                where: { id: chatID }
            }
        )
        .then((result: Array<Number>) => {
            switch (result[0]) {
                case 0:
                    let contactNotFoundError = new Error
                    contactNotFoundError.name = "ERR_CHAT_NOT_EXISTS"
                    contactNotFoundError.message = "This chat doesn't exists!"
                    throw contactNotFoundError
                default:
                    break
            }
        })
}

async function insertChatHistory(chatID: number, sessionID: number) {
    await chatsHistory
        .create({
            chat: chatID,
            session: sessionID,
            action: 3
        })
        .then(() => {

        })
}

async function getSessionID(chatID: number): Promise<number> {
    let result = await chatsHistory
        .findOne({
            where: {
                chat: chatID
            },
            order: [['createdAt', 'DESC']]
        })
        .then((queryResult: any) => {
            return queryResult.session
        })

    return result
}