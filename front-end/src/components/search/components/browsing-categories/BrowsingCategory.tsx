import {useEffect, useState} from "react";
import {useAppSelector} from "../../../../store/hooks";
import browsingCategoryStyle from "./browsingCategories.module.css";
import {getBrowsingCategories} from "../../../../api/getBrowsingCategories.ts";
import {BrowsingCategoryCard} from "../../reuseables/browsingCategoryCard.tsx";
import GenreCardSkeleton from "../../../../skeletons/genreCardSkeleton";
import {Category} from "../../../../types/categories.ts";
import {average} from "color.js";
import useSearchHistory from "../../../main/hooks/useSearchHistory.ts";
import {ArtistCardApi} from "../../reuseables/artistCard.tsx";
import {AlbumCardApi} from "../../reuseables/albumCard.tsx";
import {PlaylistCardApi} from "../../reuseables/playListCard.tsx";
import {Link} from "react-router-dom";

export function BrowsingCategory() {
    const [colors, setColors] = useState<string[]>([])

    const accessToken = useAppSelector(
        (state) => state.spotiUserReducer.spotiToken.accessToken
    );
    const [genresLoading, setGenresLoading] = useState<boolean>(true);
    const [genres, setGenres] = useState<Category[]>(Array.from({length: 50}));
    const [genresError, setGenresError] = useState<string | unknown>("");
    const numberOfItems = useAppSelector(s => s.spotiUserReducer.numberOfItemsToBeShown);
    const [searchHistory, setSearchHistory] = useState<{
        type: string,
        id: string
    }[]>(useSearchHistory(null, "GET"))

    useEffect(() => {
        const controller = new AbortController();

        const fetchGenres = async () => {
            try {
                const req = await getBrowsingCategories(accessToken);

                const data = req.data;

                setGenres(data.categories.items);

                data.categories.items.forEach((e) => {
                    const hexFunc = async () => {
                        const hex = await average(e.icons[0].url, {format: 'hex'});
                        setColors(prev => [...prev, hex.toString()])

                    }

                    hexFunc();

                })
            } catch (err) {
                setGenresError(err);
            } finally {
                setGenresLoading(false);
            }
        };
        fetchGenres();

        return () => controller.abort();
    }, [accessToken]);

    if(genresLoading) return;

    return (
        <section className={browsingCategoryStyle["browsing-categories-wrapper"]}
        >

            {searchHistory.length !== 0 && <div className={browsingCategoryStyle['recents']}>
                <Link to={'/recent-searches'}><h1 className={browsingCategoryStyle['browsing-categories-header']}>Recent
                    Searches</h1></Link>
                    <div className={browsingCategoryStyle['search-history']}
                         style={{gridTemplateColumns: `repeat(${numberOfItems}, minmax(0, 1fr))`}}>
                        {searchHistory.slice(0, numberOfItems).map(e => {
                                switch (e.type) {
                                    case 'artist':
                                        return <ArtistCardApi searchHistorySetter={setSearchHistory} key={e.id}
                                                              forSearchHistory={true} artistID={e.id}/>
                                    case 'album':
                                        return <AlbumCardApi searchHistorySetter={setSearchHistory} key={e.id}
                                                             forSearchHistory={true} albumID={e.id}/>
                                    case 'playlist':
                                        return <PlaylistCardApi searchHistorySetter={setSearchHistory} key={e.id}
                                                                forSearchHistory={true} playlistID={e.id}/>
                                }

                            }
                        )}
                    </div>

            </div>}

            <div className={browsingCategoryStyle['categories']}>
                <h1>Browse all</h1>
                <div className={browsingCategoryStyle["genre-card-grid"]}>
                    {genres.slice(0, 50).map((eachCategory, i) => {
                            if ((genresLoading || genresError)) {
                                return <GenreCardSkeleton key={i}/>;
                            } else {
                                return <BrowsingCategoryCard key={i} category={eachCategory} colorHex={colors[i]}/>

                            }

                        }
                    )}
                </div>
            </div>
        </section>
    );
}

export default BrowsingCategory;
