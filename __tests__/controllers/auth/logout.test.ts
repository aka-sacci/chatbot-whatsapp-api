import jwt from "jsonwebtoken";
import 'dotenv/config'
const { Sequelize } = require('sequelize');
import 'dotenv/config'

const request = require('supertest')
const testServer = require("../../../src/server")

//Import database
const db = require('../../../src/database/models')

//import mocks
import { bulkInsertSession } from "../../../src/mocks";

//import seeder
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertDefaultUser = require('../../../src/database/seeders/20230228021930-insert-default-user.js')
const seederInsertSessionStatuses = require('../../../src/database/seeders/20230328004002-insert-session-statuses')
const seederInsertStores = require('../../../src/database/seeders/20220509183308-insert-stores.js')

describe('logout (c)', () => {
    let token: string
    let invalidToken: string
    let expiredToken: string

    //Response function
    const response = async (myToken: string | null) => {
        if (myToken != null) {
            const myRequest = await request(testServer)
                .get("/auth/logout")
                .set('Cookie', `JWT=${myToken}`)
                .send()
            return myRequest
        } else {
            const myRequest = await request(testServer)
                .get("/auth/logout")
                .send()
            return myRequest
        }
    }

    const syncDB = async () => {
        await db.sequelize.sync({ force: true })
        await seederInsertRoles.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertStores.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertDefaultUser.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.up(db.sequelize.getQueryInterface(), Sequelize)
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

    afterAll(async () => {
        await db.tb_sessions.destroy({
            truncate: true
        })
        await seederInsertDefaultUser.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertRoles.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.down(db.sequelize.getQueryInterface(), Sequelize)
        await db.tb_Role.destroy({
            truncate: true
        })
        await seederInsertStores.down(db.sequelize.getQueryInterface(), Sequelize)


        ////Shutting down connection...
        db.sequelize.close();
    })

    it('should return status 200 and expire the existing JWT', async () => {
        const myResponse = await response(token)
        expect(myResponse.status).toBe(200)
        expect(myResponse.headers).toHaveProperty('set-cookie')
        expect(myResponse.headers['set-cookie']).toContain('JWT=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')

    });
    it('should return status 200 and expire the JWT, even though it doesn´t exists', async () => {
        const myResponse = await response(null)
        expect(myResponse.status).toBe(200)
        expect(myResponse.headers).toHaveProperty('set-cookie')
        expect(myResponse.headers['set-cookie']).toContain('JWT=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
    });
    it('should return status 200 and expire the invalid token', async () => {
        const myResponse = await response(invalidToken)
        expect(myResponse.status).toBe(200)
        expect(myResponse.headers).toHaveProperty('set-cookie')
        expect(myResponse.headers['set-cookie']).toContain('JWT=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')

    });
    it('should return status 200 and clear the expired token', async () => {
        const myResponse = await response(expiredToken)
        expect(myResponse.status).toBe(200)
        expect(myResponse.headers).toHaveProperty('set-cookie')
        expect(myResponse.headers['set-cookie']).toContain('JWT=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')

    });
});