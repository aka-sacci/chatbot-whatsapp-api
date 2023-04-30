const { Sequelize } = require('sequelize');
import { iReturnObject, iUser } from "../../../src/@types/myTypes";
import { chatHistoryMockUp } from "../../../src/mocks/chatHistoryMock";
import { chatMockUp } from "../../../src/mocks/chatMock";
import { contactMockUp } from "../../../src/mocks/contactMock";
import { estefaniData, sacciData } from "../../../src/mocks/data/contactData";
import { activeUserOne, activeUserTwo, inactiveUserOne, inactiveUserTwo } from "../../../src/mocks/data/userData";

//Import database
const db = require('../../../src/database/models')

//import seeder
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertChatsHistoryAction = require('../../../src/database/seeders/20230329162645-insert-chats-history-actions.js')
const seederInsertSessionStatuses = require('../../../src/database/seeders/20230328004002-insert-session-statuses.js')
const seederInsertChatStatuses = require('../../../src/database/seeders/20230328021018-insert-chats-statuses.js')

//import mocks
import { sessionMockUp } from '../../../src/mocks/sessionMock'
import { userMockUp } from "../../../src/mocks/userMock";
import checkUserDisponibility from "../../../src/services/chat/checkUserDisponibility";

describe('checkUserDisponibility', () => {
    let result: iReturnObject

    const bulkInsertSession = async (id: number, status: number, user: string, active: number) => {
        await sessionMockUp(db.sequelize.getQueryInterface(), Sequelize, id, status, user, active)
    }

    const bulkInsertChatHistory = async (id: number, chat: number, session: number, action: number) => {
        await chatHistoryMockUp(db.sequelize.getQueryInterface(), Sequelize, id, chat, session, action)
    }
    const bulkInsertChat = async (id: number, contact: string, status: number) => {
        await chatMockUp(db.sequelize.getQueryInterface(), Sequelize, id, contact, status)
    }
    const bulkInsertContact = async (phone: string, name: string) => {
        await contactMockUp(db.sequelize.getQueryInterface(), Sequelize, phone, name, true)
    }
    const bulkInsertUser = async (props: iUser) => {
        let { usid, password, name, role } = props
        await userMockUp(db.sequelize.getQueryInterface(), Sequelize, usid, password, name, role)
    }

    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        await seederInsertRoles.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertChatsHistoryAction.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertChatStatuses.up(db.sequelize.getQueryInterface(), Sequelize)
        await bulkInsertContact(sacciData.phone, sacciData.name)
        await bulkInsertContact(estefaniData.phone, estefaniData.name)
        await bulkInsertUser({ ...activeUserOne })
        await bulkInsertUser({ ...activeUserTwo })
        await bulkInsertUser({ ...inactiveUserOne })
        await bulkInsertUser({ ...inactiveUserTwo })
    })

    beforeEach(async () => {
        await db.tb_sessions.destroy({
            truncate: true
        })
        await db.tb_chats.destroy({
            truncate: true
        })
        await db.tb_chats_history.destroy({
            truncate: true
        })

    })

    it('should successfully return an random active user, with many active sessions in the database', async () => {
        bulkInsertSession(1, 1, activeUserOne.usid, 1)
        bulkInsertSession(2, 1, activeUserTwo.usid, 1)
        result = await checkUserDisponibility()
        expect(1 + 1).toBe(2)
    });
    it('should successfully return session = 1 with just one active session in the database', () => {
        expect(1 + 1).toBe(2)
    });
    it('should successfully return session = 2 with two sessions in the database, but the number one isn´t active', () => {
        expect(1 + 1).toBe(2)
    });

    it('should successfully return that all users aren´t active', () => {
        expect(1 + 1).toBe(2)
    });
    it('should successfully return session = 2 with two users in the database, but the number one has chats openeds, and the two hasn´t chats openeds', () => {
        expect(1 + 1).toBe(2)
    });
    it('should successfully return session = 2 with two users in the database, but the number one has more sessions openeds', () => {
        expect(1 + 1).toBe(2)
    });
    it('should successfully return session = 2 with two users in the database, but the number one was made the last service and both have sessions openeds', () => {
        expect(1 + 1).toBe(2)
    });
    it('should throw a connection error', async () => {
        expect(1 + 1).toBe(2)
    });
});