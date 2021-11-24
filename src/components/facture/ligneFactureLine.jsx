import React, { useState } from 'react'
import { deleteLigneFacture, updateLigneFacture } from '../../services/api/facture/lignefactureapi'
import { formHandleChange } from '../../services/formService'
import InputLabel from '../form/inputLabel'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAuthorized } from '../../services/userService';
import { Redirect } from 'react-router'
toast.configure()

export default function LigneFactureLine(props) {
    const lignesfacture = props.lignefacture
    const [lignefacture, setlignefacture] = useState({id_ligne_facture: lignesfacture.id_ligne_facture,
                                                      libelle: lignesfacture.libelle,
                                                      quantite: lignesfacture.quantite,
                                                      prix_unitaire: lignesfacture.prix_unitaire,
                                                      id_entete_facture: lignesfacture.id_entete_facture
    })
    const [prixtotalligne, setprixtotalligne] = useState(parseFloat((lignesfacture.quantite * lignesfacture.prix_unitaire)).toFixed(2))

    const handleChange = (event) => {
        formHandleChange(event, lignefacture, setlignefacture)
    }

    const handleSubmitEdit = async (event) => {
        event.preventDefault()
        if(lignefacture.libelle !== null && lignefacture.libelle !== undefined && lignefacture.libelle !== ""){
            if(lignefacture.quantite >= 1 && lignefacture.quantite !== null && lignefacture.quantite !== undefined){
                if(lignefacture.prix_unitaire > 0 && lignefacture.prix_unitaire !== null && lignefacture.prix_unitaire !== undefined){
                    await updateLigneFacture(lignefacture.id_ligne_facture, lignefacture.libelle, lignefacture.quantite, parseFloat(lignefacture.prix_unitaire).toFixed(2), lignefacture.id_entete_facture)
                    toast.success("Ligne modifiée !")
                    window.location.reload(false)
                }
                else{
                    toast.warning("Veuillez saisir le prix unitaire")
                }
            }
            else{
                toast.warning("Veuillez saisir une quantité")
            }
        }
        else{
            toast.warning("Veuillez saisir le libelle")
        }
    }

    const handleSubmitDelete = async (event) => {
        event.preventDefault()
        await deleteLigneFacture(lignesfacture.id_ligne_facture)
        toast.success("La ligne a été supprimée !")
        window.location.reload(false)
    }

    return isAuthorized() ?(
        <>
            {props.id_etat !== 3 ?
                <>
                <tr>
                    <td className="text-center"><button className="btn btn-warning" data-bs-toggle="modal" data-bs-target={"#editLigneFactureModal" + props.lignefacture.id_ligne_facture}><i className="bi bi-pencil-square"></i></button><button className="btn btn-danger" data-bs-toggle="modal" data-bs-target={"#deleteLigneFactureModal" + props.lignefacture.id_ligne_facture}><i className="bi bi-trash"></i></button></td>
                    <td className="text-center">{lignefacture.libelle}</td>
                    <td className="text-center">{lignefacture.quantite}</td>
                    <td className="text-center">{lignefacture.prix_unitaire}€</td>
                    <td className="text-center">{prixtotalligne}€</td>
                </tr>
                </>
                :
                <>
                <tr>
                    <td className="text-center">{lignefacture.libelle}</td>
                    <td className="text-center">{lignefacture.quantite}</td>
                    <td className="text-center">{lignefacture.prix_unitaire}€</td>
                    <td className="text-center">{prixtotalligne}€</td>
                </tr>
                </>

            }
                
            <div className="modal fade" id={"editLigneFactureModal" + props.lignefacture.id_ligne_facture} tabIndex="-1" aria-labelledby={"editLigneFactureModalLabel" + props.lignefacture.id_ligne_facture} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={"editLigneFactureModalLabel" + props.lignefacture.id_ligne_facture}>Ajouter une ligne</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmitEdit}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-6">
                                    <InputLabel id={"libelle" + props.lignefacture.id_ligne_facture} name="libelle" className="form-control my-3 p-2" value={lignefacture.libelle} change={handleChange} type="text" label="Libelle" placeholder="Article" required="true"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <InputLabel id={"quantite" + props.lignefacture.id_ligne_facture} name="quantite" className="form-control my-3 p-2" value={lignefacture.quantite} change={handleChange} type="number" label="Quantite" placeholder="0" required="true"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <InputLabel id={"prix_unitaire" + props.lignefacture.id_ligne_facture} name="prix_unitaire" className="form-control my-3 p-2" value={lignefacture.prix_unitaire} change={handleChange} type="number" label="Prix unitaire" placeholder="0" required="true"/>
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


        <div className="modal fade" id={"deleteLigneFactureModal" + props.lignefacture.id_ligne_facture} tabIndex="-1" aria-labelledby={"deleteLigneFactureModalLabel" + props.lignefacture.id_ligne_facture} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={"deleteLigneFactureModalLabel" + props.lignefacture.id_ligne_facture}>Supprimer une facture</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmitDelete}>
                        <div className="modal-body">
                            <p>Voulez vous vraiment supprimer cette ligne</p>
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
