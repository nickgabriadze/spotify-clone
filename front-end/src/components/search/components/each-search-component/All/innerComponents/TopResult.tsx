import {Track} from "../../../../../../types/track.ts";
import allResultsStyle from "../allresults.module.css";
import PlayResumeStreaming from "../../../../../../api/player/playResumeStreaming.ts";
import {setUserControlActions} from "../../../../../../store/features/navigationSlice.ts";
import Play from "../../Playlists/icons/play.svg";
import {useState} from "react";
import {useAppDispatch} from "../../../../../../store/hooks.ts";

export function TopResult({topSong, accessToken}: { topSong: Track | undefined, accessToken: string }) {
    const [hoveringOver, setHoveringOver] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    return <div className={allResultsStyle['top-result-wrapper']}
                onMouseOver={() => setHoveringOver(true)}
                onMouseOut={() => setHoveringOver(false)}
    >
        <h2>Top Result</h2>
        <div className={allResultsStyle['top-track-box']}>
            <div><img src={topSong?.album.images[0]?.url} width={92} alt={"Track image"} height={92}></img></div>
            <div
                className={allResultsStyle['track-name']}>{Number(topSong?.name.length) > 19 ? topSong?.name.slice(0, 19).concat('...') : topSong?.name}</div>
            <div className={allResultsStyle['track-artist-type']}>
                <a>{topSong?.artists[0].name}</a>
                <p>{topSong?.type === 'track' ? 'Song' : topSong?.type}</p>
            </div>

        </div>

        {hoveringOver && (
            <button
                onClick={async () => {
                    await PlayResumeStreaming(accessToken, undefined, [String(topSong?.uri)]);
                    dispatch(
                        setUserControlActions({
                            userAction: "Play Track",
                        })
                    );
                }}
                className={allResultsStyle["track-hover-button"]}
            >
                <img alt={'Play button image'} src={Play} width={20} height={20}></img>
            </button>)}
    </div>

}

export default TopResult