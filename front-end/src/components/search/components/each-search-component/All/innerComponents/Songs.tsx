import allResultsStyle from "../allresults.module.css";
import {Track} from "../../../../../../types/track.ts";
import millisecondsToHhMmSs from "../../../../../player/msConverter.ts";
import {useState} from "react";

export function Songs({firstFour}: { firstFour: Track[] | undefined }) {
    const [hoveringOver, setHoveringOver] = useState<string>('none');


    return <div className={allResultsStyle['top-songs-wrapper']}>
        <h2>Songs</h2>
        <div className={allResultsStyle['top-songs-box']}>
            {firstFour?.map((eachTrack, i) =>
                <div key={i} className={allResultsStyle['top-song']}

                     style={eachTrack.id === hoveringOver ? {cursor:"pointer",  backgroundColor: `#3b3a3a`, borderRadius: '4px'} : {}}
                     onMouseOut={() => setHoveringOver('none')}
                     onMouseOver={() => setHoveringOver(eachTrack.id)}>
                    <div className={allResultsStyle['song-img-details']}>
                        <img alt={'Album image'} src={eachTrack?.album.images[0]?.url} width={40} height={40}></img>
                        <div className={allResultsStyle['song-details']}>
                            <a>{eachTrack?.name[0].toUpperCase().concat(eachTrack?.name.slice(1,))}</a>
                            <div className={allResultsStyle['song-artists']}>
                                {eachTrack.artists.map((artist, i) =>
                                    <a>{i === eachTrack.artists.length - 1 ? artist.name : `${artist.name}, `}</a>)}
                            </div>
                        </div>
                    </div>
                    <div className={allResultsStyle['song-duration-heart']}>
                        {<div></div>}
                        <div
                            className={allResultsStyle['duration']}>{millisecondsToHhMmSs(Number(eachTrack?.duration_ms))}</div>
                    </div>
                </div>)}

        </div>
    </div>
}

export default Songs;
