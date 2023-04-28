import { Sequelize } from "sequelize";
import { QueryInterface } from "sequelize";


export const userMockUp = async (queryInterface: QueryInterface, Sequelize: Sequelize, usid: string, password: string, name: string, role: Number) => {
  await queryInterface.bulkInsert('tb_user', [{
    usid,
    password,
    name,
    role,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {})
  .then()
  .catch((err: Error) => {
    console.log(err)
  })

  };


export const userMockDown = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  await queryInterface.bulkDelete('tb_user', {});
}
