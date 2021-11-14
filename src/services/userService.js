import { JWTDecode } from "./api/admin/userapi"
import { getInStore, TOKEN_KEY } from "./store"
import { isExpired } from "./tokenService"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

export const isAuthorized = () => {
    if(getInStore(TOKEN_KEY) !== false){
        if(isExpired() === false){
            return true
        }else {
            return false
        }
    }else{
        return false
    }
    
}

export const isAdmin = () => {
    const token = JWTDecode()
    console.log(token)
    return token.login.administrator
}