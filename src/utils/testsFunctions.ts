const session = require('../database/models').tb_sessions
const chatHistory = require('../database/models/').tb_chats_history
const chat = require('../database/models/').tb_chats
const messages = require('../database/models/').tb_messages
const talks = require('../database/models/').tb_talks

async function checkIfSessionIsActive(sessionID: number): Promise<boolean> {
    const result = session
        .findOne(
            {
                where: {
                    id: sessionID
                }
            })
        .then((queryResult: any) => {
            return queryResult.active
        })
    return result
}

async function checkIfChatWasInserted(chatID: number): Promise<boolean> {
    const result = chat
        .findOne(
            {
                where: {
                    id: chatID
                }
            })
        .then((queryResult: any) => {
            if (queryResult === null) return false
            else return true
        })
    return result
}

async function checkIfChatHistoryWasInserted(chatID: number): Promise<boolean> {
    const result = chatHistory
        .findOne(
            {
                where: {
                    chat: chatID
                }
            })
        .then((queryResult: any) => {
            if (queryResult === null) return false
            else return true
        })
    return result
}
async function checkTalkQtd(chatID: number): Promise<number> {
    const result = talks
        .count({
            where: {
                chat: chatID
            }
        })
        .then((queryResult: any) => {
            return queryResult
        })
    return result
}

async function checkIfMessageWasInserted(content: string, type: number, filename: string | null): Promise<boolean> {
    const result = messages
        .findOne(
            {
                where: {
                    content,
                    type,
                    filename
                }
            })
        .then((queryResult: any) => {
            if (queryResult === null) return false
            else return true
        })
    return result
}

async function checkIfSessionIsExpired(sessionID: number) {
    const result = session
        .findOne(
            {
                attributes: ['status']
            },
            {
                where: {
                    id: sessionID
                }
            })
        .then((queryResult: any) => {
            switch (queryResult.status) {
                case 1:
                    return false
                case 2:
                    return true
            }
        })
    return result
}

export { checkIfSessionIsActive, checkIfChatWasInserted, checkIfChatHistoryWasInserted, checkIfMessageWasInserted, checkTalkQtd, checkIfSessionIsExpired }