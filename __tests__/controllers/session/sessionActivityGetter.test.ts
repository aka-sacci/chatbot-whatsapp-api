import jwt from "jsonwebtoken";
import 'dotenv/config'
const { Sequelize } = require('sequelize');
import 'dotenv/config'

const request = require('supertest')
const testServer = require("../../../src/server")


//Import database
const db = require('../../../src/database/models')
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertSessionStatuses = require('../../../src/database/seeders/20230328004002-insert-session-statuses.js')
const seederInsertStores = require('../../../src/database/seeders/20220509183308-insert-stores.js')

//import mocks
import { activeUserOne, inactiveUserOne } from "../../../src/mocks/data/userData";
import { bulkInsertSession, bulkInsertUser } from "../../../src/mocks";


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

    const syncDB = async () => {
        await db.sequelize.sync({ force: true })
        await seederInsertRoles.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertStores.up(db.sequelize.getQueryInterface(), Sequelize)
    }

    const signTokens = () => {
        activeToken = jwt.sign({ usid: activeUserOne.usid, sessionID: 1 },
            String(process.env.JWT_SECRET),
            { expiresIn: '1m' }
        )

        inactiveToken = jwt.sign({ usid: inactiveUserOne.usid, sessionID: 2 },
            String(process.env.JWT_SECRET),
            { expiresIn: '1m' }
        )

        expiredToken = jwt.sign({ usid: activeUserOne.usid, sessionID: 3 },
            String(process.env.JWT_SECRET),
            { expiresIn: '1ms' }
        )
    }

    beforeAll(async () => {
        await syncDB()
        await bulkInsertUser({ ...activeUserOne })
        await bulkInsertUser({ ...inactiveUserOne })
        await bulkInsertSession(1, 1, activeUserOne.usid, 1);
        await bulkInsertSession(2, 1, inactiveUserOne.usid, 0);
        await bulkInsertSession(3, 1, activeUserOne.usid, 0);
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
        await db.tb_user.destroy({
            truncate: true
        });
        await seederInsertRoles.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertStores.down(db.sequelize.getQueryInterface(), Sequelize)

        ////Shutting down connection...
        db.sequelize.close();

        const myResponse = await response(activeToken)
        expect(myResponse.status).toBe(500)
        expect(myResponse.body).toHaveProperty("error")
    });
});