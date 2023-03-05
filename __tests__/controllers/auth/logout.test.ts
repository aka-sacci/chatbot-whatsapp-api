import jwt from "jsonwebtoken";
import 'dotenv/config'

const request = require('supertest')
const testServer = require("../../../src/server")

describe('logout (c)', () => {
    let token: string

    //Response function
    const response = async (myToken: string | undefined) => {
        if (myToken != undefined) {
            const myRequest = await request(testServer)
                .get("/auth/logout")
                .set('Cookie', `JWT=${myToken}`)
                .send()
            return myRequest
        } else {
            const myRequest = await request(testServer)
                .get("/auth/logout")
                .send()
            return myRequest
        }
    }

    beforeAll(async () => {

        token = jwt.sign({ usid: "admin" },
            String(process.env.JWT_SECRET),
            { expiresIn: '10s' }
        )
    })

    it('should return status 200 and expire the existing JWT', async () => {
        const myResponse = await response(token)
        expect(myResponse.status).toBe(200)
        expect(myResponse.headers).toHaveProperty('set-cookie')
        expect(myResponse.headers['set-cookie']).toContain('JWT=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')

    });

    it('should return status 200 and expire the JWT, even though it doesn´t exists', async () => {
        const myResponse = await response(token)
        expect(myResponse.status).toBe(200)
        expect(myResponse.headers).toHaveProperty('set-cookie')
        expect(myResponse.headers['set-cookie']).toContain('JWT=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
    });
});