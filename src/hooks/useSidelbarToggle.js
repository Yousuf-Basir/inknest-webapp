import { useEffect, useState } from "react";

const useSidelbarToggle = () => {
    const [toggle, _setToggle] = useState(false);

    const setToggle = () => {
        // console.log(toggle)
        _setToggle(!toggle);
    }



    return [toggle, setToggle];
}

export default useSidelbarToggle;