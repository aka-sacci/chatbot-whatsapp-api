import { iContactAddress, iReturnObject } from "../../../src/@types/myTypes";
const { Sequelize } = require('sequelize');

//Import database
const db = require('../../../src/database/models')
//Import Service
import returnContactData from "../../../src/services/contact/returnContactData";

//Import Mock
import { contactMockUp } from "../../../src/mocks/contactMock";

describe('returnContactData (S)', () => {
    let result: iReturnObject
    let sacciPhone = "+5511997645981"
    let sacciAddrress: iContactAddress = {
        street: 'Rua João de Passos',
        number: 484,
        district: 'Centro',
        cep: 12960000
    }

    let jhonatanPhone = "+5511955546146"
    let wrongPhone = "+5511995548455"

    const bulkInsertContact = async (phone: string, name: string, address?: iContactAddress) => {
        if (address) {
            await contactMockUp(db.sequelize.getQueryInterface(), Sequelize, phone, name, true, address)
        } else {
            await contactMockUp(db.sequelize.getQueryInterface(), Sequelize, phone, name, true)
        }
    }

    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        bulkInsertContact(sacciPhone, 'Lucas Sacci', sacciAddrress)
        bulkInsertContact(jhonatanPhone, 'Jhonatan Tabajara')
    })

    it('should successfully return all the contact data, including the address', async () => {
        result = await returnContactData({ phone: sacciPhone })
        expect(result.success).toBe(true)
        expect(result.contactData?.phone).toBe(sacciPhone)
        expect(result.contactData?.name).toBe('Lucas Sacci')
        expect(result.contactData?.address?.street).toBe(sacciAddrress.street)
        expect(result.contactData?.address?.cep).toBe(sacciAddrress.cep)
        expect(result.contactData?.address?.district).toBe(sacciAddrress.district)
        expect(result.contactData?.address?.number).toBe(sacciAddrress.number)
    });

    it('should successfully return all the contact data, excluding the address', async () => {
        result = await returnContactData({ phone: jhonatanPhone })
        expect(result.success).toBe(true)
        expect(result.contactData?.phone).toBe(jhonatanPhone)
        expect(result.contactData?.name).toBe('Jhonatan Tabajara')
        expect(result.contactData).not.toHaveProperty('address')
    });

    it('should return that the register doesn´t exists, and success = false', async () => {
        result = await returnContactData({ phone: wrongPhone })
        expect(result.success).toBe(false)
        expect(result.error?.name).toBe('ERR_CONTACT_NOT_EXISTS')
    });

    it('should throw a connection error', async () => {
        //Cleaning database
        await db.tb_contacts.destroy({
            truncate: true
        })

        ////Shutting down connection...
        db.sequelize.close();

        result = await returnContactData({
            phone: sacciPhone,
        })

        expect(result.success).toBe(false)
        expect(result).toHaveProperty("error")
    });
});