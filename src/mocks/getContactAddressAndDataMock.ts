import { iContactAddress, iContactData } from "../@types/myTypes"
const contacts = require('../database/models/').tb_contacts
const contactsAddresses = require('../database/models/').tb_contacts_addresses

export default async function getContactAddressAndData(phone: string): Promise<iContactData | null> {
    let result = await contacts
        .findOne(
            {
                include: {
                    model: contactsAddresses,
                },
                where: {
                    phone
                }
            }

        )
        .then((queryResult: any) => {
            if (queryResult === null) {
                return null
            } else {
                let returnedData: iContactData
                let { name, registered } = queryResult
                let contactData: iContactData =
                {
                    phone,
                    name,
                    registered
                }
                if (queryResult.tb_contacts_address) {
                    let { id, street, number, district, cep, complement } = queryResult.tb_contacts_address
                    let contactAddressData: iContactAddress = {
                        id,
                        street,
                        number,
                        district,
                        cep,
                        complement
                    }

                    returnedData = {
                        ...contactData,
                        address: {
                            ...contactAddressData
                        }
                    }
                    return returnedData
                } else {
                    returnedData = {
                        ...contactData,
                    }

                }
                return returnedData
            }
        })
    return result
}