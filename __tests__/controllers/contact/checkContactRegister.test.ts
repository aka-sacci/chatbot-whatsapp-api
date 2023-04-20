import { contactMockUp } from "../../../src/mocks/contactMock";

const { Sequelize } = require('sequelize');

//IMPORT SUPERTEST
const request = require('supertest')
const testServer = require("../../../src/server")

//Import database
const db = require('../../../src/database/models') 

describe('checkContactRegister (c)', () => {
    let myPhone = "+5511997645981"
    let wrongPhone = "+551159597874"

    const response = async (phone: string) => {
        const myRequest = await request(testServer)
            .get("/contact/checkcontactregister/" + phone)
            .send()
        return myRequest
    }

    const bulkInsertContact = async (phone: string, name: string) => {
        await contactMockUp(db.sequelize.getQueryInterface(), Sequelize, phone, name, true)
    }


    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        await bulkInsertContact(myPhone, 'Lucas Sacci')
    })
    it('should return status 200 with a registered number', async () => {
        let myResponse = await response(myPhone)
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

        let myResponse = await response(myPhone)
        expect(myResponse.status).toBe(500)
        expect(myResponse.body).toHaveProperty("error")
    });
});

export { }