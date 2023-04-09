import { iReturnSeparateToken } from "../@types/myTypes";

export default function returnSeparateToken(fullCookie: String, tokenName: String): iReturnSeparateToken {
    let returnValue: iReturnSeparateToken = {
        tokenExists: false
    }
    let value = `; ${fullCookie}`;
    let parts = value.split(`; ${tokenName}=`);

    if (parts.length === 2) {
        let token = String(String(parts.pop()).split(';').shift());
        returnValue = {
            tokenExists: true,
            separateToken: token
        }
    }

    return returnValue
}