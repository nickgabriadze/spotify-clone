import {CurrentlyPlaying} from "../../../types/currentlyPlaying"
import playerStyle from "../player.module.css"
import Heart from "../icons/heart.svg";
import {useEffect, useRef, useState} from "react";
import './animation.css'
export function SongDetails({currentlyPlaying}: { currentlyPlaying: CurrentlyPlaying | undefined }) {


    const [songNameHover, setSongNameHover] = useState(false)
    const [artistNameHover, setArtistNameHover] = useState(false)
    const songNameRef = useRef<HTMLAnchorElement>(null)
    const artistNameRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(songNameHover) {

            if (Number(songNameRef?.current?.offsetWidth) > 200) {
                songNameRef?.current?.classList.add('song-name-animation');
            } else {
                songNameRef?.current?.classList.remove('song-name-animation');

            }
        }else{
                songNameRef?.current?.classList.remove('song-name-animation');
        }

        if(artistNameHover) {

            if (Number(artistNameRef?.current?.children.length) > 2) {
                artistNameRef?.current?.classList.add('song-name-animation');
            } else {
                artistNameRef?.current?.classList.remove('song-name-animation');

            }
        }else{
            artistNameRef?.current?.classList.remove('song-name-animation');
        }



    }, [artistNameRef.current, songNameRef.current, currentlyPlaying?.item?.id, songNameHover, artistNameHover])

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
            onMouseOver={() => setSongNameHover(true)}
                 onMouseOut={() => setSongNameHover(false)}
            >
                <a className={playerStyle["song-name"]}
                    ref={songNameRef}

                >{currentlyPlaying?.item?.name}</a>
            </div>
            <div className={playerStyle['song-name-box']}
                 onMouseOver={() => setArtistNameHover(true)}
                 onMouseOut={() => setArtistNameHover(false)}
            >
                <div  ref={artistNameRef}
                style={{
                    width: '200px',
                    position: 'relative'
                }}
                >
                {currentlyPlaying?.item?.artists.map((each, i) => (
                    <a key={each.id} className={playerStyle["artists-name"]}
                    >
                        {each.name}
                        {i === currentlyPlaying.item.artists.length - 1 ? "" : ", "}
                    </a>
                ))}
                </div>
            </div>
        </div>
        <img src={Heart} width={20} height={18} alt="heart icon"></img>
    </div>)

}

export default SongDetails