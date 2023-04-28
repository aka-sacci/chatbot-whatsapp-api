import { sessionMockUp } from "../../../src/mocks/sessionMock";

const { Sequelize } = require('sequelize');

//IMPORT SUPERTEST
const request = require('supertest')
const testServer = require("../../../src/server")

//Import database
const db = require('../../../src/database/models')

//import seeder
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertDefaultUser = require('../../../src/database/seeders/20230228021930-insert-default-user.js')
const seederInsertSessionStatuses = require('../../../src/database/seeders/20230328004002-insert-session-statuses')

describe('login (c)', () => {
    const response = async (usid: string, password: string) => {
        const myRequest = await request(testServer)
            .post("/auth/login")
            .send({
                usid: usid,
                password: password
            })
        return myRequest
    }

    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        await seederInsertRoles.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertDefaultUser.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.up(db.sequelize.getQueryInterface(), Sequelize)
    })

    it('should return status 200 and a JWT token', async () => {
        const myResponse = await response("admin", "admin")
        expect(myResponse.status).toBe(200)
        expect(myResponse.headers).toHaveProperty('set-cookie')
    });
    it('should return status 404 and a attribute to accuse the wrong input as "usid"', async () => {
        const myResponse = await response("adminErrado", "admin")
        expect(myResponse.status).toBe(404)
        expect(myResponse.body).toHaveProperty("wrongInput")
        expect(myResponse.body.wrongInput).toBe("usid")
    })

    it('should return status 404 and a attribute to accuse the wrong input as "password"', async () => {
        const myResponse = await response("admin", "adminErrado")
        expect(myResponse.status).toBe(404)
        expect(myResponse.body).toHaveProperty("wrongInput")
        expect(myResponse.body.wrongInput).toBe("password")
    })
    it('should return status 500 and a error', async () => {
        //Cleaning database
        await db.tb_sessions.destroy({
            truncate: true
        })
        await seederInsertDefaultUser.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertRoles.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.down(db.sequelize.getQueryInterface(), Sequelize)
        await db.tb_Role.destroy({
            truncate: true
        })
        ////Shutting down connection...
        db.sequelize.close();

        const myResponse = await response("admin", "admin")
        expect(myResponse.status).toBe(500)
        expect(myResponse.body).toHaveProperty("error")
    });

});