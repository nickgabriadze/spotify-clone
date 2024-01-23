import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import SongSavedIcon from "./../../player/icons/liked-indicator-heart.svg"
import SongNotSavedIcon from "./../../player/icons/heart.svg"
import removeTrackForCurrentUser from "../../../api/library/removeTrackForCurrentUser.ts";
import {addLibraryAction} from "../../../store/features/navigationSlice.ts";
import saveTrackForCurrentUser from "../../../api/library/saveTrackForCurrentUser.ts";
import FSComponentStyle from './fs.module.css';

export function LikeButton() {
    const userSavedSongs = useAppSelector(s => s.spotiUserReducer.userSaved.userSavedSongIDs);
    const currentSongID = useAppSelector(s => s.navigationReducer.currentSongData?.item?.id)
    const currentSongSaved = userSavedSongs.includes(String(currentSongID))
    const dispatch = useAppDispatch();
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentSongData)
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken)

    return <button
        className={FSComponentStyle['like-btn']}
        onClick={async () => {
            if (currentSongSaved) {
                const req = (await removeTrackForCurrentUser(accessToken, String(currentlyPlaying?.item?.id))).status;
                if (req === 200) {
                    dispatch(addLibraryAction('Remove Track'))
                }
            } else {
                const req = (await saveTrackForCurrentUser(accessToken, String(currentlyPlaying?.item?.id))).status;
                if (req === 200) {
                    dispatch(addLibraryAction('Saved Track'))
                }

            }
        }
        }
        title={currentSongSaved ? "Remove from Your Library" : "Save to Your Library"}
    >
        <img alt={"Like Button Icon"} height={40} width={40}
             src={currentSongSaved ? SongSavedIcon : SongNotSavedIcon}></img>
    </button>
}

export default LikeButton