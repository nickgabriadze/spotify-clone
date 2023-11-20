import {useEffect, useState} from "react";
import {Artist} from "../../../../../types/artist.ts";
import getRelatedArtists from "../../../../../api/search/getRelatedArtists.ts";
import {useAppSelector} from "../../../../../store/hooks.ts";
import ArtistCard from "../../../../search/reuseables/artistCard.tsx";
import artistPageStyle from "../artistpage.module.css";

export function FansAlsoLike({artistID}: { artistID: string }) {
    const [fansAlsoLike, setFansAlsoLike] = useState<Artist[]>([]);
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken);
    const numberOfItems = useAppSelector(s => s.spotiUserReducer.numberOfItemsToBeShown);

    useEffect(() => {
        const getThoseOnes = async () => {
            try {
                const request = (await getRelatedArtists(accessToken, artistID)).data.artists;
                setFansAlsoLike(request);

            } catch (err) {

            }
        }
        getThoseOnes();
    }, [accessToken, artistID]);

    return fansAlsoLike.length > 0 && <section className={artistPageStyle['fans-also-like']}>
        <h2>Fans Also Like</h2>
        <div className={artistPageStyle['related-artists-list']}
          style={{gridTemplateColumns: `repeat(${numberOfItems}, minmax(0, 1fr)`}}>
            {fansAlsoLike.slice(0, numberOfItems).map((eachArtist, i) => <ArtistCard
                eachArtist={eachArtist} key={i}/>)}
        </div>
    </section>
}

export default FansAlsoLike;