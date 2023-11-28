import discographyStyle from "./discography.module.css"
import GridViewIcon from "../../icons/grid-view.svg";
import ListViewIcon from "../../icons/list-view.svg"
import {Link, useParams} from "react-router-dom";
import Error from "../../../../../Error.tsx";
import {useEffect, useState} from "react";
import {useAppSelector} from "../../../../../../store/hooks.ts";
import getArtistsAlbums from "../../../../../../api/main/artist/getArtistsAlbums.ts";
import {Album} from "../../../../../../types/album.ts";
import {DiscoAlbum} from "./DiscoAlbum.tsx";
import {Artist} from "../../../../../../types/artist.ts";
import getArtist from "../../../../../../api/search/getArtist.ts";
import AlbumCard from "../../../../../search/reuseables/albumCard.tsx";
import DropDownIcon from './../../icons/drop-down-arrow.svg';
import DropUpIcon from './../../icons/drop-up-arrow.svg';

export function Discography() {
    const [discoData, setDiscoData] = useState<Album[]>([]);
    const [artistData, setArtistData] = useState<Artist>();
    const urlParam = useParams();
    const [options, setOptions] = useState<string[]>([])
    const [dropDownState, setDropDownState] = useState<"UP" | "DOWN">("DOWN")
    const POSSIBLE_TYPES = ["album", "single", "compilation", "all"];
    const [listGrid, setListGrid] = useState<boolean>(false);
    const numberOfItems = useAppSelector(s => s.spotiUserReducer.numberOfItemsToBeShown);
    const fetchAbleTypes = urlParam.type === "all" ? ["album", "single", "compilation"] : [String(urlParam.type)]
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken);
    useEffect(() => {
        const getDiscoData = async () => {
            try {
                const artistAlbums = await getArtistsAlbums(accessToken, String(urlParam.artistID), fetchAbleTypes)
                setDiscoData(artistAlbums.flatMap(o => Object.values(o)[0]))
                setOptions(['all', ...artistAlbums.flatMap(o => Object.keys(o)[0])])
                const artistData = (await getArtist(accessToken, String(urlParam.artistID))).data;
                setArtistData(artistData)
            } catch (err) {

            }
        }
        if (POSSIBLE_TYPES.some(t => t === String(urlParam.type))) {
            getDiscoData()
        }
    }, [accessToken, String(urlParam.artistID), urlParam.type]);

    console.log(options)

    if (!POSSIBLE_TYPES.some(t => t === urlParam.type)) {
        return <Error/>
    }

    return <section className={discographyStyle['disco-section']}>
        <header className={discographyStyle['disco-header']}>
            <div><Link to={`/artist/${artistData?.id}`}><h1>{artistData?.name}</h1></Link></div>

            <div className={discographyStyle['list-or-grid']}>
                <div className={discographyStyle['drop-down-menu']}
                     onClick={() => {
                         if (dropDownState === "UP") {
                             setDropDownState("DOWN")
                         } else {
                             setDropDownState("UP")
                         }
                     }}
                >
                    <p>{String(urlParam.type)[0].toUpperCase().concat(String(urlParam.type).slice(1,))}</p>
                    <img alt="Dropdown menu icon"
                         src={dropDownState === "UP" ? DropUpIcon : DropDownIcon} width={30} height={30}></img>
                </div>


                <img
                    draggable={false}
                    onClick={() => {
                        setListGrid(false)
                    }}
                    style={listGrid ? {filter: `invert(60%) sepia(0%) saturate(0%) hue-rotate(7deg) brightness(100%) contrast(93%)`} : {
                        backgroundColor: '#292929',
                        padding: '5px'
                    }}
                    src={ListViewIcon} alt={"List view icon"} width={25} height={25}/>
                <img
                    draggable={false}
                    onClick={() => {
                        setListGrid(true)
                    }}
                    style={!listGrid ? {filter: `invert(60%) sepia(0%) saturate(0%) hue-rotate(7deg) brightness(100%) contrast(93%)`} : {
                        backgroundColor: '#292929',
                        padding: '5px'
                    }}
                    src={GridViewIcon} alt={"Grid view icon"} width={25} height={25}/>
            </div>

            <div className={discographyStyle['drop-down-options']}>{dropDownState === "UP" &&
                <div className={discographyStyle['drop-down-wrapper']}>{
                    options.filter(o => o !== urlParam.type).map((e, i) => <p key={i}>{e}</p> )
                }</div>}</div>

        </header>

        <div className={discographyStyle['disco-layout']}
             style={listGrid ? {
                 display: 'grid',
                 gridTemplateColumns: `repeat(${numberOfItems}, minmax(0, 1fr))`,
                 gap: '20px'
             } : {display: 'flex', flexDirection: 'column'}}
        >
            {discoData.map((eachDisco, i) => {
                    if (listGrid) {

                        return <AlbumCard eachAlbum={eachDisco} key={i}/>
                    } else {
                        return <DiscoAlbum album={eachDisco} key={i}/>
                    }
                }
            )}
        </div>
    </section>


}