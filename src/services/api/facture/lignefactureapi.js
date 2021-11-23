import axios from "axios";
import { getInStore, TOKEN_KEY } from '../../../services/store'
import { JWTDecode } from "../admin/userapi";
const BASE_URL = "http://localhost:3333/"
const header = {headers: { authorization: `Bearer ${getInStore(TOKEN_KEY)}`} }

export async function getAllLigneFactureByIdFacture(numero_facture){
    const url = BASE_URL + 'ligne_facture/' + numero_facture
    const result = await axios.get(url, header)
    return result.data
}

export async function insertLigneFacture(libelle, quantite, prix_unitaire, id_entete_facture){
    const url = BASE_URL + 'ligne_facture/add'
    const result = await axios.post(url, {libelle: libelle, quantite: quantite, prix_unitaire: prix_unitaire, id_entete_facture: id_entete_facture}, header)
    .then((response) => response)
    .catch((error) => console.log(error))
}

export async function updateLigneFacture(id_ligne_facture, libelle, quantite, prix_unitaire, id_entete_facture){
    const url = BASE_URL + 'ligne_facture/edit/' + id_ligne_facture
    const result = await axios.put(url, {libelle: libelle, quantite: quantite, prix_unitaire: prix_unitaire, id_entete_facture: id_entete_facture}, header)
    .then((response) => response)
    .catch((error) => console.log(error))
}

export async function deleteLigneFacture(id_ligne_facture){
    const url = BASE_URL + 'ligne_facture/delete/' + id_ligne_facture
    const result = await axios.delete(url, header)
    .then((response) => response)
    .catch((error) => console.log(error))
}
