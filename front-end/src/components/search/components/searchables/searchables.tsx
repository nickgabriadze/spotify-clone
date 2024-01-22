import searchAblesStyle from "./searchables.module.css";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import useProperNavigationState from "../../../utils/useProperNavigationState.ts";

export function Searchables() {
    const searchOptions: string[] = [
        "all",
        "artists",
        "albums",
        "songs",
        "playlists",
        "podcastsAndShows",
    ];

    const navigator = useNavigate();
    const params = useParams();
    const destructuredParams= Object.values(params).toString().split('/')
    const searchingFor = destructuredParams[1]
    const loc = useLocation();

    return (
        <div className={searchAblesStyle["search-options"]}>
            {searchOptions.map((option, i) => (

                <div

                    style={
                        destructuredParams[2] === option

                            ? {backgroundColor: "#FFF"}
                            : {}
                    }
                    key={i}
                    onClick={() => {
                        if(destructuredParams[2] !== option) navigator(`/search/${searchingFor}/${option}`, {state: useProperNavigationState(loc, 'search_res_searchable', false, option)})
                    }}
                    className={searchAblesStyle["each-option"]}
                >
                    <p
                        style={
                            {color: `${option === destructuredParams[2] ? 'black' : 'white'}`}
                        }

                    >
                        {option === "podcastsAndshows" ? 'Podcasts & Shows' : option[0].toUpperCase().concat(option.slice(1,))}
                    </p>
                </div>


            ))}

        </div>

    );
}

export default Searchables;
