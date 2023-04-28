import { iReturnObject } from "../../../@types/myTypes";
const sessions = require('../../../database/models/').tb_sessions

export default async function checkUserDisponibility(): Promise<iReturnObject> {
    let users = await getActiveSessions();
    console.log(users)

    return {
        success: true
    }
}

async function getActiveSessions(): Promise<object> {
    let allUsers = sessions.findAll({
        where: {
            active: true,
        },
    })
        .then((data: any) => {
            return data
        }).catch((err: Error) => {
            console.log(err)
        })

    return allUsers
}
