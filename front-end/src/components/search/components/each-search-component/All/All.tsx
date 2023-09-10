import {useEffect, useState} from "react";
import {useAppSelector} from "../../../../../store/hooks.ts";
import {searchAll} from "../../../../../api/search/searchAll.ts";
import {AllSearch} from "../../../../../types/allSearch.ts";
import TopResult from "./innerComponents/TopResult.tsx";

export function AllResults({searchQuery}: { searchQuery: string }) {
    const spotiUserToken = useAppSelector((state) => state.spotiUserReducer.spotiToken.accessToken);
    const [allResultsData, setAllResultsData] = useState<AllSearch>();

    useEffect
    (() => {
        const fetchAll = async () => {
            try {
                const requestAll = await searchAll(searchQuery, spotiUserToken);
                const data = requestAll.data;
                setAllResultsData(data);

            } catch (e) {
                console.log(e)
            } finally {

            }
        }

        fetchAll()
    }, [spotiUserToken, searchQuery]);

    return <div>
        <TopResult topSong={allResultsData?.tracks?.items[0]} accessToken={spotiUserToken}/>

    </div>
}


export default AllResults;
