export const formHandleChange =  (event, varData, fonctionMajData) => {
    const value = event.currentTarget.value
    const name = event.currentTarget.name
    fonctionMajData({...varData, [name]: value})
}