import { where } from "sequelize";
import { iContactAddress, iContactData, iReturnObject } from "../../../@types/myTypes";
import { error } from "console";
const contacts = require('../../../database/models/').tb_contacts
const contactsAddresses = require('../../../database/models/').tb_contacts_addresses

export default async function updateContact(contactData: iContactData): Promise<iReturnObject> {
    try {
        await updateData(contactData)
        let myContactAddress: iContactAddress = {
            street: String(contactData.address?.street),
            number: Number(contactData.address?.number),
            district: String(contactData.address?.district),
            cep: Number(contactData.address?.cep),
            complement: String(contactData.address?.complement)
        }
        let wasAddressUpdated = await updateAddress(myContactAddress, contactData.phone)
        if (!wasAddressUpdated) await createAddress(myContactAddress, contactData.phone)
        return {
            success: true
        }
    } catch (err: any) {
        return {
            success: false,
            error: err
        }
    }

}

async function updateData(contactData: iContactData): Promise<void> {
    let { phone, name, registered } = contactData
    await contacts
        .update({
            phone,
            name,
            registered
        },
            {
                where: {
                    phone
                }
            })
        .then((data: Array<Number>) => {
            switch (data[0]) {
                case 0:
                    let contactNotFoundError = new Error
                    contactNotFoundError.name = "ERR_CONTACT_INVALID"
                    contactNotFoundError.message = "This contact doesn´t exists!: " + phone
                    throw contactNotFoundError
                case 1:
                    break
                default:
                    let multipleContactsError = new Error
                    multipleContactsError.name = "ERR_MULTIPLE_CONTACTS_EXISTING"
                    multipleContactsError.message = "There is multiple contacts with this same number: " + phone
                    throw multipleContactsError
            }
        })
        .catch((err: Error) => {
            throw err
        })
}

async function updateAddress(contactAddress: iContactAddress, contact: string): Promise<boolean> {
    let result = await contactsAddresses
        .update({
            ...contactAddress
        },
            {
                where: {
                    contact
                }
            })
        .then((data: Array<Number>) => {
            switch (data[0]) {
                case 0:
                    return false
                case 1:
                    return true
                default:
                    let multipleAddressessError = new Error
                    multipleAddressessError.name = "ERR_MULTIPLE_ADDRESSESS_EXISTING"
                    multipleAddressessError.message = "There is multiple addressess with this same number: " + contact
                    throw multipleAddressessError
            }
        })
        .catch((err: Error) => {
            throw err
        })
    return result
}

async function createAddress(contactAddress: iContactAddress, phone: string): Promise<void> {
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