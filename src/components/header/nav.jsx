import React from 'react'
import { logout } from '../../services/tokenService'
import { isAdmin } from '../../services/userService'

export default function Nav() {

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Acceuil</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Clients
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a className="dropdown-item" href="/client">Voir la liste des clients</a></li>
                                <li><a className="dropdown-item" href="/client/ajouter">Ajouter un client</a></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Projets
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a className="dropdown-item" href="/projet">Voir la liste des Projets</a></li>
                                <li><a className="dropdown-item" href="/projet/ajouter">Ajouter un Projet</a></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Factures
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a className="dropdown-item" href="/facture">Voir la liste des factures</a></li>
                                <li><a className="dropdown-item" href="/facture/ajouter">Ajouter une facture</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/user/info">Vos Informations</a>
                        </li>
                        {isAdmin() &&
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/admin">Administration</a>
                            </li>
                        }
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/login" onClick={() => logout()}><i className="bi bi-door-closed-fill"></i></a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
