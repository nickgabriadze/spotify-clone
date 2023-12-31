import homepageStyle from "../homepage.module.css";
import {useEffect, useState} from "react";
import {Album} from "../../../../../types/album.ts";
import getNewReleases from "../../../../../api/main/home/getNewReleases.ts";
import {useAppSelector} from "../../../../../store/hooks.ts";
import AlbumCard from "../../../../search/reuseables/albumCard.tsx";

export function NewReleases() {
    const accessToken = useAppSelector(state => state.spotiUserReducer.spotiToken.accessToken);
    const country = useAppSelector(state => state.spotiUserReducer?.userInformation?.country);
    const [newReleasesData, setNewReleasesData] = useState<Album[]>([]);
    const itemQuantity = useAppSelector(s => s.spotiUserReducer.numberOfItemsToBeShown)
    const numberOfItems = useAppSelector(s => s.spotiUserReducer.numberOfItemsToBeShown);

    useEffect(() => {
        const newReleases = async () => {
            try{
                const reqNew = (await getNewReleases(accessToken, country)).data.albums.items;

                setNewReleasesData(reqNew);

            }catch(err){

            }
        }

        if(country !== undefined ){
            newReleases();
        }
    }, [accessToken, country]);

    if(newReleasesData.length === 0){
        return;
    }

    if(newReleasesData.every(i => i === null)){
        return;
    }

    return <section className={homepageStyle['new-releases']}>
        <h2>New Releases</h2>
        <div className={homepageStyle['new-releases-grid']}
          style={{gridTemplateColumns: `repeat(${numberOfItems}, minmax(0, 1fr)`}}>
            {newReleasesData.slice(0, itemQuantity).map((eachAlbum, i) => <AlbumCard eachAlbum={eachAlbum} key={i} />)}
        </div>
    </section>


}

export default NewReleases