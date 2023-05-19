import { iReturnObject } from "../../../src/@types/myTypes"
const { Sequelize } = require('sequelize');
//Import database
const db = require('../../../src/database/models')

//import seeder
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertDefaultUser = require('../../../src/database/seeders/20230228021930-insert-default-user.js')
const seederInsertSessionStatuses = require('../../../src/database/seeders/20230328004002-insert-session-statuses')
const seederInsertStores = require('../../../src/database/seeders/20220509183308-insert-stores.js')

//Import Service
import login from "../../../src/services/auth/login"

//import mocks
import { bulkInsertSession } from "../../../src/mocks";

//import session model
const session = require('../../../src/database/models/').tb_sessions

describe('login (S)', () => {
    let result: iReturnObject

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

    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        await seederInsertRoles.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertStores.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertDefaultUser.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.up(db.sequelize.getQueryInterface(), Sequelize)

    })
    it('should be successfull in authentication, returning the created session ID and expiring the former session', async () => {
        await bulkInsertSession(1, 1, 'admin', 1);
        result = await login({
            usid: "admin",
            password: "admin",
        })
        let isFormerSessionExpired = await checkIfSessionIsExpired(1)
        expect(result.success).toBe(true)
        expect(result.hasRows).toBe(true)
        expect(result.sessionID).toBe(2)
        expect(isFormerSessionExpired).toBe(true)
    });

    it('should fail in password authentication', async () => {
        result = await login({
            usid: "admin",
            password: "adminErrado",
        })
        expect(result.success).toBe(true)
        expect(result.hasRows).toBe(false)
        expect(result).toHaveProperty("wrongInput")
        expect(result.wrongInput).toBe("password")
    });

    it('should fail in usid authentication', async () => {
        result = await login({
            usid: "adminWrong",
            password: "admin",
        })
        expect(result.success).toBe(true)
        expect(result.hasRows).toBe(false)
        expect(result).toHaveProperty("wrongInput")
        expect(result.wrongInput).toBe("usid")
    });

    it('should throw a connection error', async () => {

        //Cleaning database
        await db.tb_sessions.destroy({
            truncate: true
        })
        await seederInsertDefaultUser.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertRoles.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertStores.down(db.sequelize.getQueryInterface(), Sequelize)

        await db.tb_Role.destroy({
            truncate: true
        })

        ////Shutting down connection...
        db.sequelize.close();
        result = await login({
            usid: "teste",
            password: "teste",
        })

        expect(result.success).toBe(false)
        expect(result).toHaveProperty("error")
    });
});

export { }