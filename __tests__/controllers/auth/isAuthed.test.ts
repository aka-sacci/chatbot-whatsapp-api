import jwt from "jsonwebtoken";
import 'dotenv/config'

const { Sequelize } = require('sequelize');

//Import database
const db = require('../../../src/database/models')

//import mocks
import { sessionMockUp } from '../../../src/mocks/sessionMock'
import { userMockUp } from "../../../src/mocks/userMock";
import { activeUserOne, inactiveUserOne } from "../../../src/mocks/data/userData";
import { iUser } from "../../../src/@types/myTypes";
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertSessionStatuses = require('../../../src/database/seeders/20230328004002-insert-session-statuses.js')
const seederInsertStores = require('../../../src/database/seeders/20220509183308-insert-stores.js')

const request = require('supertest')
const testServer = require("../../../src/server")

describe('isAuthed (c)', () => {
    let token: string
    let expiredToken: string
    let invalidToken: string

    //Response function
    const response = async (myToken: string | undefined) => {
        if (myToken != undefined) {
            const myRequest = await request(testServer)
                .get("/auth/isauthed")
                .set('Cookie', `JWT=${myToken}`)
                .send()
            return myRequest
        } else {
            const myRequest = await request(testServer)
                .get("/auth/isauthed")
                .send()
            return myRequest
        }
    }

    const bulkInsertSession = async (id: number, status: number, user: string, active: number) => {
        await sessionMockUp(db.sequelize.getQueryInterface(), Sequelize, id, status, user, active)
    }
    const bulkInsertUser = async (props: iUser) => {
        let { usid, password, name, role, store } = props
        await userMockUp(db.sequelize.getQueryInterface(), Sequelize, usid, password, name, role, store)
    }
    const syncDB = async () => {
        await db.sequelize.sync({ force: true })
        await seederInsertRoles.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertStores.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.up(db.sequelize.getQueryInterface(), Sequelize)
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
        await seederInsertSessionStatuses.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertStores.down(db.sequelize.getQueryInterface(), Sequelize)


        ////Shutting down connection...
        db.sequelize.close();
    })

    it("should return status 200 with a valid token", async () => {
        const myResponse = await response(token)
        expect(myResponse.status).toBe(200)
    })

    it("should return status 403 with a valid token, but a expired session", async () => {
        const myResponse = await response(expiredToken)
        expect(myResponse.status).toBe(403)
    })

    it("should return status 403 with a expired token", async () => {
        const myResponse = await response(expiredToken)
        expect(myResponse.status).toBe(403)
    })

    it("should return status 401 with a missing token", async () => {
        const myResponse = await response(undefined)
        expect(myResponse.status).toBe(401)
    })
})