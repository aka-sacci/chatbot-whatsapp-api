import { iReturnObject } from "../../../src/@types/myTypes"
const { Sequelize } = require('sequelize');
//Import database
const db = require('../../../src/database/models')

//import seeder
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertDefaultUser = require('../../../src/database/seeders/20230228021930-insert-default-user.js')

//Import Service
import login from "../../../src/services/auth/login"



describe('login (S)', () => {
    let result: iReturnObject

    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        await seederInsertRoles.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertDefaultUser.up(db.sequelize.getQueryInterface(), Sequelize)


    })
    it('should be successfull in authentication', async () => {
        result = await login({
            usid: "admin",
            password: "admin",
        })
        expect(result.success).toBe(true)
        expect(result.hasRows).toBe(true)
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
        //Reverting seeders...
        await seederInsertDefaultUser.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertRoles.down(db.sequelize.getQueryInterface(), Sequelize)

        //Cleaning database
        await db.tb_user.destroy({
            truncate: true
        })
        await db.tb_Role.destroy({
            truncate: true
        });

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