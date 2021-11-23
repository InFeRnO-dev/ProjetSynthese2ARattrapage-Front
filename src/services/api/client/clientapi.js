import axios from "axios";
import { getInStore, TOKEN_KEY } from '../../../services/store'
import { JWTDecode } from "../admin/userapi";
import { getAllProjet } from "../projet/projetapi";
const BASE_URL = "http://localhost:3333/"
const header = {headers: { authorization: `Bearer ${getInStore(TOKEN_KEY)}`} }

export async function getAllClientByEmailUser(){
    const url = BASE_URL + 'client/' + JWTDecode(getInStore(TOKEN_KEY)).login.email
    const result = await axios.get(url, header)
    return result.data
}

export async function getClientsBySearch(search){
    const url = BASE_URL + 'client/' + JWTDecode(getInStore(TOKEN_KEY)).login.email + '/' + search
    const result = await axios.get(url, header)
    return result
}

export async function insertClient(nom, nom_contact, prenom, adresse_1, adresse_2, code_postal, ville, numero_telephone, email) {
    const emailuser = JWTDecode(getInStore(TOKEN_KEY)).login.email
    const url = BASE_URL + "client/add"
    const result = await axios.post(url, {nom: nom, nom_contact: nom_contact, prenom: prenom, adresse_1: adresse_1, adresse_2: adresse_2, code_postal: code_postal, ville: ville, numero_telephone: numero_telephone, email: email, emailuser: emailuser}, header)
    .then((response) => response)
    .catch((error) => console.log(error))

    return result
}

export async function updateClient(nom, nom_contact, prenom, adresse_1, adresse_2, code_postal, ville, numero_telephone, email, id_client) {
    const url = BASE_URL + "client/edit/" + id_client
    const result = await axios.put(url, {nom: nom, nom_contact: nom_contact, prenom: prenom, adresse_1: adresse_1, adresse_2: adresse_2, code_postal: code_postal, ville: ville, numero_telephone: numero_telephone, email: email}, header)
    .then((response) => response)
    .catch((error) => console.log(error))

    return result
}

export async function deleteClient(id_client) {
    const projet = await getAllProjet(id_client, 0)
    if(projet.length === 0){
        const url = BASE_URL + "client/delete/" + id_client
        const result = await axios.delete(url, header)
        .then((response) => response)
        .catch((error) => console.log(error))

        return result
    }
    else{
        return false
    }
    
}