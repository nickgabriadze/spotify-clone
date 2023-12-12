export function useSearchHistory(state: {
    type: string,
    id: string
} | null, action: "SET" | "GET"): {
    type: string,
    id: string
}[] {


    if (action === "SET" && state === null) return [];
    const localStorageSearchHistory = window.localStorage.getItem('search_history');

    if (action === "GET") {
        if (localStorageSearchHistory === null) return [];
        else {

            try {
                return localStorageSearchHistory.split("|").map(e => JSON.parse(e))

            } catch (err) {
                return [];
            }

        }
    }

    if (action === "SET") {
        if (localStorageSearchHistory === null) {
            window.localStorage.setItem('search_history', JSON.stringify(state))
        } else {
            const items = localStorageSearchHistory.split("|").map(e => JSON.parse(e));
            if (!(items.filter(e => e.type === state?.type && e.id === state?.id).length > 0)) {
                window.localStorage.setItem("search_history", localStorageSearchHistory + `|{"type":"${state?.type}", "id":"${state?.id}"}`)
            }
            return [];
        }
    }

    return [];
}

export default useSearchHistory;