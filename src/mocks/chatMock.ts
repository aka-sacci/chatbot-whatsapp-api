import { Sequelize } from "sequelize";
import { QueryInterface } from "sequelize";


export const chatMockUp = async (queryInterface: QueryInterface, Sequelize: Sequelize, id: number, contact: string, status: number) => {
  await queryInterface.bulkInsert('tb_chats', [{
    id,
    contact,
    status,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {})
   
  .then()
  .catch((err: Error) => {
    console.log(err)
  })

  };


export const chatMockDown = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  await queryInterface.bulkDelete('tb_chats', {});
}
