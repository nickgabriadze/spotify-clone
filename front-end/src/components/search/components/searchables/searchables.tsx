import {
    Option,

} from "../../../../store/features/navigationSlice";
import searchAblesStyle from "./searchables.module.css";
import { useNavigate, useParams} from "react-router-dom";
import { useState} from "react";

export function Searchables() {
    const searchOptions: Option[] = [
        "All",
        "Artists",
        "Albums",
        "Songs",
        "Playlists",
        "Podcasts & Shows",
    ];

    const navigator = useNavigate();
    const params = useParams();
    const destructuredParams = Object.values(params).toString().split('/')
    const searchingFor = destructuredParams[1]
    // const values = Object.values(params)[1];
    // console.log(values)
    // const [searchingURL, setSearchingURL] = useState<string>(Object.values(params).toString());
    // useEffect(() => {
    //     setSearchingURL(Object.values(params).toString())
    //
    // }, [Object.values(params).toString()]);
    const newArray = ['search', searchingFor, searchOptions[0]]
    const [ourUrlGuideArray, setOurUrlGuideArray] = useState<string[]>(newArray)


    return (
        <div className={searchAblesStyle["search-options"]}>
            {searchOptions.map((option, i) => (

                <div

                    style={
                        ourUrlGuideArray[2] === option.toLowerCase()
                    || ourUrlGuideArray[2] === 'podcastsAndshows'
                            ? {backgroundColor: "#FFF"}
                            : {}
                    }
                    key={i}
                    onClick={() => {
                        setOurUrlGuideArray((prev) => [prev[0], prev[1], option.toLowerCase().split(' ').join('And').replace('&', '')])
                        if (option.toLowerCase() === 'all') {
                            navigator([ourUrlGuideArray[0], searchingFor, 'all'].join('/'))
                        } else {
                            navigator([ourUrlGuideArray[0], searchingFor, option.toLowerCase().split(' ').join('').replace('&', 'And')].join('/'))
                        }
                    }}
                    className={searchAblesStyle["each-option"]}
                >
                    <p
                        style={
                          {color: `${option.toLowerCase() === ourUrlGuideArray[2] ? 'black': 'white'}`}
                        }

                    >
                        {option}
                    </p>
                </div>


            ))}

        </div>

    );
}

export default Searchables;
