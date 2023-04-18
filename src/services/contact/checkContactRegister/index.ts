import { iCheckContactRegister, iReturnObject } from "../../../@types/myTypes";
const contacts = require('../../../database/models/').tb_contacts

export default async function checkContactRegister(props: iCheckContactRegister): Promise<iReturnObject> {
    let { phone } = props
    let returnObject: iReturnObject

    try {
        let contactExists = await getContactRegister(phone)
        returnObject = {
            success: true,
            contactExists
        }
    } catch (err: any) {
        let errToBeThrown = new Error
        errToBeThrown.name = err.name
        errToBeThrown.message = err.message
        returnObject = {
            success: false,
            error: errToBeThrown
        }
    }
    return returnObject
}

async function getContactRegister(phone: string): Promise<boolean> {
    let resut = await contacts
        .findOne(
            {
                where: {
                    phone
                }
            }
        )
        .then((queryResult: any) => {
            switch (queryResult) {
                case null:
                    return false
                default:
                    return true
            }
        })
        
        return resut
}