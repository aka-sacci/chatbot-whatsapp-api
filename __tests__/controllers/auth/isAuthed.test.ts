import jwt from "jsonwebtoken";
import 'dotenv/config'

const request = require('supertest')
const testServer = require("../../../src/server")

describe('isAuthed (c)', () => {
    let token: string
    let expiredToken: string

    //Response function
    const response = async (myToken: string | undefined) => {
        if (myToken != undefined) {
            const myRequest = await request(testServer)
                .get("/auth/isauthed")
                .set('Cookie', `JWT=${myToken}`)
                .send()
            return myRequest
        } else {
            const myRequest = await request(testServer)
                .get("/auth/isauthed")
                .send()
            return myRequest
        }
    }

    beforeAll(async () => {

        token = jwt.sign({ usid: "admin" },
            String(process.env.JWT_SECRET),
            { expiresIn: '10s' }
        )

        expiredToken = jwt.sign({ usid: "admin" },
            String(process.env.JWT_SECRET),
            { expiresIn: '1ms' }
        )
    })

    it("should return status 200 with a valid token", async () => {
        const myResponse = await response(token)
        expect(myResponse.status).toBe(200)
    })

    it("should return status 403 with a expired token", async () => {
        const myResponse = await response(expiredToken)
        expect(myResponse.status).toBe(403)
    })

    it("should return status 401 with a missing token", async () => {
        const myResponse = await response(undefined)
        expect(myResponse.status).toBe(401)
    })
})