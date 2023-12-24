import {useLocation} from "react-router-dom";


export function useProperNavigationState(pageName: string, fromSearch: boolean | undefined, id: string) {
    const loc = useLocation();


    if (loc.state === null) {

        return {type: pageName, id: id, pageNumber: 1, totalPages: 1, fromSearch: fromSearch}
    } else {
        return {
            type: pageName,
            id: id,
            pageNumber: loc.state.pageNumber + 1,
            totalPages: loc.state.totalPages,
            fromSearch: fromSearch
        }
    }
}

export default useProperNavigationState;