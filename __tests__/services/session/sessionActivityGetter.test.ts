const { Sequelize } = require('sequelize');
import { iReturnObject } from "../../../src/@types/myTypes";

//Import database
const db = require('../../../src/database/models')

//Import Service
import sessionActivityGetter from "../../../src/services/session/sessionActivityGetter";

//import mocks
import { activeUserOne, inactiveUserOne } from "../../../src/mocks/data/userData";
import { bulkInsertSession, bulkInsertUser } from "../../../src/mocks";
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertSessionStatuses = require('../../../src/database/seeders/20230328004002-insert-session-statuses.js')
const seederInsertStores = require('../../../src/database/seeders/20220509183308-insert-stores.js')


describe('sessionActivityGetter (s)', () => {
    let result: iReturnObject
    
    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        await seederInsertRoles.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertStores.up(db.sequelize.getQueryInterface(), Sequelize)
        await bulkInsertUser({ ...activeUserOne })
        await bulkInsertUser({ ...inactiveUserOne })
        await bulkInsertSession(1, 1, activeUserOne.usid, 1)
        await bulkInsertSession(2, 2, inactiveUserOne.usid, 0)

    })
    it('should return active status', async () => {
        result = await sessionActivityGetter({
            sessionID: 1
        })
        expect(result.success).toBe(true)
        expect(result.isSessionActive).toBe(true)
    });
    it('should return inactive status', async () => {
        result = await sessionActivityGetter({
            sessionID: 2
        })
        expect(result.success).toBe(true)
        expect(result.isSessionActive).toBe(false)
    });

    it('should throw a connection error', async () => {
        //Cleaning database
        await db.tb_sessions.destroy({
            truncate: true
        });
        await db.tb_user.destroy({
            truncate: true
        });
        await seederInsertRoles.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertStores.down(db.sequelize.getQueryInterface(), Sequelize)

        ////Shutting down connection...
        db.sequelize.close();

        result = await sessionActivityGetter({
            sessionID: 2,
        })

        expect(result.success).toBe(false)
        expect(result).toHaveProperty("error")
    });
});

export { }