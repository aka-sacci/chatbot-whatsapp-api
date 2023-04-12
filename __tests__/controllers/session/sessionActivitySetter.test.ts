import jwt from "jsonwebtoken";
import 'dotenv/config'
const { Sequelize } = require('sequelize');
import 'dotenv/config'

const request = require('supertest')
const testServer = require("../../../src/server")


//Import database
const db = require('../../../src/database/models')


//import mocks
import { sessionMockUp } from '../../../src/mocks/sessionMock'

//import session model
const session = require('../../../src/database/models/').tb_sessions

describe('sessionActivitySetter (c)', () => {

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

    let token: string
    let invalidToken: string
    let expiredToken: string

    //Response function
    const response = async (myToken: string | null, sessionNewStatus: number) => {
        if (myToken != null) {
            const myRequest = await request(testServer)
                .post("/session/sessionactivitysetter")
                .set('Cookie', `JWT=${myToken}`)
                .send({
                    sessionNewStatus
                })
            return myRequest
        } else {
            const myRequest = await request(testServer)
                .post("/session/sessionactivitysetter")
                .send({
                    sessionNewStatus
                })
            return myRequest
        }
    }

    const bulkInsertSession = async (id: number, status: number, user: string, active: number) => {
        await sessionMockUp(db.sequelize.getQueryInterface(), Sequelize, id, status, user, active)
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
        await bulkInsertSession(3, 1, 'admin', 0);
        signTokens()
    })
    it('should successfully inactive the session, and return status 200', async () => {
        const myResponse = await response(token, 0)
        let isSessionActive = await checkIfSessionIsActive(1)
        expect(isSessionActive).toBe(false)
        expect(myResponse.status).toBe(200)
    });

    it('should successfully reactive the session, and return status 200', async () => {
        const myResponse = await response(token, 1)
        let isSessionActive = await checkIfSessionIsActive(1)
        expect(myResponse.status).toBe(200)
        expect(isSessionActive).toBe(true)
    });

    it('should fail in change the session status with a expired token, returning status 400', async () => {
        const myResponse = await response(expiredToken, 1)
        let isSessionActive = await checkIfSessionIsActive(3)
        expect(myResponse.status).toBe(400)
        expect(isSessionActive).toBe(false)
    })

    it('should fail in active the session with a valid token, but expired session, returning status 403', async () => {
        const myResponse = await response(invalidToken, 1)
        let isSessionActive = await checkIfSessionIsActive(2)
        expect(myResponse.status).toBe(403)
        expect(isSessionActive).toBe(false)
    })
    it('should fail in inactive the session with a valid token, but expired session, returning status 403', async () => {
        const myResponse = await response(invalidToken, 0)
        let isSessionActive = await checkIfSessionIsActive(2)
        expect(myResponse.status).toBe(403)
        expect(isSessionActive).toBe(false)
    })
    it('should return status 500 and a error', async () => {

        //Cleaning database
        await db.tb_sessions.destroy({
            truncate: true
        });

        ////Shutting down connection...
        db.sequelize.close();

        const myResponse = await response(token, 1)
        expect(myResponse.status).toBe(500)
        expect(myResponse.body).toHaveProperty("error")
    });
});