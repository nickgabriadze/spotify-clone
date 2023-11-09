import {useEffect} from "react";
import {useAppDispatch} from "../../../store/hooks.ts";
import {setNumberOfItemsToBeShown} from "../../../store/features/spotiUserSlice.ts";

export function useUpdateNumberOfItems() {

    const dispatch = useAppDispatch();

    useEffect(() => {
        const setWindowWidth = () => {
            dispatch(setNumberOfItemsToBeShown(Math.floor(window.innerWidth / 250)));
        }

        window.addEventListener('resize', setWindowWidth)

        return () => window.removeEventListener('resize', setWindowWidth)

    }, []);


}