import {useAppSelector} from "../../../../../store/hooks.ts";
import {useEffect, useState} from "react";
import getUsersTopItems from "../../../../../api/home/getUsersTopItems.ts";
import getArtistsRelatedArtists from "../../../../../api/home/getRelatedArtists.ts";
import {Artist} from "../../../../../types/artist.ts";
import homepageStyle from "../homepage.module.css";
import ArtistCard from "../../../../search/reuseables/artistCard.tsx";
import ArtistCardSkeleton from "../../../../../skeletons/artistCardSkeleton.tsx";

export function MoreLikeArtists() {
    const accessToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
    const [relatedArtists, setRelatedArtists] = useState<{
        artistName: string,
        artistID: string,
        likeArtist: Artist[]
    }[]>([])

    useEffect(() => {
        const fetchMoreLike = async () => {
            const reqTopArtists: Artist[] = (await getUsersTopItems(accessToken, 'artists', 'medium_term', 5)).data.items;
            console.log(reqTopArtists)
            const relatedOnes = []
            for (const artist of reqTopArtists) {
                const relatedArtists = (await getArtistsRelatedArtists(accessToken, artist.id)).data.artists.slice(0, 5);
                relatedOnes.push({
                    artistName: artist.name,
                    artistID: artist.id,
                    likeArtist: relatedArtists
                })
            }
            setRelatedArtists(relatedOnes)
        }

        fetchMoreLike();
    }, [accessToken])


    console.log(relatedArtists)

    if (relatedArtists.length !== 0) {
        return relatedArtists.map((eachArtist, numbering) =>
            <div key={numbering} className={homepageStyle['like-section']}>
                <h2>More Like {eachArtist.artistName}</h2>
                <div className={homepageStyle['related-artists']}>
                    {eachArtist.likeArtist.map((eachLike, i) => <ArtistCard eachArtist={eachLike} key={i}/>)}
                </div>
            </div>
        )
    }else{
        return Array.from({length: 5}).map((_, numbering) =>
            <div key={numbering} className={homepageStyle['like-section']}>
                <h2 className={homepageStyle['like-to-skeleton']}>
                    <span></span>
                </h2>
                <div className={homepageStyle['related-artists']}>
                    {Array.from({length: 5}).map((eachLike, i) => <ArtistCardSkeleton eachArtist={eachLike} key={i}/>)}
                </div>
            </div>
        )
    }


}

export default MoreLikeArtists;