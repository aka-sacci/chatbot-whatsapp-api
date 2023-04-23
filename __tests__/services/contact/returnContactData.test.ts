import { iContactAddress, iReturnObject } from "../../../src/@types/myTypes";
const { Sequelize } = require('sequelize');

//Import database
const db = require('../../../src/database/models')
//Import Service
import returnContactData from "../../../src/services/contact/returnContactData";

//Import Mock
import { contactMockUp } from "../../../src/mocks/contactMock";
import { jhonatanData, sacciData, wrongPhone } from "../../../src/mocks/data/contactData";

describe('returnContactData (S)', () => {
    let result: iReturnObject

    const bulkInsertContact = async (phone: string, name: string, address?: iContactAddress) => {
        if (address) {
            await contactMockUp(db.sequelize.getQueryInterface(), Sequelize, phone, name, true, address)
        } else {
            await contactMockUp(db.sequelize.getQueryInterface(), Sequelize, phone, name, true)
        }
    }

    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        bulkInsertContact(sacciData.phone, sacciData.name, sacciData.address)
        bulkInsertContact(jhonatanData.phone, jhonatanData.name)
    })

    it('should successfully return all the contact data, including the address', async () => {
        result = await returnContactData({ phone: sacciData.phone })
        expect(result.success).toBe(true)
        expect(result.contactData?.phone).toBe(sacciData.phone)
        expect(result.contactData?.name).toBe(sacciData.name)
        expect(result.contactData?.address?.street).toBe(sacciData.address?.street)
        expect(result.contactData?.address?.cep).toBe(sacciData.address?.cep)
        expect(result.contactData?.address?.district).toBe(sacciData.address?.district)
        expect(result.contactData?.address?.number).toBe(sacciData.address?.number)
    });

    it('should successfully return all the contact data, excluding the address', async () => {
        result = await returnContactData({ phone: jhonatanData.phone })
        expect(result.success).toBe(true)
        expect(result.contactData?.phone).toBe(jhonatanData.phone)
        expect(result.contactData?.name).toBe(jhonatanData.name)
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
        await db.tb_contacts_addresses.destroy({
            truncate: true
        })

        ////Shutting down connection...
        db.sequelize.close();

        result = await returnContactData({
            phone: sacciData.phone,
        })

        expect(result.success).toBe(false)
        expect(result).toHaveProperty("error")
    });
});