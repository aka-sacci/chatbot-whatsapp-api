const { Sequelize } = require('sequelize');
import { iReturnObject, iUser } from "../../../src/@types/myTypes";

//Import database
const db = require('../../../src/database/models')

//Import Service
import sessionActivityGetter from "../../../src/services/session/sessionActivityGetter";

//import mocks
import { sessionMockUp } from '../../../src/mocks/sessionMock'
import { userMockUp } from "../../../src/mocks/userMock";
import { activeUserOne, inactiveUserOne } from "../../../src/mocks/data/userData";
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertSessionStatuses = require('../../../src/database/seeders/20230328004002-insert-session-statuses.js')


describe('sessionActivityGetter (s)', () => {
    let result: iReturnObject

    const bulkInsertSession = async (id: number, status: number, user: string, active: number) => {
        await sessionMockUp(db.sequelize.getQueryInterface(), Sequelize, id, status, user, active)
    }
    const bulkInsertUser = async (props: iUser) => {
        let { usid, password, name, role } = props
        await userMockUp(db.sequelize.getQueryInterface(), Sequelize, usid, password, name, role)
    }


    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        await seederInsertRoles.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.up(db.sequelize.getQueryInterface(), Sequelize)
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