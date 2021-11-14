import axios from "axios";
import { getInStore, TOKEN_KEY } from '../../../services/store'
import jwt_decode from "jwt-decode";
const BASE_URL = "http://localhost:3333/"
const header = {headers: { authorization: `Bearer ${getInStore(TOKEN_KEY)}`}}

export function JWTDecode() {
    const token = jwt_decode(getInStore(TOKEN_KEY))
    return token
}

export async function getAllUser(){
    const url = BASE_URL + 'user'
    const result = await axios.get(url, header)
    return result.data
}

export async function getUserByEmail(email) {
    const result = await axios.post(BASE_URL + 'user', {email: email})
    .then((response) => response)
    .catch((error) => console.log(error))

    return result.data
}

export async function getTokenByEmail(email, pwd) {
    const result = await axios.post(BASE_URL + 'user/authenticate', {email: email, password: pwd})
    .then((response) => response)
    .catch((error) => console.log(error))

    return result
}

export async function insertUser(email, password, nom, prenom, date_de_naissance, numero_telephone, adresse_1, adresse_2, code_postal, ville, ca_annuel_max, taux_charge, administrator) {
    const url = BASE_URL + "user/add"
    const result = await axios.post(url, {email: email, password: password, nom: nom, prenom: prenom, date_de_naissance: date_de_naissance, numero_telephone: numero_telephone, adresse_1: adresse_1, adresse_2: adresse_2, code_postal: code_postal, ville: ville, ca_annuel_max: ca_annuel_max, taux_charge: taux_charge, administrator: administrator})
    .then((response) => response)
    .catch((error) => console.log(error))

    return result
}

export async function updateUser(id, email, password){
    const url = BASE_URL + "user/edit/" + id
    const result = await axios.put(url, {email: email, password: password})
    .then((response) => response)
    .catch((error) => console.log(error))

    return result
}

export async function deleteUser(id){
    const url = BASE_URL + "user/delete/" + id
    const result = await axios.delete(url)
    .then((response) => response)
    .catch((error) => console.log(error))

    return result
}