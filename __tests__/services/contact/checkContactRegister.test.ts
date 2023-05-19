import { iReturnObject } from "../../../src/@types/myTypes"

//Import database
const db = require('../../../src/database/models')

//Import Service
import checkContactRegister from "../../../src/services/contact/checkContactRegister";

//Import Mock
import { sacciData, wrongPhone } from "../../../src/mocks/data/contactData";
import { bulkInsertContact } from "../../../src/mocks";
describe('checkContactRegister (s)', () => {
    let result: iReturnObject

    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        bulkInsertContact(sacciData.phone, sacciData.name)
    })

    it('should successfully return that the register exists', async () => {
        result = await checkContactRegister({
            phone: sacciData.phone
        })
        expect(result.success).toBe(true)
        expect(result.contactExists).toBe(true)
    });

    it('should successfully return that the register doesn´t exists', async () => {
        result = await checkContactRegister({
            phone: wrongPhone
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
            phone: sacciData.phone,
        })

        expect(result.success).toBe(false)
        expect(result).toHaveProperty("error")
    });
});