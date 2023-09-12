import {useEffect, useState} from "react";
import {useAppSelector} from "../../../../../store/hooks.ts";
import {searchAll} from "../../../../../api/search/searchAll.ts";
import {AllSearch} from "../../../../../types/allSearch.ts";
import TopResult from "./innerComponents/TopResult.tsx";
import allResultsStyle from "./allresults.module.css";
import Songs from "./innerComponents/Songs.tsx";
export function AllResults({searchQuery}: { searchQuery: string }) {
    const spotiUserToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
    const [allResultsData, setAllResultsData] = useState<AllSearch>();
    const [resultsLoading, setResultsLoading] = useState<boolean>(true);
    useEffect
    (() => {
        const fetchAll = async () => {
            setResultsLoading(true)
            try {
                const requestAll = await searchAll(searchQuery, spotiUserToken);
                const data = requestAll.data;
                setAllResultsData(data);

            } catch (e) {
                console.log(e)
            } finally {
                setResultsLoading(false)
            }
        }

        fetchAll()
    }, [spotiUserToken, searchQuery]);

    return <div className={allResultsStyle['all-wrapper']}>
        <div className={allResultsStyle['first-row']}>
        <TopResult topSong={allResultsData?.tracks?.items[0]} accessToken={spotiUserToken} resultsLoading={resultsLoading}/>
            <Songs firstFour={allResultsData?.tracks?.items?.slice(0, 4)}/>
        </div>
    </div>
}


export default AllResults;
