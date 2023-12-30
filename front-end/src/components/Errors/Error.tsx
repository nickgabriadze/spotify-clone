import {setNavigationError} from "../../store/features/navigationSlice.ts";
import {useAppDispatch} from "../../store/hooks.ts";

export function SpotiError() {
    const dispatch = useAppDispatch();

    dispatch(setNavigationError(true))

    return <></>
}

export default SpotiError;
