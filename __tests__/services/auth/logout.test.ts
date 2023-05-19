import { iReturnObject } from "../../../src/@types/myTypes"
const { Sequelize } = require('sequelize');
import jwt from "jsonwebtoken";
import 'dotenv/config'

//Import database
const db = require('../../../src/database/models')

//Import Service
import logout from "../../../src/services/auth/logout"

//import mocks
import { bulkInsertSession } from "../../../src/mocks";
import { checkIfSessionIsExpired } from "../../../src/utils/testsFunctions";


//import seeder
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertDefaultUser = require('../../../src/database/seeders/20230228021930-insert-default-user.js')
const seederInsertSessionStatuses = require('../../../src/database/seeders/20230328004002-insert-session-statuses')
const seederInsertStores = require('../../../src/database/seeders/20220509183308-insert-stores.js')

describe('logout (s)', () => {
    let result: iReturnObject
    let token: string
    let invalidToken: string
    let expiredToken: string

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

        result = await logout({
            token
        })

        expect(result.success).toBe(false)
        expect(result).toHaveProperty("error")
    });
})