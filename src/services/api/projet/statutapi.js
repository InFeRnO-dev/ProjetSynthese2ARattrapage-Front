import axios from "axios";
import { getInStore, TOKEN_KEY } from '../../../services/store'
import { JWTDecode } from "../admin/userapi";
const BASE_URL = "http://localhost:3333/"
const header = {headers: { authorization: `Bearer ${getInStore(TOKEN_KEY)}`} }

export async function getAllStatut(){
    const url = BASE_URL + 'statut/'
    const result = await axios.get(url, header)
    return result.data
}