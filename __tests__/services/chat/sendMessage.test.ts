const { Sequelize } = require('sequelize');
import { iMessage, iReturnObject, iUser } from "../../../src/@types/myTypes";
import { chatHistoryMockUp } from "../../../src/mocks/chatHistoryMock";
import { chatMockUp } from "../../../src/mocks/chatMock";
import { contactMockUp } from "../../../src/mocks/contactMock";
import { estefaniData, jhonatanData, sacciData } from "../../../src/mocks/data/contactData";
import { activeUserOne, activeUserTwo, inactiveUserOne, inactiveUserTwo } from "../../../src/mocks/data/userData";

//Import database
const db = require('../../../src/database/models')

//import seeder
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertChatsHistoryAction = require('../../../src/database/seeders/20230329162645-insert-chats-history-actions.js')
const seederInsertSessionStatuses = require('../../../src/database/seeders/20230328004002-insert-session-statuses.js')
const seederInsertChatStatuses = require('../../../src/database/seeders/20230328021018-insert-chats-statuses.js')
const seederInsertStores = require('../../../src/database/seeders/20220509183308-insert-stores.js')
const seederInsertSenders = require('../../../src/database/seeders/20230511163127-insert-message-senders')
const seederInsertMessagesTypes = require('../../../src/database/seeders/20230331125028-insert-messages-types')

//import mocks
import { sessionMockUp } from '../../../src/mocks/sessionMock'
import { userMockUp } from "../../../src/mocks/userMock";
import sendMessage from "../../../src/services/chat/sendMessage";

//import session model
const messages = require('../../../src/database/models/').tb_messages
const talks = require('../../../src/database/models/').tb_talks

describe('sendMessage (c)', () => {
    let result: iReturnObject

    const bulkInsertSession = async (id: number, status: number, user: string, active: number) => {
        await sessionMockUp(db.sequelize.getQueryInterface(), Sequelize, id, status, user, active)
    }
    const bulkInsertContact = async (phone: string, name: string) => {
        await contactMockUp(db.sequelize.getQueryInterface(), Sequelize, phone, name, true)
    }
    const bulkInsertUser = async (props: iUser) => {
        let { usid, password, name, role, store } = props
        await userMockUp(db.sequelize.getQueryInterface(), Sequelize, usid, password, name, role, store)
    }
    const bulkInsertChatHistory = async (id: number, chat: number, session: number, action: number) => {
        await chatHistoryMockUp(db.sequelize.getQueryInterface(), Sequelize, id, chat, session, action)
    }
    const bulkInsertChat = async (id: number, contact: string, status: number) => {
        await chatMockUp(db.sequelize.getQueryInterface(), Sequelize, id, contact, status)
    }

    const checkTalkQtd = async (chatID: number): Promise<number> => {
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

    const checkIfMessageWasInserted = async (content: string): Promise<boolean> => {
        const result = messages
            .findOne(
                {
                    where: {
                        content
                    }
                })
            .then((queryResult: any) => {
                if (queryResult === null) return false
                else return true
            })
        return result
    }

    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        //Insere dados comuns
        await seederInsertRoles.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertChatsHistoryAction.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertChatStatuses.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertStores.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSenders.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertMessagesTypes.up(db.sequelize.getQueryInterface(), Sequelize)
        await bulkInsertContact(sacciData.phone, sacciData.name)
        await bulkInsertUser({ ...activeUserOne })
        await bulkInsertUser({ ...inactiveUserOne })
        await bulkInsertSession(1, 1, activeUserOne.usid, 1)
        await bulkInsertChat(1, sacciData.phone, 1)
        await bulkInsertChatHistory(1, 1, 1, 1)
    })

    beforeEach(async () => {
        await db.tb_talks.destroy({
            truncate: true
        })
        await db.tb_messages.destroy({
            truncate: true
        }) 
    })
    it('should successfully insert a new text message in the database, with a valid session and a valid chat', async () => {
        let message: iMessage = {
            type: 'chat',
            content: 'Olá! esta é uma mensagem curta'
        }
        result = await sendMessage({
            chat: 1,
            sender: 1,
            message
        })
        let talksQtd = await checkTalkQtd(1)
        let wasMessageInserted = await checkIfMessageWasInserted(message.content)
        expect(result.success).toBe(true)
        expect(talksQtd).toBe(1)
        expect(wasMessageInserted).toBe(true)
    });

    it('should successfully insert a new image in the database, with a valid session and a valid contact', async () => {
        let message: iMessage = {
            type: 'image',
            content: 'Descrição da imagem'
        }
        result = await sendMessage({
            chat: 1,
            sender: 1,
            message
        })
        let talksQtd = await checkTalkQtd(1)
        let wasMessageInserted = await checkIfMessageWasInserted(message.content)
        expect(result.success).toBe(true)
        expect(talksQtd).toBe(1)
        expect(wasMessageInserted).toBe(true)
    });


    it('should fail in insert a new message in the database, with a nonexisting chat', async () => {
        let message: iMessage = {
            type: 'chat',
            content: 'chat curto'
        }
        result = await sendMessage({
            chat: 5,
            sender: 1,
            message
        })
        let talksQtd = await checkTalkQtd(1)
        let wasMessageInserted = await checkIfMessageWasInserted(message.content)
        expect(result.success).toBe(false)
        expect(result.error?.name).toBe('ERR_CHAT_NOT_EXISTS')
        expect(talksQtd).toBe(0)
        expect(wasMessageInserted).toBe(false)
    });
    it('should fail in insert a new message in the database, with a invalid chat', async () => {
        await bulkInsertChat(2, sacciData.phone, 2)
        await bulkInsertChatHistory(2, 2, 1, 3)
        let message: iMessage = {
            type: 'chat',
            content: 'chat curto'
        }
        result = await sendMessage({
            chat: 2,
            sender: 1,
            message
        })
        let talksQtd = await checkTalkQtd(1)
        let wasMessageInserted = await checkIfMessageWasInserted(message.content)
        expect(result.success).toBe(false)
        expect(result.error?.name).toBe('ERR_CHAT_INVALID')
        expect(talksQtd).toBe(0)
        expect(wasMessageInserted).toBe(false)
    });

    it('should throw a connection error', async () => {
        await db.tb_messages.destroy({
            truncate: true
        });
        await db.tb_talks.destroy({
            truncate: true
        });
        await db.tb_chats_history.destroy({
            truncate: true
        });
        await db.tb_chats.destroy({
            truncate: true
        });
        await db.tb_sessions.destroy({
            truncate: true
        });
        await db.tb_user.destroy({
            truncate: true
        });
        
        await seederInsertRoles.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertChatsHistoryAction.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertChatStatuses.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertStores.down(db.sequelize.getQueryInterface(), Sequelize)


        ////Shutting down connection...
        db.sequelize.close();

        let message: iMessage = {
            type: 'chat',
            content: 'chat curto'
        }
        result = await sendMessage({
            chat: 1,
            sender: 1,
            message
        })
        expect(result.success).toBe(false)
        expect(result).toHaveProperty('error')

    });
});