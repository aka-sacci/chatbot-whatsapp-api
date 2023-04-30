import { iOpenedChatsByUser, iReturnObject, iSession, iUser } from "../../../@types/myTypes";
const sessions = require('../../../database/models/').tb_sessions
const chats = require('../../../database/models/').tb_chats
const chatsHistory = require('../../../database/models/').tb_chats_history


export default async function checkUserDisponibility(): Promise<iReturnObject> {

    //Checar quais usuários estão ativos
    //se -> Não tiver nenhum -> já retorna que não tem ninguém online
    //se -> tiver um ou mais, a brincadeira começa
    //se -> tiver só um online, vai ele mermo
    try {
        let sessions: Array<iSession> = await getActiveSessions();
        if (Object.keys(sessions).length === 1) return { success: true, sessionID: sessions[0].id }

        let openedChatsByUser: Array<iOpenedChatsByUser> = []
        for (let session in sessions) {
            let sessionIterator = Number(session)
            let qtdChats = await getOpenedChats(sessions[sessionIterator].user)
            openedChatsByUser.push({
                user: sessions[sessionIterator].user,
                openedChats: qtdChats,
                activeSession: sessions[sessionIterator].id
            })
        }
        let userWithMinimumOpenedChats = getUserWithMinimumOpenedChats(openedChatsByUser)
        return {
            success: true,
            sessionID: userWithMinimumOpenedChats.activeSession
        }

    } catch (err: any) {
        return {
            success: false,
            error: err
        }

    }
}

async function getActiveSessions(): Promise<Array<iSession>> {
    let allUsers = sessions.findAll({
        where: {
            active: true,
            status: 1
        },
    })
        .then((queryResult: Array<iSession>) => {
            switch (Object.keys(queryResult).length) {
                case 0:
                    let err = new Error
                    err.name = "ERR_NO_USERS_AVALIABLE"
                    err.message = "There's no users avaliable!"
                    throw err
                default:
                    return queryResult
            }
        })

    return allUsers
}

async function getOpenedChats(user: string): Promise<number> {
    let openedChats = await chats.
        count({
            include: [
                {
                    model: chatsHistory,
                    include: [
                        {
                            model: sessions,
                            where: {
                                user: user
                            },
                            required: true
                        }
                    ],
                    required: true
                }
            ],
            where: {
                status: 1
            }
        })
        .then((data: any) => {
            return Number(data)
        })
    return openedChats
}

function getUserWithMinimumOpenedChats(openedChatsByUser: Array<iOpenedChatsByUser>): iOpenedChatsByUser{
    let userWithMinimumOpenedChats = openedChatsByUser.reduce((minValue, valueToBeCompared) => {
        return valueToBeCompared.openedChats < minValue.openedChats ? valueToBeCompared : minValue;
    });
    return userWithMinimumOpenedChats
}