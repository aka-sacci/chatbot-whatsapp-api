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

describe('sessionActivityGetter (s)', () => {
    let activeToken: string
    let inactiveToken: string
    let expiredToken: string

    //Response function
    const response = async (myToken: string) => {
        if (myToken != null) {
            const myRequest = await request(testServer)
                .post("/session/sessionactivitygetter")
                .set('Cookie', `JWT=${myToken}`)
                .send()
            return myRequest
        } else {
            const myRequest = await request(testServer)
                .post("/session/sessionactivitygetter")
                .send()
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
        activeToken = jwt.sign({ usid: "admin", sessionID: 1 },
            String(process.env.JWT_SECRET),
            { expiresIn: '1m' }
        )

        inactiveToken = jwt.sign({ usid: "admin", sessionID: 2 },
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
        await bulkInsertSession(2, 1, 'admin', 0);
        await bulkInsertSession(3, 1, 'admin', 0);
        signTokens()
    })

    it('should successfully check the session activity (active) and return status 200', async () => {
        const myResponse = await response(activeToken)
        expect(myResponse.status).toBe(200)
        expect(myResponse.body.isSessionActive).toBe(true)
    });

    it('should successfully check the session activity (inactive) and return status 200', async () => {
        const myResponse = await response(inactiveToken)
        expect(myResponse.status).toBe(200)
        expect(myResponse.body.isSessionActive).toBe(false)
    });

    it('should fail in checking session activity with a expired token, returning status 400', async () => {
        const myResponse = await response(expiredToken)
        expect(myResponse.status).toBe(400)
        expect(myResponse.body).toHaveProperty("error")
    })

    it('should return status 500 and a error', async () => {

        //Cleaning database
        await db.tb_sessions.destroy({
            truncate: true
        });

        ////Shutting down connection...
        db.sequelize.close();

        const myResponse = await response(activeToken)
        expect(myResponse.status).toBe(500)
        expect(myResponse.body).toHaveProperty("error")
    });
});