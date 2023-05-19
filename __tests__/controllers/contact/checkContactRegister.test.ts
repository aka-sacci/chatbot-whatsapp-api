//IMPORT SUPERTEST
const request = require('supertest')
const testServer = require("../../../src/server")

//Import database
const db = require('../../../src/database/models') 

import { bulkInsertContact } from "../../../src/mocks";
//import mocks
import { sacciData, wrongPhone } from "../../../src/mocks/data/contactData";

describe('checkContactRegister (c)', () => {

    const response = async (phone: string) => {
        const myRequest = await request(testServer)
            .get("/contact/checkcontactregister/" + phone)
            .send()
        return myRequest
    }


    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        await bulkInsertContact(sacciData.phone, sacciData.name)
    })
    it('should return status 200 with a registered number', async () => {
        let myResponse = await response(sacciData.phone)
        expect(myResponse.status).toBe(200)
    });

    it('should return status 404 with a unregistered number', async () => {
        let myResponse = await response(wrongPhone)
        expect(myResponse.status).toBe(404)
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