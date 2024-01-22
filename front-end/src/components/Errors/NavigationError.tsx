import errorsStyle from './errors.module.css';
import {Link} from "react-router-dom";
import SpotifyLogo from "./../../../public/spotify_web.ico";
import {useAppDispatch, useAppSelector} from "../../store/hooks.ts";
import {setNavigationError} from "../../store/features/navigationSlice.ts";

export function NavigationError() {
    const navigationError = useAppSelector(s => s.navigationReducer.navigationError)
    const dispatch = useAppDispatch();
    document.title = 'Page Not Found'
    return <div className={errorsStyle['nav-error-wrapper']}
                style={{display: navigationError ? 'flex' : 'none'}}

    >
        <img src={SpotifyLogo} width={80} height={80} draggable={false} alt={'Spotify Logo'}></img>
        <div><h1>Page not found</h1> <p>We can't seem to find the page you are looking for.</p></div>
        <Link to={'/'} onClick={() => dispatch(setNavigationError(false))}> Home </Link>
    </div>
}

export default NavigationError;

