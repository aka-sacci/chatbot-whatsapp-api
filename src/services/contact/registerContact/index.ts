import { iContactAddress, iContactData, iReturnObject } from "../../../@types/myTypes";
const contacts = require('../../../database/models/').tb_contacts
const contactsAddresses = require('../../../database/models/').tb_contacts_addresses

export default async function registerContact(contactData: iContactData): Promise<iReturnObject> {
    try {
        await registerData(contactData)
        if (contactData.address) await registerAddress(contactData.address, contactData.phone)
        return {
            success: true
        }
    } catch (err: any) {
        return {
            success: false,
            error: {
                message: err.message,
                name: err.name
            }
        }
    }
}

async function registerData(contactData: iContactData): Promise<void> {
    let { phone, name, registered } = contactData
    await contacts
        .create({
            phone,
            name,
            registered
        })
        .catch((err: Error) => {
            let newError = new Error
            newError.name = err.name
            newError.message = err.message

            if (err.name === "SequelizeUniqueConstraintError") {
                newError.name = "ERR_CONTACT_ALREADY_EXISTS"
                newError.message = "This contact already exists!"
            }

            throw newError
        })
}

async function registerAddress(contactAddress: iContactAddress, phone: string): Promise<void> {
    let { street, number, district, cep, complement } = contactAddress
    await contactsAddresses
        .create({
            contact: phone,
            street,
            number,
            district,
            cep,
            complement
        })
        .catch((err: Error) => {
            throw err
        })
}