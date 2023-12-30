

export function useProperNavigationState(loc: any, pageName: string, fromSearch: boolean | undefined, id: string) {
    if (loc?.state === null) {
        return {type: pageName, id: id, pageNumber: 1, fromSearch: fromSearch}
    } else {
        return {
            type: pageName,
            id: id,
            pageNumber: Number(loc?.state?.pageNumber) + 1,
            fromSearch: fromSearch
        }
    }
}

export default useProperNavigationState;