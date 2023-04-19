import { iCheckContactRegister, iContactAddress, iContactData, iReturnObject } from "../../../@types/myTypes";
const contacts = require('../../../database/models/').tb_contacts
const contactsAddresses = require('../../../database/models/').tb_contacts_addresses

export default async function returnContactData(props: iCheckContactRegister): Promise<iReturnObject> {
    let { phone } = props
    let returnObject: iReturnObject = {
        success: true
    }

    await getContactData(phone)
        .then((contactData: iContactData) => {
            returnObject = {
                success: true,
                contactData: {
                    ...contactData
                }
            }
        })
        .catch((err: Error) => {
            returnObject = {
                success: false,
                error: err
            }
        })

    return returnObject
}

async function getContactData(phone: string): Promise<iContactData> {
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
                let errToBeThrown = new Error
                errToBeThrown.name = "ERR_CONTACT_NOT_EXISTS"
                errToBeThrown.message = "This contact doesn't exists!"
                throw errToBeThrown
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
