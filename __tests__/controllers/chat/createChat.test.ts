const { Sequelize } = require('sequelize');
import { bulkInsertContact, bulkInsertSession, bulkInsertUser } from "../../../src/mocks";
import { estefaniData, jhonatanData, sacciData } from "../../../src/mocks/data/contactData";
import { activeUserOne, activeUserTwo, inactiveUserOne, inactiveUserTwo } from "../../../src/mocks/data/userData";
import deleteMedia from "../../../src/utils/deleteMedia";
import { checkIfChatHistoryWasInserted, checkIfChatWasInserted } from "../../../src/utils/testsFunctions";

//IMPORT SUPERTEST
const request = require('supertest')
const testServer = require("../../../src/server")
const path = require('path');

//Import database
const db = require('../../../src/database/models')
const fs = require('fs')

//import seeder
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertChatsHistoryAction = require('../../../src/database/seeders/20230329162645-insert-chats-history-actions.js')
const seederInsertSessionStatuses = require('../../../src/database/seeders/20230328004002-insert-session-statuses.js')
const seederInsertChatStatuses = require('../../../src/database/seeders/20230328021018-insert-chats-statuses.js')
const seederInsertStores = require('../../../src/database/seeders/20220509183308-insert-stores.js')
describe('createChat (c)', () => {
    let imgTest = path.join(process.cwd(), '/src/mocks/data/media/imageMock.jfif')

    const checkIfMediaExists = async (mediaName: string): Promise<boolean> => {
        let mediaSrc = path.join(process.cwd(), '/src/assets/users/profilePics/' + mediaName)
        let result = fs.existsSync(mediaSrc)
        if (result === true) await deleteMedia(mediaName, "userPhotos")
        return result
    }

    const response = async (props: { sessionID: number, contact: string, userPhoto?: string }) => {
        let { sessionID, contact, userPhoto } = props
        const myRequest = await request(testServer)
            .post("/chat/createchat")
            .field('sessionID', sessionID)
            .field('contact', contact)
            .attach('userPhoto', userPhoto)
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
        await db.sequelize.query(`delete from sqlite_sequence where name='tb_chats'`)

    })
    it('should successfully create a new chat, inserting his history, saving his profilePic and returning his id and status = 201', async () => {
        await bulkInsertSession(1, 1, activeUserOne.usid, 1)
        let myResponse = await response({ sessionID: 1, contact: sacciData.phone, userPhoto: imgTest })
        let wasChatInserted = await checkIfChatWasInserted(1)
        let wasChatHistoryInserted = await checkIfChatHistoryWasInserted(1)
        let wasImageInserted = await checkIfMediaExists(sacciData.phone + ".jfif")
        expect(myResponse.status).toBe(201)
        expect(myResponse.body.chatID).toBe(1)
        expect(wasChatInserted).toBe(true)
        expect(wasChatHistoryInserted).toBe(true)
        expect(wasImageInserted).toBe(true)

    });
    it('should successfully create a new chat, inserting his history, not saving his profile pic and returning his id and status = 201', async () => {
        await bulkInsertSession(1, 1, activeUserOne.usid, 1)
        let myResponse = await response({ sessionID: 1, contact: sacciData.phone })
        let wasChatInserted = await checkIfChatWasInserted(1)
        let wasChatHistoryInserted = await checkIfChatHistoryWasInserted(1)
        let wasImageInserted = await checkIfMediaExists(sacciData.phone + ".jfif")
        expect(myResponse.status).toBe(201)
        expect(myResponse.body.chatID).toBe(1)
        expect(wasChatInserted).toBe(true)
        expect(wasChatHistoryInserted).toBe(true)
        expect(wasImageInserted).toBe(false)

    });
    it('should fail in create a new chat, with a inexisting contact, returning status = 500 and an error', async () => {
        await bulkInsertSession(1, 1, activeUserOne.usid, 1)
        let myResponse = await response({ sessionID: 1, contact: jhonatanData.phone, userPhoto: imgTest })
        let wasChatInserted = await checkIfChatWasInserted(1)
        let wasChatHistoryInserted = await checkIfChatHistoryWasInserted(1)
        let wasImageInserted = await checkIfMediaExists(sacciData.phone + ".jfif")
        expect(myResponse.status).toBe(500)
        expect(myResponse.body.error.name).toBe('ERR_USER_NOT_EXISTS')
        expect(wasChatInserted).toBe(false)
        expect(wasChatHistoryInserted).toBe(false)
        expect(wasImageInserted).toBe(false)
    });

    it('should fail in create a new chat, with a invalid session, returning status = 500 and an error', async () => {
        await bulkInsertSession(1, 1, activeUserOne.usid, 0)
        let myResponse = await response({ sessionID: 1, contact: sacciData.phone, userPhoto: imgTest })
        let wasChatInserted = await checkIfChatWasInserted(1)
        let wasChatHistoryInserted = await checkIfChatHistoryWasInserted(1)
        let wasImageInserted = await checkIfMediaExists(sacciData.phone + ".jfif")
        expect(myResponse.status).toBe(500)
        expect(myResponse.body.error.name).toBe('ERR_INVALID_SESSION')
        expect(wasChatInserted).toBe(false)
        expect(wasChatHistoryInserted).toBe(false)
        expect(wasImageInserted).toBe(false)
    });

    it('should fail in create a new chat, with a inexisting session, returning status = 500 and an error', async () => {
        let myResponse = await response({ sessionID: 1, contact: sacciData.phone, userPhoto: imgTest })
        let wasChatInserted = await checkIfChatWasInserted(1)
        let wasChatHistoryInserted = await checkIfChatHistoryWasInserted(1)
        let wasImageInserted = await checkIfMediaExists(sacciData.phone + ".jfif")
        expect(myResponse.status).toBe(500)
        expect(myResponse.body.error.name).toBe('ERR_SESSION_NOT_EXISTS')
        expect(wasChatInserted).toBe(false)
        expect(wasChatHistoryInserted).toBe(false)
        expect(wasImageInserted).toBe(false)
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
        let myResponse = await response({ sessionID: 1, contact: sacciData.phone, userPhoto: imgTest })
        let wasImageInserted = await checkIfMediaExists(sacciData.phone + ".jfif")
        expect(myResponse.status).toBe(500)
        expect(myResponse.body).toHaveProperty('error')
        expect(wasImageInserted).toBe(false)

    });
});