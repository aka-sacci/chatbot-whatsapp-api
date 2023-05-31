import { iMessage, iReturnObject } from "../../../@types/myTypes";
const chats = require('../../../database/models/').tb_chats
const talks = require('../../../database/models/').tb_talks
const messages = require('../../../database/models/').tb_messages
const messagesTypes = require('../../../database/models/').tb_messages_types

export default async function sendMessage(props: { id: string, chat: number, sender: number, replyTo?: string, message: iMessage }): Promise<iReturnObject> {

    let { chat, sender, message, id, replyTo } = props
    try {
        await checkIfChatIsActive(chat)
        let messageType = await returnMessageType(message.type)
        let filename = message?.filename === undefined ? null : message.filename
        let messageID = await insertMessage(messageType, message.content, filename)
        await insertTalk(chat, sender, messageID, id, replyTo)
        return {
            success: true
        }
    } catch (error: any) {
        return {
            success: false,
            error
        }
    }

}

async function checkIfChatIsActive(chatID: number): Promise<void> {
    await chats
        .findOne({
            where: {
                id: chatID
            }
        })
        .then((queryResult: any) => {
            if (queryResult === null) {
                let nonexistentChatError = new Error
                nonexistentChatError.name = "ERR_CHAT_NOT_EXISTS"
                nonexistentChatError.message = "This chat doesn´t exists!"
                throw nonexistentChatError
            } else {
                let invalidChatError = new Error
                invalidChatError.name = "ERR_CHAT_INVALID"
                invalidChatError.message = "This chat is invalid!"

                switch (queryResult.status) {
                    case 1:
                        break;
                    case 5:
                        break;
                    default:
                        throw invalidChatError
                }
            }
        })
}

async function insertTalk(chat: number, sender: number, message: number, id: string, replyTo?: string): Promise<void> {
    await talks
        .create({
            id,
            chat,
            sender,
            message,
            seen: 0,
            replyTo
        })
        .then()
}

async function insertMessage(type: number, content: string, filename: string | null): Promise<number> {
    let result = await messages
        .create({
            type,
            content,
            filename
        })
        .then((queryResult: any) => {
            return Number(queryResult.id)
        })
    return result
}

async function returnMessageType(description: string): Promise<number> {
    let result = await messagesTypes
        .findOne({
            where: {
                description
            }
        })
        .then((queryResult: any) => {
            return Number(queryResult.id)
        })
    return result
}