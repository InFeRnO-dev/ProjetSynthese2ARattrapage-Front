export const formHandleChange =  (event, varData, fonctionMajData) => {
    const value = event.currentTarget.value
    const name = event.currentTarget.name
    fonctionMajData({...varData, [name]: value})
}

export const formatDate = (date) => {
    const dateformat = new Date(date)
    return new Date(dateformat.getTime() - dateformat.getTimezoneOffset() * 60000).toISOString().split('T')[0]
}