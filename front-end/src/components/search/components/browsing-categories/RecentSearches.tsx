import {useState} from "react";
import useSearchHistory from "../../../main/hooks/useSearchHistory.ts";
import {ArtistCardApi} from "../../reuseables/artistCard.tsx";
import {AlbumCardApi} from "../../reuseables/albumCard.tsx";
import {PlaylistCardApi} from "../../reuseables/playListCard.tsx";
import {useAppSelector} from "../../../../store/hooks.ts";

export function RecentSearches() {
    const numberOfItemsTobeShown = useAppSelector(s => s.spotiUserReducer.numberOfItemsToBeShown);
    const [searchHistory, setSearchHistory] = useState<{
        type: string,
        id: string
    }[]>(useSearchHistory(null, "GET"))


    return <div style={{display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px'}}>
        <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'center'}}><h1 style={{fontSize: '1.5rem'}}>Recent Searches</h1>
            <p><button style={{color: '#b2b2b2'}}
            onClick={() => {
                setSearchHistory([]);
                useSearchHistory(null, "RESET")
            }}
            >Clear recent searches</button></p>
        </div>

        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numberOfItemsTobeShown},  minmax(0, 1fr))`,
            gap: '20px',
            width: '100%',
        }}>{searchHistory.map(e => {
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
        })}
        </div>
    </div>
}

export default RecentSearches;