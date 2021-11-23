import React from 'react'
import { Link } from 'react-router-dom'
import { isAuthorized } from '../../services/userService'
import { Redirect } from 'react-router'
export default function ClientLine(props) {
    return isAuthorized() ?(
        <>
            <div className="row border-bottom">
                <div className="col-3 mt-2">
                    <p>{props.client.nom}</p>
                </div>
                <div className="col-3 mt-2">
                    <p>{props.client.prenom === null ? props.client.nom_contact : props.client.prenom}</p>
                </div>
                <div className="col-3 mt-2">
                    <p>{props.client.email}</p>
                </div>
                <div className="col-3 mt-2">
                    <Link to={{ pathname:`/client/${props.client.id_client}`, state: {client: props.client}}}><button className="btn btn-secondary"><i class="bi bi-box-arrow-in-right"></i></button></Link>
                </div>
            </div>
        </>
    ) : (
        <Redirect to='/login' />
    )
}
