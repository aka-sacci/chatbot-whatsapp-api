import { iContactData } from "../../../src/@types/myTypes";
import { iContactAddress, iReturnObject } from "../../../src/@types/myTypes"
const { Sequelize } = require('sequelize');


//Import database
const db = require('../../../src/database/models')

//Import Mock
import { contactMockUp } from "../../../src/mocks/contactMock";
import { estefaniData, jhonatanData, sacciData } from "../../../src/mocks/data/contactData";
import getContactAddressAndData from "../../../src/mocks/getContactAddressAndDataMock";

//import service
import registerContact from "../../../src/services/contact/registerContact";


describe('registerContact (s)', () => {
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
        bulkInsertContact(estefaniData.phone, estefaniData.name, estefaniData.address)
    })
    it('should successfully insert a new contact in the database', async () => {
        result = await registerContact({ ...sacciData })
        let contactData: iContactData | null = await getContactAddressAndData(sacciData.phone)

        //Check if service returned a valid response
        expect(result.success).toBe(true)

        //Check if service actually inserted the data
        expect(contactData?.phone).toBe(sacciData.phone)
        expect(contactData?.name).toBe(sacciData.name)
        expect(contactData?.registered).toBe(sacciData.registered)
        expect(contactData?.address?.street).toBe(sacciData.address?.street)
        expect(contactData?.address?.cep).toBe(sacciData.address?.cep)
        expect(contactData?.address?.district).toBe(sacciData.address?.district)
        expect(contactData?.address?.number).toBe(sacciData.address?.number)
    });
    it('should successfully insert a new contact in the database, except his address', async () => {
        result = await registerContact({ ...jhonatanData })
        let contactData: iContactData | null = await getContactAddressAndData(jhonatanData.phone)

        //Check if service returned a valid response
        expect(result.success).toBe(true)

        //Check if service actually inserted the data
        expect(contactData?.phone).toBe(jhonatanData.phone)
        expect(contactData?.name).toBe(jhonatanData.name)
        expect(contactData?.registered).toBe(jhonatanData.registered)
        expect(contactData).not.toHaveProperty('address')
    });
    it('shouldn´t insert a existing contact in the database, throwing the "ERR_CONTACT_ALREADY_EXISTS" error', async () => {
        result = await registerContact({ ...estefaniData })
        expect(result.success).toBe(false)
        expect(result.error?.name).toBe("ERR_CONTACT_ALREADY_EXISTS")
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

        result = await registerContact({ ...sacciData })
        expect(result.success).toBe(false)
        expect(result).toHaveProperty("error")
    });
});

export { }