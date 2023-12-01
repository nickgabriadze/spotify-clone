import discographyStyle from "./discography.module.css"
import GridViewIcon from "../../icons/grid-view.svg";
import ListViewIcon from "../../icons/list-view.svg"
import {Link, useParams} from "react-router-dom";
import Error from "../../../../../Error.tsx";
import {useEffect, useRef, useState} from "react";
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
    const dropperText = useRef<HTMLDivElement>(null)
    const dropperImage = useRef<HTMLImageElement>(null)
    const dropDownRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const getDiscoData = async () => {
            try {
                const artistAlbums = await getArtistsAlbums(accessToken, String(urlParam.artistID), fetchAbleTypes)
                const allTypes = await getArtistsAlbums(accessToken, String(urlParam.artistID),  ["album", "single", "compilation"])

                setDiscoData(artistAlbums.flatMap(o => Object.values(o)[0]))
                setOptions(['All', ...allTypes.flatMap(o => Object.keys(o)[0]).map(each => each[0].toUpperCase().concat(each.slice(1, )))])
                const artistData = (await getArtist(accessToken, String(urlParam.artistID))).data;
                setArtistData(artistData)
            } catch (err) {

            }
        }
        if (POSSIBLE_TYPES.some(t => t === String(urlParam.type))) {
            getDiscoData()
        }
    }, [accessToken, String(urlParam.artistID), urlParam.type]);

    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (dropperText.current && dropperImage.current && dropDownRef.current && !dropDownRef.current.contains(e.target)

            ) {
                if (e.target !== dropperText.current &&
                    e.target !== dropperImage.current
                ) {

                    setDropDownState("DOWN");
                }
            }
        };


        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                    <p ref={dropperText}>{String(urlParam.type)[0].toUpperCase().concat(String(urlParam.type).slice(1,))}</p>
                    <img ref={dropperImage} alt="Dropdown menu icon"
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
            <div className={discographyStyle['drop-down-options']}
                 ref={dropDownRef}
            >{dropDownState === "UP" &&
                <div className={discographyStyle['drop-down-wrapper']}
                >{
                    options.filter(o => o !== urlParam.type).map((e, i) => <Link
                        key={i}
                        to={`/artist/${artistData?.id}/discography/${e.toLowerCase()}`}><p
                        style={{color: urlParam.type === e.toLowerCase() ? '#1ed760' : 'white'}}
                    >{e}</p></Link>)
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