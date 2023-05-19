//Import database
const db = require('../../../src/database/models')

//IMPORT SUPERTEST
const request = require('supertest')
const testServer = require("../../../src/server")

import { bulkInsertContact } from "../../../src/mocks";
//Import Mocks
import { sacciData, wrongPhone, jhonatanData } from "../../../src/mocks/data/contactData";

describe('returnContactData (c)', () => {

    const response = async (phone: string) => {
        const myRequest = await request(testServer)
            .get("/contact/returncontactdata/" + phone)
            .send()
        return myRequest
    }

    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        bulkInsertContact(sacciData.phone, sacciData.name, sacciData.address)
        bulkInsertContact(jhonatanData.phone, jhonatanData.name)
    })

    it('should return status 200 and all the contact data with a registered number and address', async () => {
        let myResponse = await response(sacciData.phone)
        expect(myResponse.status).toBe(200)
        expect(myResponse.body.name).toBe(sacciData.name)
        expect(myResponse.body.address.street).toBe(sacciData.address?.street)
        expect(myResponse.body.address.cep).toBe(sacciData.address?.cep)
        expect(myResponse.body.address.district).toBe(sacciData.address?.district)
        expect(myResponse.body.address.number).toBe(sacciData.address?.number)
    });
    it('should return status 206 and the partial contact data, with a registered number but unregistered address', async () => {
        let myResponse = await response(jhonatanData.phone)
        expect(myResponse.status).toBe(206)
        expect(myResponse.body.name).toBe(jhonatanData.name)
        expect(myResponse.body).not.toHaveProperty('address')
    });
    it('should return status 404 with a register that doesn´t exists', async () => {
        let myResponse = await response(wrongPhone)
        expect(myResponse.status).toBe(404)
        expect(myResponse.body.error.name).toBe('ERR_CONTACT_NOT_EXISTS')
    });

    it('should return status 500 and a error', async () => {
        //Cleaning database
        await db.tb_contacts.destroy({
            truncate: true
        })

        ////Shutting down connection...
        db.sequelize.close();

        let myResponse = await response(sacciData.phone)
        expect(myResponse.status).toBe(500)
        expect(myResponse.body).toHaveProperty("error")
    });
});

export { }