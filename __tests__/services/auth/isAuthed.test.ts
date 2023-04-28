import { iReturnObject, iUser } from "../../../src/@types/myTypes"
import jwt from "jsonwebtoken";
import 'dotenv/config'
const { Sequelize } = require('sequelize');

//Import database
const db = require('../../../src/database/models')

//Import Service
import isAuthed from "../../../src/services/auth/isAuthed"

//import mocks
import { sessionMockUp } from '../../../src/mocks/sessionMock'
import { userMockUp } from "../../../src/mocks/userMock";
import { activeUserOne, inactiveUserOne } from "../../../src/mocks/data/userData";
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')

describe('isAuthed (S)', () => {
    let result: iReturnObject
    let token: string
    let invalidToken: string
    let expiredToken: string

    const bulkInsertSession = async (id: number, status: number, user: string, active: number) => {
        await sessionMockUp(db.sequelize.getQueryInterface(), Sequelize, id, status, user, active)
    }
    const bulkInsertUser = async (props: iUser) => {
        let { usid, password, name, role } = props
        await userMockUp(db.sequelize.getQueryInterface(), Sequelize, usid, password, name, role)
    }
    const syncDB = async () => {
        await db.sequelize.sync({ force: true })
        await seederInsertRoles.up(db.sequelize.getQueryInterface(), Sequelize)
    }

    const signTokens = () => {
        token = jwt.sign({ usid: activeUserOne.usid, sessionID: 1 },
            String(process.env.JWT_SECRET),
            { expiresIn: '1m' }
        )

        invalidToken = jwt.sign({ usid: inactiveUserOne.usid, sessionID: 2 },
            String(process.env.JWT_SECRET),
            { expiresIn: '1m' }
        )

        expiredToken = jwt.sign({ usid: "expiredToken", sessionID: 3 },
            String(process.env.JWT_SECRET),
            { expiresIn: '1ms' }
        )
    }

    beforeAll(async () => {
        await syncDB()
        await bulkInsertUser({ ...activeUserOne })
        await bulkInsertUser({ ...inactiveUserOne })
        await bulkInsertSession(1, 1, activeUserOne.usid, 1);
        await bulkInsertSession(2, 2, inactiveUserOne.usid, 0);
        signTokens()
    })

    afterAll(async () => {
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
    })
    it('should successfully check the JWT', async () => {
        result = await isAuthed({ token })
        expect(result.success).toBe(true)
    })
    it('should successfully check the JWT, but, fail in session authentication', async () => {
        result = await isAuthed({ token: invalidToken })
        expect(result.success).toBe(false)
        expect(result).toHaveProperty('error')
        expect(result.error?.name).toBe('SessionExpiredError')
    })
    it('should fail in the JWT check, returning a JsonWebTokenError', async () => {
        result = await isAuthed({ token: "wrongToken" })
        expect(result.success).toBe(false)
        expect(result).toHaveProperty('error')
        expect(result.error?.name).toBe('JsonWebTokenError')
    })
    it('should fail in the JWT check, returning a TokenExpiredError', async () => {
        result = await isAuthed({ token: expiredToken })
        expect(result.success).toBe(false)
        expect(result).toHaveProperty('error')
        expect(result.error?.name).toBe('TokenExpiredError')
    })
});

export { }