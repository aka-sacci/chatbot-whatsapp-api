import { Sequelize } from "sequelize";
import { QueryInterface } from "sequelize";


export const chatHistoryMockUp = async (queryInterface: QueryInterface, Sequelize: Sequelize, id: number, chat: number, session: number, action: number) => {
  await queryInterface.bulkInsert('tb_chats_histories', [{
    id,
    chat,
    session,
    action,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {})
  .then()
  .catch((err: Error) => {
    console.log(err)
  })

  };


export const chatHistoryMockDown = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  await queryInterface.bulkDelete('tb_chats_histories', {});
}
