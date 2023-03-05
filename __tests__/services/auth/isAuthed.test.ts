import { iReturnObject } from "../../../src/@types/myTypes"
import jwt from "jsonwebtoken";
import 'dotenv/config'

//Import Service
import isAuthed from "../../../src/services/auth/isAuthed"



describe('isAuthed (S)', () => {
    let result: iReturnObject
    let token: string
    let expiredToken: string

    beforeAll(async () => {
        token = jwt.sign({ usid: "teste" },
            String(process.env.JWT_SECRET),
            { expiresIn: '1m' }
        )

        expiredToken = jwt.sign({ usid: "expiredToken" },
            String(process.env.JWT_SECRET),
            { expiresIn: '1ms' }
        )


    })
    it('should successfully check the JWT', async () => {
        result = await isAuthed({ token })
        expect(result.success).toBe(true)
    })
    it('should fail in the JWT check, returning a JsonWebTokenError', async () => {
        result = await isAuthed({ token: "wrongToken" })
        expect(result.success).toBe(false)
        expect(result).toHaveProperty('error')
        expect(result.error?.name).toBe('JsonWebTokenError')
    })
    it('should fail in the JWT check, returning a TokenExpiredError', async () => {
        result = await isAuthed({ token: expiredToken })
        expect(result.success).toBe(false)
        expect(result).toHaveProperty('error')
        expect(result.error?.name).toBe('TokenExpiredError')
    })
});

export { }