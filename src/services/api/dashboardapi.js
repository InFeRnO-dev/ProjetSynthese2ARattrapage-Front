import axios from "axios";
import { getInStore, TOKEN_KEY } from '../../services/store'
import { JWTDecode } from "../api/admin/userapi";
const BASE_URL = "http://localhost:3333/"
const header = {headers: { authorization: `Bearer ${getInStore(TOKEN_KEY)}`} }

export async function getCAannuel(annee){
    const url = BASE_URL + 'dashboard/caannuel/' + JWTDecode(getInStore(TOKEN_KEY)).login.email + '/' + annee
    const result = await axios.get(url, header)
    return result.data
}
