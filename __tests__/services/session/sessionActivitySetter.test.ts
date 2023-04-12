const { Sequelize } = require('sequelize');
import { iReturnObject } from "../../../src/@types/myTypes";

//Import database
const db = require('../../../src/database/models')

//import seeder
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertDefaultUser = require('../../../src/database/seeders/20230228021930-insert-default-user.js')
const seederInsertSessionStatuses = require('../../../src/database/seeders/20230328004002-insert-session-statuses')

//Import Service
import sessionActivitySetter from "../../../src/services/session/sessionActivitySetter"

//import mocks
import { sessionMockUp } from '../../../src/mocks/sessionMock'

//import session model
const session = require('../../../src/database/models/').tb_sessions

describe('sessionStatusSetter (s)', () => {
    let result: iReturnObject

    const bulkInsertSession = async (id: number, status: number, user: string, active: number) => {
        await sessionMockUp(db.sequelize.getQueryInterface(), Sequelize, id, status, user, active)
    }

    const checkIfSessionIsActive = async (sessionID: number): Promise<boolean> => {
        const result = session
            .findOne(
                {
                    where: {
                        id: sessionID
                    }
                })
            .then((queryResult: any) => {
                return queryResult.active
            })
        return result
    }

    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        await seederInsertRoles.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertDefaultUser.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.up(db.sequelize.getQueryInterface(), Sequelize)
        await bulkInsertSession(1, 1, 'Admin', 1)
        await bulkInsertSession(2, 2, 'Admin2', 0)

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