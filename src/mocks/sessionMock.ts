import { Sequelize } from "sequelize";
import { QueryInterface } from "sequelize";


export const sessionMockUp = async (queryInterface: QueryInterface, Sequelize: Sequelize, id: number, status: number, user: string, active: number) => {
  await queryInterface.bulkInsert('tb_sessions', [{
    id,
    status,
    user,
    active,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {})
  .then()
  .catch((err: Error) => {
    console.log(err)
  })

  };


export const sessionMockDown = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  await queryInterface.bulkDelete('tb_sessions', {});
}
