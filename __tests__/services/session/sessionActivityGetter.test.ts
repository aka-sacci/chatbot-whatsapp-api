const { Sequelize } = require('sequelize');
import { iReturnObject } from "../../../src/@types/myTypes";

//Import database
const db = require('../../../src/database/models')

//Import Service
import sessionActivityGetter from "../../../src/services/session/sessionActivityGetter";

//import mocks
import { sessionMockUp } from '../../../src/mocks/sessionMock'



describe('sessionActivityGetter (s)', () => {
    let result: iReturnObject

    const bulkInsertSession = async (id: number, status: number, user: string, active: number) => {
        await sessionMockUp(db.sequelize.getQueryInterface(), Sequelize, id, status, user, active)
    }


    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        await bulkInsertSession(1, 1, 'Admin', 1)
        await bulkInsertSession(2, 2, 'Admin2', 0)

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