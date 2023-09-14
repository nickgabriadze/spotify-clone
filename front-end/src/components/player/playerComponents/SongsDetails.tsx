import {CurrentlyPlaying} from "../../../types/currentlyPlaying"
import playerStyle from "../player.module.css"
import Heart from "../icons/heart.svg";
import {useEffect, useRef, useState} from "react";
import './animation.css'
export function SongDetails({currentlyPlaying}: { currentlyPlaying: CurrentlyPlaying | undefined }) {


    const [hoverRef, setHoverRef] = useState(false)

    const songNameRef = useRef<HTMLAnchorElement>(null)


    useEffect(() => {
        if(hoverRef) {
            if (Number(songNameRef?.current?.offsetWidth) > 200) {
                songNameRef?.current?.classList.add('song-name-animation');
            } else {
                songNameRef?.current?.classList.remove('song-name-animation');
            }
        }else{
                songNameRef?.current?.classList.remove('song-name-animation');
        }



    }, [songNameRef, currentlyPlaying?.item?.id, hoverRef])
    return (<div className={playerStyle["currently-playing-info"]}>
        <div className={playerStyle["currently-playing-info-album-img"]}>
            {currentlyPlaying?.item?.album?.images[0]?.url ? <img
                    alt="Album picture"
                    draggable={false}
                    src={currentlyPlaying?.item?.album?.images[0]?.url}
                    height={70}
                    width={60}
                ></img> :
                <div className={playerStyle["currently-playing-info-album-img-skeleton"]}></div>
            }
        </div>
        <div className={playerStyle["song-info"]}>
            <div className={playerStyle['song-name-box']}
            onMouseOver={() => setHoverRef(true)}
                 onMouseOut={() => setHoverRef(false)}
            >
                <a className={playerStyle["song-name"]}
                    ref={songNameRef}

                >{currentlyPlaying?.item?.name}</a>
            </div>
            <div>
                {currentlyPlaying?.item?.artists.map((each, i) => (
                    <a key={each.id} className={playerStyle["artists-name"]}>
                        {each.name}
                        {i === currentlyPlaying.item.artists.length - 1 ? "" : ", "}
                    </a>
                ))}
            </div>
        </div>
        <img src={Heart} width={20} height={18} alt="heart icon"></img>
    </div>)

}

export default SongDetails