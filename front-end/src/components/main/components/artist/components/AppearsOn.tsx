import artistPageStyle from '../artistpage.module.css'
import {useEffect, useState} from "react";
import getArtistsAlbums from "../../../../../api/main/artist/getArtistsAlbums.ts";
import {useAppSelector} from "../../../../../store/hooks.ts";
import AlbumCard from "../../../../search/reuseables/albumCard.tsx";
import {Album} from "../../../../../types/album.ts";

export function AppearsOn({artistID} : {artistID: string}) {
        const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken);

    const [appearingAlbums, setAppearingAlbums] = useState<Album[]>([]);

    useEffect(() => {
        const getAppearsOn = async () => {
            try {
                const appearingOn = (await getArtistsAlbums(accessToken, artistID, ['appears_on']))[0];
                setAppearingAlbums(appearingOn['appears_on'])
            }catch(err){

            }
        }
        getAppearsOn();
    }, [accessToken, artistID]);



    return appearingAlbums.length > 0 &&  <section className={artistPageStyle['appears_on']}>
        <h2>Appears On</h2>
        <div className={artistPageStyle['appears_on-albums-list']}>
            {appearingAlbums.map((album, i) => <AlbumCard eachAlbum={album} key={i}/>)}
        </div>
    </section>

}


export default AppearsOn