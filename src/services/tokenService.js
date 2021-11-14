import { JWTDecode } from "./api/admin/userapi"
import { getInStore, removeInStore, setInStore, TOKEN_KEY } from "./store"


export const setUserLocalStorage = (token) => {
    setInStore(TOKEN_KEY, token)
}

export const removeUserLocalStorage = () => {
    removeInStore(TOKEN_KEY)
}

export const isConnected = () => {
    const token = getInStore(TOKEN_KEY)
    console.log(token);
    if(token){
        if(token.id){
            return true
        }
    }
    return false
}

export const isExpired = () => {
    if(getInStore(TOKEN_KEY) !== false){
        const tokenexp = JWTDecode().exp
        const timestamp = parseInt(Date.now().toString().slice(0,-3))
        if(timestamp < tokenexp) {
            return false
        }
        else {
            return true
        }
    }else {
        return true
    }
    
}

export const logoff = (context) => {
    removeUserLocalStorage()
    context.token = ""
    context.isConnected = false
    context.droits = []
    context.expiration = ""

}