import { iContactData } from "../../../src/@types/myTypes";
import { iContactAddress, iReturnObject } from "../../../src/@types/myTypes"
const { Sequelize } = require('sequelize');

//Import database
const db = require('../../../src/database/models')

//Import Mock
import { contactMockUp } from "../../../src/mocks/contactMock";
import { estefaniData, jhonatanData, sacciData, newEstefaniData } from "../../../src/mocks/data/contactData";
import getContactAddressAndData from "../../../src/mocks/getContactAddressAndDataMock";


//import service
import updateContact from "../../../src/services/contact/updateContact";

describe('updateContact (s)', () => {
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
        bulkInsertContact(jhonatanData.phone, jhonatanData.name)
    })
    it('should successfully update a contact data and address', async () => {
        result = await updateContact({ ...newEstefaniData })
        let contactData: iContactData | null = await getContactAddressAndData(newEstefaniData.phone)
        //Check if service returned a valid response
        expect(result.success).toBe(true)

        //Check if service actually inserted the data
        expect(contactData?.phone).toBe(newEstefaniData.phone)
        expect(contactData?.name).toBe(newEstefaniData.name)
        expect(contactData?.registered).toBe(newEstefaniData.registered)
        expect(contactData?.address?.street).toBe(newEstefaniData.address?.street)
        expect(contactData?.address?.cep).toBe(newEstefaniData.address?.cep)
        expect(contactData?.address?.district).toBe(newEstefaniData.address?.district)
        expect(contactData?.address?.number).toBe(newEstefaniData.address?.number)
    });
    it('should successfully insert the address of a contact', async () => {
        let address: iContactAddress = {
            street: 'Rua Mathias Lopes',
            number: 155,
            district: 'Mascate',
            cep: 12960000
        }
        result = await updateContact({
            ...jhonatanData, address
        })
        let contactData: iContactData | null = await getContactAddressAndData(jhonatanData.phone)
        //Check if service returned a valid response
        expect(result.success).toBe(true)

        //Check if service actually inserted the data
        expect(contactData?.phone).toBe(jhonatanData.phone)
        expect(contactData?.name).toBe(jhonatanData.name)
        expect(contactData?.registered).toBe(jhonatanData.registered)
        expect(contactData?.address?.street).toBe(address?.street)
        expect(contactData?.address?.cep).toBe(address?.cep)
        expect(contactData?.address?.district).toBe(address?.district)
        expect(contactData?.address?.number).toBe(address?.number)
    });
    it('shouldn´t be successfully updating the contact data, because it doesn´t exists', async () => {
        result = await updateContact({ ...sacciData })
        expect(result.success).toBe(false)
        expect(result.error?.name).toBe('ERR_CONTACT_INVALID')
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

        result = await updateContact({ ...estefaniData })
        expect(result.success).toBe(false)
        expect(result).toHaveProperty("error")
    });
});
export { }