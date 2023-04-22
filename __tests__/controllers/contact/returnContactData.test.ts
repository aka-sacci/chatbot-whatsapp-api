const { Sequelize } = require('sequelize');
import { iContactAddress } from "../../../src/@types/myTypes";
import { contactMockUp } from "../../../src/mocks/contactMock";

//Import database
const db = require('../../../src/database/models')

//IMPORT SUPERTEST
const request = require('supertest')
const testServer = require("../../../src/server")


describe('returnContactData (c)', () => {

    let sacciPhone = "+5511997645981"
    let sacciAddrress: iContactAddress = {
        street: 'Rua João de Passos',
        number: 484,
        district: 'Centro',
        cep: 12960000
    }

    let jhonatanPhone = "+5511955546146"
    let wrongPhone = "+5511995548455"

    const response = async (phone: string) => {
        const myRequest = await request(testServer)
            .get("/contact/returncontactdata/" + phone)
            .send()
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
        bulkInsertContact(sacciPhone, 'Lucas Sacci', sacciAddrress)
        bulkInsertContact(jhonatanPhone, 'Jhonatan Tabajara')
    })

    it('should return status 200 and all the contact data with a registered number and address', async () => {
        let myResponse = await response(sacciPhone)
        expect(myResponse.status).toBe(200)
        expect(myResponse.body.name).toBe('Lucas Sacci')
        expect(myResponse.body.address.street).toBe(sacciAddrress.street)
        expect(myResponse.body.address.cep).toBe(sacciAddrress.cep)
        expect(myResponse.body.address.district).toBe(sacciAddrress.district)
        expect(myResponse.body.address.number).toBe(sacciAddrress.number)
    });
    it('should return status 206 and the partial contact data, with a registered number but unregistered address', async () => {
        let myResponse = await response(jhonatanPhone)
        expect(myResponse.status).toBe(206)
        expect(myResponse.body.name).toBe('Jhonatan Tabajara')
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

        let myResponse = await response(sacciPhone)
        expect(myResponse.status).toBe(500)
        expect(myResponse.body).toHaveProperty("error")
    });
});

export { }