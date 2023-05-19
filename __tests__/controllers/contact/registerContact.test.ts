import { iContactData } from "../../../src/@types/myTypes";
import { bulkInsertContact } from "../../../src/mocks";

//Import database
const db = require('../../../src/database/models')

//IMPORT SUPERTEST
const request = require('supertest')
const testServer = require("../../../src/server")

//Import Mocks
import { sacciData, jhonatanData, estefaniData } from "../../../src/mocks/data/contactData";
import getContactAddressAndData from "../../../src/mocks/getContactAddressAndDataMock";

describe('registerContact (c)', () => {

    const response = async (contactData: iContactData) => {
        const myRequest = await request(testServer)
            .post("/contact/registercontact")
            .send({
                ...contactData
            })
        return myRequest
    }

    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        bulkInsertContact(estefaniData.phone, estefaniData.name, estefaniData.address)
    })
    it('should successfully insert a new contact with address, returning status 200', async () => {
        let myResponse = await response({ ...sacciData })
        let contactData: iContactData | null = await getContactAddressAndData(sacciData.phone)
        expect(myResponse.status).toBe(200)

        //Check if controller actually inserted the data
        expect(contactData?.phone).toBe(sacciData.phone)
        expect(contactData?.name).toBe(sacciData.name)
        expect(contactData?.registered).toBe(sacciData.registered)
        expect(contactData?.address?.street).toBe(sacciData.address?.street)
        expect(contactData?.address?.cep).toBe(sacciData.address?.cep)
        expect(contactData?.address?.district).toBe(sacciData.address?.district)
        expect(contactData?.address?.number).toBe(sacciData.address?.number)
    });
    it('should successfully insert a new contact without address, returning status 206', async () => {
        let myResponse = await response({ ...jhonatanData })
        let contactData: iContactData | null = await getContactAddressAndData(jhonatanData.phone)
        expect(myResponse.status).toBe(206)

        //Check if controller actually inserted the data
        expect(contactData?.phone).toBe(jhonatanData.phone)
        expect(contactData?.name).toBe(jhonatanData.name)
        expect(contactData?.registered).toBe(jhonatanData.registered)
        expect(contactData).not.toHaveProperty('address')
    });
    it('shouldn`t insert a existing contact in the database, returning status 406', async () => {
        let myResponse = await response({ ...estefaniData })
        expect(myResponse.status).toBe(406)
        expect(myResponse.body.error.name).toBe("ERR_CONTACT_ALREADY_EXISTS")
    });
    it('should return status 500 and a error', async () => {
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

export { }