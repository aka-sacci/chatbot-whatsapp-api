import { Sequelize } from "sequelize";
import { QueryInterface } from "sequelize";
import { iContactAddress } from "../@types/myTypes";


export const contactMockUp = async (queryInterface: QueryInterface, Sequelize: Sequelize, phone: string, name: string, registered: boolean, address?: iContactAddress) => {
    await queryInterface.bulkInsert('tb_contacts', [{
        phone,
        name,
        registered,
        createdAt: new Date(),
        updatedAt: new Date()
    }], {})
        .then()
        .catch((err: Error) => {
            console.log(err)
        })

    if (address) {
        console.log("will insert address")
        let { street, number, district, cep, complement } = address
        await queryInterface.bulkInsert('tb_contacts_addresses', [{
            street,
            number,
            district,
            cep,
            complement,
            createdAt: new Date(),
            updatedAt: new Date()
        }], {})
            .then()
            .catch((err: Error) => {
                console.log(err)
            })
    }

};


export const contactMockDown = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    await queryInterface.bulkDelete('tb_contacts', {});
}
