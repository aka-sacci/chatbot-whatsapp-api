import { iReturnObject } from "../../../src/@types/myTypes"
const { Sequelize } = require('sequelize');
import jwt from "jsonwebtoken";
import 'dotenv/config'

//Import database
const db = require('../../../src/database/models')

//Import Service
import logout from "../../../src/services/auth/logout"

//import mocks
import { sessionMockUp } from '../../../src/mocks/sessionMock'

//import session model
const session = require('../../../src/database/models/').tb_sessions
describe('logout (s)', () => {
    let result: iReturnObject
    let token: string
    let invalidToken: string
    let expiredToken: string

    const bulkInsertSession = async (id: number, status: number, user: string, active: number) => {
        await sessionMockUp(db.sequelize.getQueryInterface(), Sequelize, id, status, user, active)
    }

    const checkIfSessionIsExpired = async (sessionID: number) => {
        const result = session
            .findOne(
                {
                    attributes: ['status']
                },
                {
                    where: {
                        id: sessionID
                    }
                })
            .then((queryResult: any) => {
                switch (queryResult.status) {
                    case 1:
                        return false
                    case 2:
                        return true
                }
            })
        return result
    }

    const syncDB = async () => {
        await db.sequelize.sync({ force: true })
    }

    const signTokens = () => {
        token = jwt.sign({ usid: "admin", sessionID: 1 },
            String(process.env.JWT_SECRET),
            { expiresIn: '1m' }
        )

        invalidToken = jwt.sign({ usid: "admin", sessionID: 2 },
            String(process.env.JWT_SECRET),
            { expiresIn: '1m' }
        )

        expiredToken = jwt.sign({ usid: "admin", sessionID: 3 },
            String(process.env.JWT_SECRET),
            { expiresIn: '1ms' }
        )
    }

    beforeAll(async () => {
        await syncDB()
        await bulkInsertSession(1, 1, 'admin', 1);
        await bulkInsertSession(2, 2, 'admin', 0);
        signTokens()

    })
    it('should be successfull in logout', async () => {
        result = await logout({ token })
        let isSessionExpired = await checkIfSessionIsExpired(1)
        expect(result.success).toBe(true)
        expect(isSessionExpired).toBe(true)
    });

    it('should be successfull in logout, even though session is already expired', async () => {
        result = await logout({ token: invalidToken })
        let isSessionExpired = await checkIfSessionIsExpired(2)
        expect(result.success).toBe(true)
        expect(isSessionExpired).toBe(true)
    })

    it('should throw a JWT error', async () => {
        result = await logout({ token: expiredToken })
        expect(result.success).toBe(false)
        expect(result).toHaveProperty("error")
        expect(result.error?.name).toBe('TokenExpiredError')
    })

    it('should throw a connection error', async () => {

        //Cleaning database
        await db.tb_sessions.destroy({
            truncate: true
        });

        ////Shutting down connection...
        db.sequelize.close();

        result = await logout({
            token
        })

        expect(result.success).toBe(false)
        expect(result).toHaveProperty("error")
    });
})