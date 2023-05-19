import { iContactAddress, iUser } from "../@types/myTypes";
import { chatHistoryMockUp } from "./chatHistoryMock";
import { chatMockUp } from "./chatMock";
import { contactMockUp } from "./contactMock";
import { sessionMockUp } from './sessionMock'
import { userMockUp } from "./userMock";
const db = require('../../src/database/models')
const { Sequelize } = require('sequelize');

const bulkInsertSession = async (id: number, status: number, user: string, active: number) => {
    await sessionMockUp(db.sequelize.getQueryInterface(), Sequelize, id, status, user, active)
}
const bulkInsertContact = async (phone: string, name: string, address?: iContactAddress) => {
    if (address) {
        await contactMockUp(db.sequelize.getQueryInterface(), Sequelize, phone, name, true, address)
    } else {
        await contactMockUp(db.sequelize.getQueryInterface(), Sequelize, phone, name, true)
    }
}
const bulkInsertUser = async (props: iUser) => {
    let { usid, password, name, role, store } = props
    await userMockUp(db.sequelize.getQueryInterface(), Sequelize, usid, password, name, role, store)
}
const bulkInsertChatHistory = async (id: number, chat: number, session: number, action: number) => {
    await chatHistoryMockUp(db.sequelize.getQueryInterface(), Sequelize, id, chat, session, action)
}
const bulkInsertChat = async (id: number, contact: string, status: number) => {
    await chatMockUp(db.sequelize.getQueryInterface(), Sequelize, id, contact, status)
}

export { bulkInsertChat, bulkInsertChatHistory, bulkInsertUser, bulkInsertContact, bulkInsertSession }