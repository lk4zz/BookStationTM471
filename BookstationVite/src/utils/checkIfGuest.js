export const checkIfGuest = () => {
    const token = localStorage.getItem("token");
    if(!token){
        return true;
    }
    return false;

}