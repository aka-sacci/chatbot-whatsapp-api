const { Sequelize } = require('sequelize');
import { iContactAddress, iContactData } from "../../../src/@types/myTypes";
import { contactMockUp } from "../../../src/mocks/contactMock";

//Import database
const db = require('../../../src/database/models')

//IMPORT SUPERTEST
const request = require('supertest')
const testServer = require("../../../src/server")

//Import Mocks
import { sacciData, jhonatanData, estefaniData, newEstefaniData } from "../../../src/mocks/data/contactData";
import getContactAddressAndData from "../../../src/mocks/getContactAddressAndDataMock";

describe('updateContact (c)', () => {

    const response = async (contactData: iContactData) => {
        const myRequest = await request(testServer)
            .post("/contact/updatecontact")
            .send({
                ...contactData
            })
        return myRequest
    }

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
    it('should return status 200 and change the data successfully', async () => {
        let myResponse = await response({ ...newEstefaniData })
        let contactData: iContactData | null = await getContactAddressAndData(newEstefaniData.phone)
        expect(myResponse.status).toBe(200)

        //Check if controller actually inserted the data
        expect(contactData?.phone).toBe(newEstefaniData.phone)
        expect(contactData?.name).toBe(newEstefaniData.name)
        expect(contactData?.registered).toBe(newEstefaniData.registered)
        expect(contactData?.address?.street).toBe(newEstefaniData.address?.street)
        expect(contactData?.address?.cep).toBe(newEstefaniData.address?.cep)
        expect(contactData?.address?.district).toBe(newEstefaniData.address?.district)
        expect(contactData?.address?.number).toBe(newEstefaniData.address?.number)
    });
    it('should return status 200 and insert an address', async () => {
        let address: iContactAddress = {
            street: 'Rua Mathias Lopes',
            number: 155,
            district: 'Mascate',
            cep: 12960000,
            complement: ""
        }
        let myResponse = await response({ ...jhonatanData, address })
        let contactData: iContactData | null = await getContactAddressAndData(jhonatanData.phone)
        expect(myResponse.status).toBe(200)

        //Check if service actually inserted the data
        expect(contactData?.phone).toBe(jhonatanData.phone)
        expect(contactData?.name).toBe(jhonatanData.name)
        expect(contactData?.registered).toBe(jhonatanData.registered)
        expect(contactData?.address?.street).toBe(address?.street)
        expect(contactData?.address?.cep).toBe(address?.cep)
        expect(contactData?.address?.district).toBe(address?.district)
        expect(contactData?.address?.number).toBe(address?.number)
    });
    it('should return status 404 with a unregistered contact', async () => {
        let myResponse = await response({ ...sacciData })
        expect(myResponse.status).toBe(404)
        expect(myResponse.body.error.name).toBe("ERR_CONTACT_INVALID")
    });
    it('should return status 500 and a error ', async () => {
        //Cleaning database
        await db.tb_contacts.destroy({
            truncate: true
        })
        await db.tb_contacts_addresses.destroy({
            truncate: true
        })
        
        ////Shutting down connection...
        db.sequelize.close();

        let myResponse = await response({ ...sacciData })
        expect(myResponse.status).toBe(500)
        expect(myResponse.body).toHaveProperty("error")
    });
});