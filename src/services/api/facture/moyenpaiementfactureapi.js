import axios from "axios";
import { getInStore, TOKEN_KEY } from '../../../services/store'
const BASE_URL = "http://localhost:3333/"
const header = {headers: { authorization: `Bearer ${getInStore(TOKEN_KEY)}`} }

export async function getAllMoyenPaiement(){
    const url = BASE_URL + 'moyen_paiement_facture'
    const result = await axios.get(url, header)
    return result.data
}