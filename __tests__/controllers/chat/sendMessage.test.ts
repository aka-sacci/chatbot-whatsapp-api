const { Sequelize } = require('sequelize');
import { iSendMessageController, iUser } from "../../../src/@types/myTypes";
import { chatHistoryMockUp } from "../../../src/mocks/chatHistoryMock";
import { chatMockUp } from "../../../src/mocks/chatMock";
import { contactMockUp } from "../../../src/mocks/contactMock";
import { sacciData } from "../../../src/mocks/data/contactData";
import { activeUserOne, inactiveUserOne } from "../../../src/mocks/data/userData";

//Import database
const db = require('../../../src/database/models')

//import seeder
const seederInsertRoles = require('../../../src/database/seeders/20230228021532-insert-roles.js')
const seederInsertChatsHistoryAction = require('../../../src/database/seeders/20230329162645-insert-chats-history-actions.js')
const seederInsertSessionStatuses = require('../../../src/database/seeders/20230328004002-insert-session-statuses.js')
const seederInsertChatStatuses = require('../../../src/database/seeders/20230328021018-insert-chats-statuses.js')
const seederInsertStores = require('../../../src/database/seeders/20220509183308-insert-stores.js')
const seederInsertSenders = require('../../../src/database/seeders/20230511163127-insert-message-senders')
const seederInsertMessagesTypes = require('../../../src/database/seeders/20230331125028-insert-messages-types')

//import mocks
import { sessionMockUp } from '../../../src/mocks/sessionMock'
import { userMockUp } from "../../../src/mocks/userMock";

//import session model
const messages = require('../../../src/database/models/').tb_messages
const talks = require('../../../src/database/models/').tb_talks


//IMPORT SUPERTEST
const request = require('supertest')
const testServer = require("../../../src/server")

const path = require('path');
const fs = require('fs');

describe('sendMessage (c)', () => {
    let imgTest = path.join(process.cwd(), '/src/mocks/data/media/imageMock.jfif')
    let audioTest = path.join(process.cwd(), '/src/mocks/data/media/audioMock.mp3')
    let videoTest = path.join(process.cwd(), '/src/mocks/data/media/videoMock.mp4')
    let pttTest = path.join(process.cwd(), '/src/mocks/data/media/pttMock.opus')
    let docTest = path.join(process.cwd(), '/src/mocks/data/media/documentMock.pdf')

    const response = async (messageToBeSend: iSendMessageController) => {
        let { chat, sender, type, content, filename } = messageToBeSend
        const myRequest = await request(testServer)
            .post("/chat/sendmessage")
            .field('chat', chat)
            .field('sender', sender)
            .field('type', type)
            .field('content', content)
            .attach('file', filename)
        return myRequest
    }

    const bulkInsertSession = async (id: number, status: number, user: string, active: number) => {
        await sessionMockUp(db.sequelize.getQueryInterface(), Sequelize, id, status, user, active)
    }
    const bulkInsertContact = async (phone: string, name: string) => {
        await contactMockUp(db.sequelize.getQueryInterface(), Sequelize, phone, name, true)
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

    const checkTalkQtd = async (chatID: number): Promise<number> => {
        const result = talks
            .count({
                where: {
                    chat: chatID
                }
            })
            .then((queryResult: any) => {
                return queryResult
            })
        return result
    }

    const checkIfMessageWasInserted = async (content: string, type: number): Promise<boolean> => {
        const result = messages
            .findOne(
                {
                    where: {
                        content,
                        type,
                    }
                })
            .then((queryResult: any) => {
                if (queryResult === null) return false
                else return true
            })
        return result
    }

    const getMediaName = async (content: string, type: number): Promise<String> => {
        const result = messages
            .findOne(
                {
                    where: {
                        content,
                        type
                    }
                })
            .then((queryResult: any) => {
                return queryResult.filename
            })
        return result
    }

    const checkIfMediaExists = async (content: string, type: number): Promise<boolean> => {
        let mediaName = await getMediaName(content, type)
        let mediaSrc = path.join(process.cwd(), '/src/assets/talks/' + mediaName)
        let result = fs.existsSync(mediaSrc)
        if (result === true) await deleteMedia(mediaSrc)
        return result
    }

    const deleteMedia = async (path: string) => {
        await fs.unlink(path, () => {
            return
        });
    }

    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
        //Insere dados comuns
        await seederInsertRoles.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertChatsHistoryAction.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertChatStatuses.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertStores.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSenders.up(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertMessagesTypes.up(db.sequelize.getQueryInterface(), Sequelize)
        await bulkInsertContact(sacciData.phone, sacciData.name)
        await bulkInsertUser({ ...activeUserOne })
        await bulkInsertUser({ ...inactiveUserOne })
        await bulkInsertSession(1, 1, activeUserOne.usid, 1)
        await bulkInsertChat(1, sacciData.phone, 1)
        await bulkInsertChatHistory(1, 1, 1, 1)
    })

    beforeEach(async () => {
        await db.tb_talks.destroy({
            truncate: true
        })
        await db.tb_messages.destroy({
            truncate: true
        })
    })
    it('should successfully insert a new text message in the database, with a valid session and a valid chat, returning status 200', async () => {
        let validTextMessage: iSendMessageController = {
            chat: 1,
            sender: 1,
            type: 'chat',
            content: 'Olá! Mensagem teste'
        }
        let myRequest = await response(validTextMessage)
        let talksQtd = await checkTalkQtd(1)
        let wasMessageInserted = await checkIfMessageWasInserted(validTextMessage.content, 1)
        expect(myRequest.status).toBe(200)
        expect(talksQtd).toBe(1)
        expect(wasMessageInserted).toBe(true)
    });
    it('should successfully insert a new image in the database, with a valid session and a valid contact, returning status 200', async () => {
        let validImageMessage: iSendMessageController = {
            chat: 1,
            sender: 1,
            type: 'image',
            content: 'Olá! Mídia teste (imagem)',
            filename: imgTest
        }
        let myRequest = await response(validImageMessage)
        let talksQtd = await checkTalkQtd(1)
        let wasMessageInserted = await checkIfMessageWasInserted(validImageMessage.content, 2)
        let wasMediaInserted = await checkIfMediaExists(validImageMessage.content, 2)
        expect(myRequest.status).toBe(200)
        expect(talksQtd).toBe(1)
        expect(wasMessageInserted).toBe(true)
        expect(wasMediaInserted).toBe(true)
    });
    it('should successfully insert a new audio in the database, with a valid session and a valid contact, returning status 200', async () => {
        let validAudioMessage: iSendMessageController = {
            chat: 1,
            sender: 1,
            type: 'audio',
            content: 'Olá! Mídia teste (audio)',
            filename: audioTest
        }
        let myRequest = await response(validAudioMessage)
        let talksQtd = await checkTalkQtd(1)
        let wasMessageInserted = await checkIfMessageWasInserted(validAudioMessage.content, 3)
        let wasMediaInserted = await checkIfMediaExists(validAudioMessage.content, 3)
        expect(myRequest.status).toBe(200)
        expect(talksQtd).toBe(1)
        expect(wasMessageInserted).toBe(true)
        expect(wasMediaInserted).toBe(true)
    });
    it('should successfully insert a new video in the database, with a valid session and a valid contact, returning status 200', async () => {
        let validVideoMessage: iSendMessageController = {
            chat: 1,
            sender: 1,
            type: 'video',
            content: 'Olá! Mídia teste (video)',
            filename: videoTest
        }
        let myRequest = await response(validVideoMessage)
        let talksQtd = await checkTalkQtd(1)
        let wasMessageInserted = await checkIfMessageWasInserted(validVideoMessage.content, 4)
        let wasMediaInserted = await checkIfMediaExists(validVideoMessage.content, 4)
        expect(myRequest.status).toBe(200)
        expect(talksQtd).toBe(1)
        expect(wasMessageInserted).toBe(true)
        expect(wasMediaInserted).toBe(true)
    });
    it('should successfully insert a new ptt in the database, with a valid session and a valid contact, returning status 200', async () => {
        let validPptMessage: iSendMessageController = {
            chat: 1,
            sender: 1,
            type: 'ptt',
            content: 'Olá! Mídia teste (audio de whatsapp)',
            filename: pttTest
        }
        let myRequest = await response(validPptMessage)
        let talksQtd = await checkTalkQtd(1)
        let wasMessageInserted = await checkIfMessageWasInserted(validPptMessage.content, 6)
        let wasMediaInserted = await checkIfMediaExists(validPptMessage.content, 6)
        expect(myRequest.status).toBe(200)
        expect(talksQtd).toBe(1)
        expect(wasMessageInserted).toBe(true)
        expect(wasMediaInserted).toBe(true)
    });
    it('should successfully insert a new document in the database, with a valid session and a valid contact, returning status 200', async () => {
        let validDocMessage: iSendMessageController = {
            chat: 1,
            sender: 1,
            type: 'document',
            content: 'Olá! Mídia teste (documento)',
            filename: docTest
        }
        let myRequest = await response(validDocMessage)
        let talksQtd = await checkTalkQtd(1)
        let wasMessageInserted = await checkIfMessageWasInserted(validDocMessage.content, 8)
        let wasMediaInserted = await checkIfMediaExists(validDocMessage.content, 8)
        expect(myRequest.status).toBe(200)
        expect(talksQtd).toBe(1)
        expect(wasMessageInserted).toBe(true)
        expect(wasMediaInserted).toBe(true)
    });
    it('should fail in insert a new text message in the database, with a nonexisting chat, returning status 404', async () => {
        let validInexistingChatMessage: iSendMessageController = {
            chat: 5,
            sender: 1,
            type: 'chat',
            content: 'Olá! chat teste',
        }
        let myRequest = await response(validInexistingChatMessage)
        let talksQtd = await checkTalkQtd(1)
        let wasMessageInserted = await checkIfMessageWasInserted(validInexistingChatMessage.content, 1)
        expect(myRequest.status).toBe(404)
        expect(myRequest.body.error.name).toBe('ERR_CHAT_NOT_EXISTS')
        expect(talksQtd).toBe(0)
        expect(wasMessageInserted).toBe(false)
    });
    it('should fail in insert a new image in the database, with a nonexisting chat, returning status 404 and not saving the media', async () => {
        let validInexistingMediaMessage: iSendMessageController = {
            chat: 5,
            sender: 1,
            type: 'chat',
            content: 'Olá! Mídia teste (imagem)',
            filename: imgTest
        }
        let myRequest = await response(validInexistingMediaMessage)
        let talksQtd = await checkTalkQtd(1)
        let wasMessageInserted = await checkIfMessageWasInserted(validInexistingMediaMessage.content, 2)
        expect(myRequest.status).toBe(404)
        expect(myRequest.body.error.name).toBe('ERR_CHAT_NOT_EXISTS')
        expect(talksQtd).toBe(0)
        expect(wasMessageInserted).toBe(false)
    });
    it('should fail in insert a new message in the database, with a invalid chat, returning status 403', async () => {
        await bulkInsertChat(2, sacciData.phone, 2)
        await bulkInsertChatHistory(2, 2, 1, 3)
        let invalidChatMessage: iSendMessageController = {
            chat: 2,
            sender: 1,
            type: 'chat',
            content: 'Olá! chat teste',
        }
        let myRequest = await response(invalidChatMessage)
        let talksQtd = await checkTalkQtd(1)
        let wasMessageInserted = await checkIfMessageWasInserted(invalidChatMessage.content, 1)
        expect(myRequest.status).toBe(403)
        expect(myRequest.body.error.name).toBe('ERR_CHAT_INVALID')
        expect(talksQtd).toBe(0)
        expect(wasMessageInserted).toBe(false)
    });
    it('should fail in insert a new image in the database, with a invalid chat, returning status 403 and not saving the media', async () => {
        await bulkInsertChat(3, sacciData.phone, 2)
        await bulkInsertChatHistory(3, 2, 1, 3)
        let invalidMediaMessage: iSendMessageController = {
            chat: 3,
            sender: 1,
            type: 'chat',
            content: 'Olá! Mídia teste (imagem)',
            filename: imgTest
        }
        let myRequest = await response(invalidMediaMessage)
        let talksQtd = await checkTalkQtd(1)
        let wasMessageInserted = await checkIfMessageWasInserted(invalidMediaMessage.content, 2)
        expect(myRequest.status).toBe(403)
        expect(myRequest.body.error.name).toBe('ERR_CHAT_INVALID')
        expect(talksQtd).toBe(0)
        expect(wasMessageInserted).toBe(false)
    });
    it('should throw a connection error', async () => {
        await db.tb_messages.destroy({
            truncate: true
        });
        await db.tb_talks.destroy({
            truncate: true
        });
        await db.tb_chats_history.destroy({
            truncate: true
        });
        await db.tb_chats.destroy({
            truncate: true
        });
        await db.tb_sessions.destroy({
            truncate: true
        });
        await db.tb_user.destroy({
            truncate: true
        });

        await seederInsertRoles.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertSessionStatuses.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertChatsHistoryAction.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertChatStatuses.down(db.sequelize.getQueryInterface(), Sequelize)
        await seederInsertStores.down(db.sequelize.getQueryInterface(), Sequelize)


        ////Shutting down connection...
        db.sequelize.close();

        let invalidMessage: iSendMessageController = {
            chat: 1,
            sender: 1,
            type: 'chat',
            content: 'Olá! Mídia teste (imagem)',
        }
        let myRequest = await response(invalidMessage)
        expect(myRequest.status).toBe(500)
        expect(myRequest.body).toHaveProperty('error')
    });

});

export { }