

export function useProperNavigationState(loc: any, pageName: string, fromSearch: boolean | undefined, id: string) {

    if (loc?.state === null) {
        return {type: pageName, id: id, pageNumber: 1, fromSearch: fromSearch, previousPaths: [`${pageName}#1#${id}`]}
    } else {
        const pageNumber = Number(loc?.state?.pageNumber) + 1
        const previousPaths = loc.state?.previousPaths || [];

        return {
            type: pageName,
            id: id,
            pageNumber: pageNumber,
            fromSearch: fromSearch,
            previousPaths: [...previousPaths, `${pageName}#${pageNumber}#${id}`]
        }
    }
}

export default useProperNavigationState;