import jwtDecode from "jwt-decode";
import { reactLocalStorage } from "reactjs-localstorage";

/**
 * @returns current user object or null 
 * @example email: "user@mail.com"
            firstName: "Yousuf"
            lastName: "Basir"
            iat: 1634483314
            inkShelfUid: "88eac295-e674-4ffc-84f6-*******"
            userUid: "c1492f11-a44b-4acf-b916-********"
    **/
const getCurrentUser = () => {
    const accessToken = reactLocalStorage.get("accessToken");
    const currentUser = accessToken?jwtDecode(accessToken):null;

    return currentUser;
}


export default getCurrentUser;