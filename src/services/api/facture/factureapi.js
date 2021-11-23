import axios from "axios";
import { getInStore, TOKEN_KEY } from '../../../services/store'
import { JWTDecode } from "../admin/userapi";
const BASE_URL = "http://localhost:3333/"
const header = {headers: { authorization: `Bearer ${getInStore(TOKEN_KEY)}`} }

export async function getAllFacture(){
    const url = BASE_URL + 'entete_facture/' + JWTDecode(getInStore(TOKEN_KEY)).login.email
    const result = await axios.get(url, header)
    return result.data
}

export async function getNumeroFactureMax(){
    const url = BASE_URL + 'entete_facture/numero_facture_max/' + JWTDecode(getInStore(TOKEN_KEY)).login.email
    const result = await axios.get(url, header)
    return result.data
}

export async function getFactureByIdProjet(id_projet){
    const url = BASE_URL + 'entete_facture/projet/' + id_projet
    const result = await axios.get(url, header)
    return result.data
}

export async function insertFacture(numero_facture, date_edition, date_paiement_limite, date_paiement_effectif, note, id_paiement, id_etat, id_projet){
    const url = BASE_URL + 'entete_facture/add'
    const result = await axios.post(url, {numero_facture: numero_facture, date_edition: date_edition, date_paiement_limite: date_paiement_limite, date_paiement_effectif: date_paiement_effectif, note: note, id_paiement: id_paiement, id_etat: id_etat, id_projet: id_projet}, header)
    .then((response) => response)
    .catch((error) => console.log(error))

    return result
}

export async function updateFacture(id_entete_facture, numero_facture, date_edition, date_paiement_limite, date_paiement_effectif, note, id_paiement, id_etat, id_projet){
    const url = BASE_URL + 'entete_facture/edit/' + id_entete_facture
    const result = await axios.put(url, {numero_facture: numero_facture, date_edition: date_edition, date_paiement_limite: date_paiement_limite, date_paiement_effectif: date_paiement_effectif, note: note, id_paiement: id_paiement, id_etat: id_etat, id_projet: id_projet}, header)
    .then((response) => response)
    .catch((error) => console.log(error))

    return result
}

export async function deleteFacture(id_entete_facture){
    const url = BASE_URL + 'entete_facture/delete/' + id_entete_facture
    const result = await axios.delete(url, header)
    .then((response) => response)
    .catch((error) => console.log(error))

    return result
}
