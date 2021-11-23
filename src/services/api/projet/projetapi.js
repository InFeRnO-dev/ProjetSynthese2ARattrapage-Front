import axios from "axios";
import { getInStore, TOKEN_KEY } from '../../../services/store'
import { JWTDecode } from "../admin/userapi";
import { getFactureByIdProjet } from "../facture/factureapi";
const BASE_URL = "http://localhost:3333/"
const header = {headers: { authorization: `Bearer ${getInStore(TOKEN_KEY)}`} }

export async function getAllProjet(id_client, id_statut){
    const url = BASE_URL + 'projet/' + JWTDecode(getInStore(TOKEN_KEY)).login.email + '/' + id_client + '/' + id_statut
    const result = await axios.get(url, header)
    return result.data
}

export async function insertProjet(nom, id_client, id_statut) {
    const url = BASE_URL + "projet/add"
    const result = await axios.post(url, {nom: nom, id_client: id_client, id_statut: id_statut}, header)
    .then((response) => response)
    .catch((error) => console.log(error))

    return result
}

export async function updateProjet(id_projet, nom, id_client, id_statut) {
    const url = BASE_URL + "projet/edit/" + id_projet
    const result = await axios.put(url, {nom: nom, id_client: id_client, id_statut: id_statut}, header)
    .then((response) => response)
    .catch((error) => console.log(error))

    return result
}

export async function deleteProjet(id_projet) {
    const facture = await getFactureByIdProjet(id_projet)
    if(facture.length === 0){
        const url = BASE_URL + "projet/delete/" + id_projet
        const result = await axios.delete(url, header)
        .then((response) => response)
        .catch((error) => console.log(error))

    return result
    }
    else{
        return false
    }
    
}