import { iReturnObject, iSessionActivityGetter } from "../../../@types/myTypes";
const session = require('../../../database/models/').tb_sessions

export default async function sessionActivityGetter(params: iSessionActivityGetter): Promise<iReturnObject> {
    let { sessionID } = params
    let returnObject: iReturnObject

    try {
        let isActive = await getIsActive(sessionID)
        returnObject = {
            success: true,
            isSessionActive: isActive
        }
    } catch (err: any) {
        let errorToBeThrown = new Error()
        errorToBeThrown.name = err.name;
        errorToBeThrown.message = err.message;

        returnObject = {
            success: false,
            error: errorToBeThrown
        }
    }
    return returnObject
}

async function getIsActive(sessionID: number): Promise<boolean> {
    let isActive = await session
        .findOne(
            {
                where: {
                    id: sessionID
                }
            }
        )
        .then((queryResult: any) => {
            return queryResult.active 
        })

    return isActive
}