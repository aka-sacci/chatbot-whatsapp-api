const { Sequelize } = require('sequelize');
import { iReturnObject } from "../../../src/@types/myTypes";

//Import database
const db = require('../../../src/database/models')

//Import Service
import sessionActivitySetter from "../../../src/services/session/sessionActivitySetter"

//import mocks
import { activeUserOne, inactiveUserOne } from "../../../src/mocks/data/userData";
import { bulkInsertSession, bulkInsertUser } from "../../../src/mocks";
import { checkIfSessionIsActive } from "../../../src/utils/testsFunctions";
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertSessionStatuses = require('../../../src/database/seeders/20230328004002-insert-session-statuses.js')
const seederInsertStores = require('../../../src/database/seeders/20220509183308-insert-stores.js')



describe('sessionActivitySetter (s)', () => {
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
    it('should change successfully the session status to inative', async () => {
        result = await sessionActivitySetter({
            sessionID: 1,
            sessionNewStatus: 0
        })
        let isSessionActive = await checkIfSessionIsActive(1)
        expect(result.success).toBe(true)
        expect(result.sessionNewStatus).toBe(0)
        expect(isSessionActive).toBe(false)
    });
    it('should change successfully the session status to active', async () => {
        result = await sessionActivitySetter({
            sessionID: 1,
            sessionNewStatus: 1
        })
        let isSessionActive = await checkIfSessionIsActive(1)
        expect(result.success).toBe(true)
        expect(result.sessionNewStatus).toBe(1)
        expect(isSessionActive).toBe(true)
    });
    it('should keep the inative status, even though the session is expired', async () => {
        result = await sessionActivitySetter({
            sessionID: 2,
            sessionNewStatus: 1
        })
        let isSessionActive = await checkIfSessionIsActive(2)
        expect(result.success).toBe(false)
        expect(isSessionActive).toBe(false)
        expect(result).toHaveProperty("error")
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

        result = await sessionActivitySetter({
            sessionID: 2,
            sessionNewStatus: 1
        })

        expect(result.success).toBe(false)
        expect(result).toHaveProperty("error")
    });
});

export { }