const { Sequelize } = require('sequelize');
import { iReturnObject } from "../../../src/@types/myTypes";
import { bulkInsertChat, bulkInsertContact, bulkInsertSession, bulkInsertUser, bulkInsertChatHistory } from "../../../src/mocks";
import { estefaniData, sacciData } from "../../../src/mocks/data/contactData";
import { activeUserOne } from "../../../src/mocks/data/userData";

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
import expireChat from "../../../src/services/chat/expireChat";
import { checkIfChatWasExpired, checkLastChatHistoryAction } from "../../../src/utils/testsFunctions";
describe('expireChat (s)', () => {
    let result: iReturnObject

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
        await bulkInsertContact(estefaniData.phone, estefaniData.name)
        await bulkInsertUser({ ...activeUserOne })
        await bulkInsertSession(1, 1, activeUserOne.usid, 1)
        await bulkInsertChat(1, sacciData.phone, 1)
        await bulkInsertChatHistory(1, 1, 1, 1)
        await bulkInsertChat(2, estefaniData.phone, 1)
        await bulkInsertChatHistory(2, 2, 1, 1)
        await bulkInsertChat(3, estefaniData.phone, 1)
        await bulkInsertChatHistory(3, 3, 1, 1)
    })
    it('should expire the chat by the user', async () => {
        result = await expireChat({
            chatID: 1,
            expiredBy: 'user'
        })
        let wasChatExpired = await checkIfChatWasExpired(1, 3)
        let isChatHistoryExpired = await checkLastChatHistoryAction(1, 3)
        expect(result.success).toBe(true)
        expect(wasChatExpired).toBe(true)
        expect(isChatHistoryExpired).toBe(true)
    });
    it('should expire the chat by inactivity', async () => {
        result = await expireChat({
            chatID: 2,
            expiredBy: 'inactivity'
        })
        let wasChatExpired = await checkIfChatWasExpired(2, 2)
        let isChatHistoryExpired = await checkLastChatHistoryAction(2, 3)
        expect(result.success).toBe(true)
        expect(wasChatExpired).toBe(true)
        expect(isChatHistoryExpired).toBe(true)
    });
    it('should expire the chat by the contact', async () => {
        result = await expireChat({
            chatID: 3,
            expiredBy: 'contact'
        })
        let wasChatExpired = await checkIfChatWasExpired(3, 4)
        let isChatHistoryExpired = await checkLastChatHistoryAction(3, 3)
        expect(result.success).toBe(true)
        expect(wasChatExpired).toBe(true)
        expect(isChatHistoryExpired).toBe(true)
    });
    it('should fail in expire an inexisting chat', async () => {
        result = await expireChat({
            chatID: 10,
            expiredBy: 'contact'
        })
        expect(result.success).toBe(false)
        expect(result.error?.name).toBe("ERR_CHAT_NOT_EXISTS")
    });
    it('should throw a connection error', async () => {
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
        result = await expireChat({
            chatID: 10,
            expiredBy: 'contact'
        })
        expect(result.success).toBe(false)
        expect(result).toHaveProperty("error")
    });
});