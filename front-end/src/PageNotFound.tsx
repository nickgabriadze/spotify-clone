import {useNavigate} from 'react-router-dom';
import appStyle from "./app.module.css";
import {useEffect} from "react";

export function PageNotFound() {
    const navigate = useNavigate();


    useEffect(() => {
        setTimeout(() => {
            navigate('/')
        }, 1000)
    }, []);

    return (<img
        className={appStyle["loading-anim"]}
        src={"/spotify_web.png"}
        width={100}
        height={100}
        alt={"Loading animation"}
    ></img>); // This component doesn't render anything
}

export default PageNotFound;