import { FormHelperText, MenuItem, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { getAllEtatFacture } from '../../services/api/facture/etatfactureapi'
import { deleteFacture, getNumeroFactureMax, updateFacture } from '../../services/api/facture/factureapi'
import { getAllLigneFactureByIdFacture } from '../../services/api/facture/lignefactureapi'
import { getAllMoyenPaiement } from '../../services/api/facture/moyenpaiementfactureapi'
import { getAllProjet } from '../../services/api/projet/projetapi'
import { formatDate, formHandleChange } from '../../services/formService'
import { isAuthorized } from '../../services/userService';
import InputLabel from '../form/inputLabel'
import { Redirect } from 'react-router'
toast.configure()

export default function FactureLine(props){
    const [numerofacturemin, setnumerofacturemin] = useState()
    const [numerofactureact, setnumerofactureact] = useState(props.facture.numero_facture)
    const [identetefacture, setidentetefacture] = useState(props.facture.id_entete_facture)
    const [lignesfactures, setlignesfactures] = useState([])
    const [prixtotal, setprixtotal] = useState(0)
    const [facture, setfacture] = useState({numero_facture: props.facture.numero_facture,
                                            date_edition: formatDate(props.facture.date_edition),
                                            date_paiement_limite: formatDate(props.facture.date_paiement_limite),
                                            date_paiement_effectif: props.facture.date_paiement_effectif !== null ? formatDate(props.facture.date_paiement_effectif) : props.facture.date_paiement_effectif,
                                            note: props.facture.note,
                                            id_etat: props.facture.id_etat,
                                            id_paiement: props.facture.id_paiement,
                                            id_projet: props.facture.id_projet,
                                            })
    const [optionsprojet, setoptionprojet] = useState([])
    const [optionsetatfacture, setoptionsetatfacture] = useState([])
    const [optionsmoyenpaiement, setoptionmoyenpaiement] = useState([])

    async function getAll(){
        await getAllLignesFacturesByIdFacture(identetefacture)
        await getProjets()
        await getEtatFactures()
        await getMoyenPaiement()
        await getNumeroFacture()
    }

    async function getProjets(){
        const projet = await getAllProjet(0,0)
        setoptionprojet(projet)
    }

    async function getEtatFactures(){
        const etat = await getAllEtatFacture()
        setoptionsetatfacture(etat)
    }

    async function getMoyenPaiement(){
        const moyenpaiement = await getAllMoyenPaiement()
        setoptionmoyenpaiement(moyenpaiement)
    }

    async function getNumeroFacture(){
        const numero = (await getNumeroFactureMax()).numero_facture
        setnumerofacturemin(numero + 1)
    }

    async function getAllLignesFacturesByIdFacture(identetefacture){
        const lignes = await getAllLigneFactureByIdFacture(identetefacture)
        setlignesfactures(lignes)
        calculPrixTotal(lignes)
    }

    function calculPrixTotal(lignes){
        let calcul = prixtotal
        lignes.map((ligne) => {
            calcul +=(ligne.quantite * ligne.prix_unitaire)
        })
        setprixtotal(parseFloat(calcul).toFixed(2))
    }
    const retard = () =>{
        if(props.facture.date_paiement_limite < new Date().toISOString() && props.facture.id_etat === 2){
            return {color: "red"}
        }
        else{
            return {color: "black"}
        }
    }

    const handleChange =  (event) => {
        formHandleChange(event, facture, setfacture)
    }

    const handleSubmitEdit = async (event) => {
        event.preventDefault()
        if(parseInt(facture.numero_facture) === numerofactureact || parseInt(facture.numero_facture) >= numerofacturemin){
            if(facture.date_edition !== null && facture.date_edition !== undefined && facture.date_edition !== ""){
                if(facture.date_paiement_limite !== null && facture.date_paiement_limite !== undefined && facture.date_paiement_limite !== ""){
                    if((facture.date_paiement_effectif !== null && facture.date_paiement_effectif !== undefined && facture.date_paiement_effectif !== "") || facture.id_etat === 1){
                        if((facture.id_etat === 2 || facture.id_etat === 3) && lignesfactures.length === 0){
                            toast.warning("Vous ne pouvez pas envoyer ou payer une facture sans ligne")
                        }
                        else {
                            await updateFacture(props.facture.id_entete_facture, facture.numero_facture,facture.date_edition, facture.date_paiement_limite, facture.date_paiement_effectif, facture.note, facture.id_paiement, facture.id_etat, facture.id_projet)
                            toast.success("Votre facture a été modifiée !")
                            window.location.reload(false)
                        }
                    }
                    else{
                        toast.warning("Veuillez saisir une date de paiement effectif")
                    }
                }
                else{
                    toast.warning("Veuillez saisir une date de paiement limite")
                }
            }
            else{
                toast.warning("Veuillez saisir une date d'édition")
            }
        }
        else{
            toast.warning(`Le numero de facture saisi doit être superieur à ${numerofacturemin}. Vous pouvez aussi saisir celui d'origine`)
        }
    }

    const handleSubmitDelete = async (event) => {
        event.preventDefault()
        await deleteFacture(props.facture.id_entete_facture)
        toast.success("La facture a été supprimé !")
        window.location.reload(false)
    }

    const onSelectEtat = (event) =>{
        setfacture({ ...facture, ["id_etat"]: event.target.value})
    }

    const onSelectMoyenPaiement = (event) =>{
        setfacture({ ...facture, ["id_paiement"]: event.target.value})
    }

    const onSelectProjet = (event) =>{
        setfacture({ ...facture, ["id_projet"]: event.target.value})
    }

    useEffect(() => {
        getAll()
    }, [])

    return isAuthorized() ?(
        <>
            <div className="row border-bottom">
                <div className="col-2 mt-2">
                    <p style={retard()}>{props.facture.etat}</p>
                </div>
                <div className="col-2 mt-2">
                    <p style={retard()}>{props.facture.numero_facture}</p>
                </div>
                <div className="col-2 mt-2">
                    <p style={retard()}>{props.facture.nom_projet}</p>
                </div>
                <div className="col-2 mt-2">
                    <p style={retard()}>{props.facture.nom_client}</p>
                </div>
                <div className="col-2 mt-2">
                    <p className="text-center" style={retard()}>{prixtotal}€</p>
                </div>
                <div className="col-2 mt-2">
                    <Link to={{ pathname:`/facture/${props.facture.id_entete_facture}`, state: {facture: props.facture}}}><button className="btn btn-secondary"><i className="bi bi-box-arrow-in-right"></i></button></Link>
                    {props.facture.id_etat !== 3 &&
                    <>
                        <button className="btn btn-warning" data-bs-toggle="modal" data-bs-target={"#editfactureModal" + props.index}><i className="bi bi-pencil-square"></i></button>
                        <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target={"#deletefactureModal" + props.index}><i className="bi bi-trash"></i></button>
                    </>
                    }
                    </div>
            </div>


            <div className="modal fade" id={"editfactureModal" + props.index} tabIndex="-1" aria-labelledby={"editfactureModalLabel" + props.index} aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={"editfactureModalLabel" + props.index}>Modifier une facture</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmitEdit}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-3 offset-1 mt-4">
                                    <Select
                                    labelId="ProjetLabel"
                                    id="SelectProjet"
                                    defaultValue={facture.id_projet}
                                    label="Projet"
                                    onChange={onSelectProjet}
                                    >
                                    {optionsprojet.map((projet) => {
                                        return <MenuItem value={projet.id_projet}>{projet.nom}</MenuItem>
                                    })}
                                    </Select>
                                    <FormHelperText>Projet</FormHelperText>
                                </div>
                                <div className="col-3 mt-4">
                                    <Select
                                    labelId="EtatLabel"
                                    id="SelectEtat"
                                    defaultValue={facture.id_etat}
                                    label="Etat"
                                    onChange={onSelectEtat}
                                    >
                                    {optionsetatfacture.map((etat) => {
                                        return <MenuItem value={etat.id_etat_facture}>{etat.etat}</MenuItem>
                                    })}
                                    </Select>
                                    <FormHelperText>Etat</FormHelperText>
                                </div>
                                <div className="col-5 mt-4">
                                    <Select
                                    labelId="MoyenPaiementLabel"
                                    id="SelectMoyenPaiement"
                                    defaultValue={facture.id_paiement}
                                    label="Moyen de Paiement"
                                    onChange={onSelectMoyenPaiement}
                                    >
                                    {optionsmoyenpaiement.map((moyen) => {
                                        return <MenuItem value={moyen.id_moyen_paiement_facture}>{moyen.moyen_paiement}</MenuItem>
                                    })}
                                    </Select>
                                    <FormHelperText>Moyen de paiement</FormHelperText>
                                </div>
                                {facture.id_etat === 3 &&
                                    <span className="text-center" style={{color: 'red'}}>{"<!>Votre facture ne pourra plus être modifiée ni supprimée <!>"}</span>
                                }
                            </div>
                            <div className="row mt-3">
                                <div className="col-6">
                                    <InputLabel name="numero_facture" className="form-control my-4 p-2" value={facture.numero_facture} change={handleChange} type="text" label="Numero de facture" required="true"/> 
                                </div>
                                <div className="col-6">
                                    <InputLabel name="date_edition" className="form-control my-4 p-2" value={facture.date_edition} change={handleChange} type="date" label="Date d'edition" required="true"/> 
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-6">
                                    <InputLabel name="date_paiement_limite" className="form-control my-4 p-2" value={facture.date_paiement_limite} change={handleChange} type="date" label="Date de paiement limite" required="true"/> 
                                </div>
                                <div className="col-6">
                                    <InputLabel name="date_paiement_effectif" className="form-control my-4 p-2" value={facture.date_paiement_effectif} change={handleChange} type="date" label="Date de paiement effectif"/> 
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="note">Note de bas de page</label>
                                        <textarea className="form-control my-4 p-2" value={facture.note} onChange={handleChange} name="note" id="note" rows="3"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="submit" className="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div className="modal fade" id={"deletefactureModal" + props.index} tabIndex="-1" aria-labelledby={"deletefactureModalLabel" + props.index} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={"deletefactureModalLabel" + props.index}>Supprimer une facture</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmitDelete}>
                        <div className="modal-body">
                            <p>Voulez vous vraiment supprimer la facture n°{props.facture.numero_facture}</p>
                            <p>Ainsi que toutes les lignes liées a celle-ci ?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="submit" className="btn btn-danger">Supprimer</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        </>
    ) : (
        <Redirect to='/login' />
    )
}
