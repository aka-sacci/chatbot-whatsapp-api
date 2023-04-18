import { iReturnObject } from "../../../src/@types/myTypes"
const { Sequelize } = require('sequelize');

//Import database
const db = require('../../../src/database/models')
//Import Service
import checkContactRegister from "../../../src/services/contact/checkContactRegister";

//Import Mock
import { contactMockUp } from "../../../src/mocks/contactMock";

describe('checkContactRegister (s)', () => {
    let result: iReturnObject
    let myPhone = "+5511997645981"

    const bulkInsertContact = async (phone: string, name: string) => {
        await contactMockUp(db.sequelize.getQueryInterface(), Sequelize, phone, name, true)
    }

    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        bulkInsertContact(myPhone, 'Lucas Sacci')
    })
    it('should successfully return that the register exists', async () => {
        result = await checkContactRegister({
            phone: myPhone
        })
        expect(result.success).toBe(true)
        expect(result.contactExists).toBe(true)
    });

    it('should successfully return that the register doesn´t exists', async () => {
        result = await checkContactRegister({
            phone: '+551195378468'
        })
        expect(result.success).toBe(true)
        expect(result.contactExists).toBe(false)
    });

    it('should throw a connection error', async () => {
        //Cleaning database
        await db.tb_contacts.destroy({
            truncate: true
        })

        ////Shutting down connection...
        db.sequelize.close();

        result = await checkContactRegister({
            phone: myPhone,
        })

        expect(result.success).toBe(false)
        expect(result).toHaveProperty("error")
    });
});