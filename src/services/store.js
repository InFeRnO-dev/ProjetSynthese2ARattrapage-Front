export const TOKEN_KEY = 'token'

const localstorage = window.localStorage

export function setInStore(key, value) {
    const stringData = JSON.stringify(value)
    localstorage.setItem(key, stringData)

    return true
}

export function getInStore(key) {
    const stringData = localstorage.getItem(key)
    if(stringData){
        return JSON.parse(stringData)
    }
    return false
}

export function removeInStore(key) {
    localstorage.removeItem(key)

    return true
}