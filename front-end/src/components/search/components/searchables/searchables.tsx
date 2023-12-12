import searchAblesStyle from "./searchables.module.css";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";

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
    const [ourUrlGuideArray, setOurUrlGuideArray] = useState<string[]>(destructuredParams)

    useEffect(() => {
        setOurUrlGuideArray((prev) => [prev[0], prev[1], Object.values(params).toString().split('/')[2]])
    }, [params]);
    return (
        <div className={searchAblesStyle["search-options"]}>
            {searchOptions.map((option, i) => (

                <div

                    style={
                        ourUrlGuideArray[2] === option

                            ? {backgroundColor: "#FFF"}
                            : {}
                    }
                    key={i}
                    onClick={() => {
                        setOurUrlGuideArray((prev) => [prev[0], prev[1], option])
                        navigator([ourUrlGuideArray[0], searchingFor, option].join('/'))
                    }}
                    className={searchAblesStyle["each-option"]}
                >
                    <p
                        style={
                            {color: `${option === ourUrlGuideArray[2] ? 'black' : 'white'}`}
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
