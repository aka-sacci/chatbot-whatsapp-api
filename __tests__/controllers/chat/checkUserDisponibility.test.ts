const { Sequelize } = require('sequelize');
import { bulkInsertChat, bulkInsertChatHistory, bulkInsertContact, bulkInsertSession, bulkInsertUser } from "../../../src/mocks";
import { estefaniData, jhonatanData, sacciData } from "../../../src/mocks/data/contactData";
import { activeUserOne, activeUserTwo, inactiveUserOne, inactiveUserTwo } from "../../../src/mocks/data/userData";

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


describe('checkUserDisponibility (c)', () => {

    const response = async () => {
        const myRequest = await request(testServer)
            .get("/chat/checkuserdisponibility")
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
        await bulkInsertContact(jhonatanData.phone, jhonatanData.name)
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

    it('should successfully return an random active user, with many active sessions in the database', async () => {
        await bulkInsertSession(1, 1, activeUserOne.usid, 1)
        await bulkInsertSession(2, 1, activeUserTwo.usid, 1)
        let myResponse = await response()
        expect(myResponse.status).toBe(200)
        expect(myResponse.body).toHaveProperty('sessionID')
    });
    it('should successfully return session = 1 with just one active session in the database', async () => {
        await bulkInsertSession(1, 1, activeUserOne.usid, 1)
        let myResponse = await response()
        expect(myResponse.status).toBe(200)
        expect(myResponse.body.sessionID).toBe(1)
    });
    it('should successfully return session = 2 with two sessions in the database, but the number one isn´t active', async () => {
        await bulkInsertSession(1, 1, inactiveUserOne.usid, 0)
        await bulkInsertSession(2, 1, activeUserOne.usid, 1)
        await bulkInsertSession(3, 2, inactiveUserTwo.usid, 0)
        let myResponse = await response()
        expect(myResponse.status).toBe(200)
        expect(myResponse.body.sessionID).toBe(2)
    });

    it('should successfully return that all users aren´t active', async () => {
        await bulkInsertSession(1, 1, inactiveUserOne.usid, 0)
        await bulkInsertSession(2, 2, inactiveUserTwo.usid, 0)
        let myResponse = await response()
        expect(myResponse.status).toBe(404)
        expect(myResponse.body.error?.name).toBe('ERR_NO_USERS_AVALIABLE')

    });
    it('should successfully return session = 2 with two users in the database, but the number one has chats openeds, and the two hasn´t chats openeds', async () => {
        await bulkInsertSession(1, 1, activeUserOne.usid, 1)
        await bulkInsertSession(2, 1, activeUserTwo.usid, 1)
        //Chat 1 is opened, chat 2 is ended and chat 3 is ended
        await bulkInsertChat(1, sacciData.phone, 1)
        await bulkInsertChat(2, estefaniData.phone, 2)
        await bulkInsertChat(3, estefaniData.phone, 2)
        //Chat 1 and 3 is from activeUser1 (session 1), 1 is opened and 3 is ended
        //chat 2 is from activeuser2 (session 2), and is ended
        await bulkInsertChatHistory(1, 1, 1, 1)
        await bulkInsertChatHistory(2, 2, 2, 2)
        await bulkInsertChatHistory(3, 3, 1, 1)
        let myResponse = await response()
        expect(myResponse.status).toBe(200)
        expect(myResponse.body.sessionID).toBe(2)
    });
    it('should successfully return session = 2 with two users in the database, but the number one has more sessions openeds', async () => {
        await bulkInsertSession(1, 1, activeUserOne.usid, 1)
        await bulkInsertSession(2, 1, activeUserTwo.usid, 1)
        //All chats are opened
        await bulkInsertChat(1, sacciData.phone, 1)
        await bulkInsertChat(2, estefaniData.phone, 1)
        await bulkInsertChat(3, jhonatanData.phone, 1)
        //Chat 1 and 3 is from activeUser1 (session 1), both are opened
        //chat 2 is from activeuser2 (session 2), and is opened
        await bulkInsertChatHistory(1, 1, 1, 1)
        await bulkInsertChatHistory(2, 2, 2, 1)
        await bulkInsertChatHistory(3, 3, 1, 1)
        let myResponse = await response()
        expect(myResponse.status).toBe(200)
        expect(myResponse.body.sessionID).toBe(2)
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

        let myResponse = await response()
        expect(myResponse.status).toBe(500)
        expect(myResponse.body).toHaveProperty('error')
    });
});