const { Sequelize } = require('sequelize');

//IMPORT SUPERTEST
const request = require('supertest')
const testServer = require("../../../src/server")

const path = require('path');

describe('sendMessage (c)', () => {
    let img = path.join(process.cwd(), '/src/mocks/data/media/imgMock.jfif')
    const response = async (file: any) => {
        const myRequest = await request(testServer)
            .post("/chat/sendmessage")
            .send()
            .attach('file', file)
        return myRequest
    }

    it('should return the image', async () => {
        let myResponse = await response(img)
        expect(myResponse.status).toBe(200)
    });
});

export { }