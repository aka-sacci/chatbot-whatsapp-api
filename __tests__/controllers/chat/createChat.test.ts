const { Sequelize } = require('sequelize');
import { bulkInsertContact, bulkInsertSession, bulkInsertUser } from "../../../src/mocks";
import { estefaniData, jhonatanData, sacciData } from "../../../src/mocks/data/contactData";
import { activeUserOne, activeUserTwo, inactiveUserOne, inactiveUserTwo } from "../../../src/mocks/data/userData";
import { checkIfChatHistoryWasInserted, checkIfChatWasInserted } from "../../../src/utils/testsFunctions";

//IMPORT SUPERTEST
const request = require('supertest')
const testServer = require("../../../src/server")

//Import database
const db = require('../../../src/database/models')

//import seeder
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertChatsHistoryAction = require('../../../src/database/seeders/20230329162645-insert-chats-history-actions.js')
const seederInsertSessionStatuses = require('../../../src/database/seeders/20230328004002-insert-session-statuses.js')
const seederInsertChatStatuses = require('../../../src/database/seeders/20230328021018-insert-chats-statuses.js')
const seederInsertStores = require('../../../src/database/seeders/20220509183308-insert-stores.js')


describe('createChat (c)', () => {

    const response = async (props: { sessionID: number, contact: string }) => {
        let { sessionID, contact } = props
        const myRequest = await request(testServer)
            .get("/chat/createchat/" + sessionID + "/" + contact)
            .send()
        return myRequest
    }

    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        await seederInsertRoles.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertChatsHistoryAction.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertChatStatuses.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertStores.up(db.sequelize.getQueryInterface(), Sequelize)
        await bulkInsertContact(sacciData.phone, sacciData.name)
        await bulkInsertContact(estefaniData.phone, estefaniData.name)
        await bulkInsertUser({ ...activeUserOne })
        await bulkInsertUser({ ...activeUserTwo })
        await bulkInsertUser({ ...inactiveUserOne })
        await bulkInsertUser({ ...inactiveUserTwo })
    })

    beforeEach(async () => {
        await db.tb_chats_history.destroy({
            truncate: true
        })
        await db.tb_sessions.destroy({
            truncate: true
        })
        await db.tb_chats.destroy({
            truncate: true
        })

    })
    it('should successfully create a new chat, inserting his history and returning his id and status = 201', async () => {
        await bulkInsertSession(1, 1, activeUserOne.usid, 1)
        let myResponse = await response({ sessionID: 1, contact: sacciData.phone })
        let wasChatInserted = await checkIfChatWasInserted(1)
        let wasChatHistoryInserted = await checkIfChatHistoryWasInserted(1)
        expect(myResponse.status).toBe(201)
        expect(myResponse.body.chatID).toBe(1)
        expect(wasChatInserted).toBe(true)
        expect(wasChatHistoryInserted).toBe(true)

    });
    it('should fail in create a new chat, with a inexisting contact, returning status = 500 and an error', async () => {
        await bulkInsertSession(1, 1, activeUserOne.usid, 1)
        let myResponse = await response({ sessionID: 1, contact: jhonatanData.phone })
        let wasChatInserted = await checkIfChatWasInserted(1)
        let wasChatHistoryInserted = await checkIfChatHistoryWasInserted(1)
        expect(myResponse.status).toBe(500)
        expect(myResponse.body.error.name).toBe('ERR_USER_NOT_EXISTS')
        expect(wasChatInserted).toBe(false)
        expect(wasChatHistoryInserted).toBe(false)
    });

    it('should fail in create a new chat, with a invalid session, returning status = 500 and an error', async () => {
        await bulkInsertSession(1, 1, activeUserOne.usid, 0)
        let myResponse = await response({ sessionID: 1, contact: sacciData.phone })
        let wasChatInserted = await checkIfChatWasInserted(1)
        let wasChatHistoryInserted = await checkIfChatHistoryWasInserted(1)
        expect(myResponse.status).toBe(500)
        expect(myResponse.body.error.name).toBe('ERR_INVALID_SESSION')
        expect(wasChatInserted).toBe(false)
        expect(wasChatHistoryInserted).toBe(false)
    });

    it('should fail in create a new chat, with a inexisting session, returning status = 500 and an error', async () => {
        let myResponse = await response({ sessionID: 1, contact: sacciData.phone })
        let wasChatInserted = await checkIfChatWasInserted(1)
        let wasChatHistoryInserted = await checkIfChatHistoryWasInserted(1)
        expect(myResponse.status).toBe(500)
        expect(myResponse.body.error.name).toBe('ERR_SESSION_NOT_EXISTS')
        expect(wasChatInserted).toBe(false)
        expect(wasChatHistoryInserted).toBe(false)
    });
    it('should throw a connection error', async () => {
        //Cleaning database
        await db.tb_sessions.destroy({
            truncate: true
        });
        await db.tb_user.destroy({
            truncate: true
        });
        await db.tb_chats_history.destroy({
            truncate: true
        });
        await db.tb_chats.destroy({
            truncate: true
        });
        await seederInsertRoles.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertChatsHistoryAction.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertChatStatuses.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertStores.down(db.sequelize.getQueryInterface(), Sequelize)


        ////Shutting down connection...
        db.sequelize.close();
        let myResponse = await response({ sessionID: 1, contact: sacciData.phone })
        expect(myResponse.status).toBe(500)
        expect(myResponse.body).toHaveProperty('error')

    });
});