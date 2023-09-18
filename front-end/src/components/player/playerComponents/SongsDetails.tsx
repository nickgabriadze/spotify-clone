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
        if (songNameHover) {

            if (Number(songNameRef?.current?.offsetWidth) > 160) {
                songNameRef?.current?.classList.add('song-name-animation');
            } else {
                songNameRef?.current?.classList.remove('song-name-animation');

            }
        } else {
            songNameRef?.current?.classList.remove('song-name-animation');
        }

        if (artistNameHover) {

            if (Number(artistNameRef?.current?.children.length) > 2) {
                artistNameRef?.current?.classList.add('song-name-animation');
            } else {
                artistNameRef?.current?.classList.remove('song-name-animation');

            }
        } else {
            artistNameRef?.current?.classList.remove('song-name-animation');
        }


    }, [artistNameRef.current, songNameRef.current, currentlyPlaying?.item?.id, songNameHover, artistNameHover])

    return (<div className={playerStyle["currently-playing-info"]}>
        <div className={playerStyle["currently-playing-info-album-img"]}>
            {currentlyPlaying?.item?.album?.images[0]?.url ? <img
                    alt="Album picture"
                    draggable={false}
                    src={currentlyPlaying?.item?.album?.images[0]?.url}
                    height={55}
                    width={55}
                ></img> :
                <div className={playerStyle["currently-playing-info-album-img-skeleton"]}></div>
            }
        </div>
        <div className={playerStyle["song-info"]}

        >
            <div className={playerStyle['song-info-box-without-heart']}
                 style={Number(songNameRef?.current?.offsetWidth) > 160
                 || Number(artistNameRef?.current?.children.length) > 2
                     ? {boxShadow: `-10px 0 27px -26px #B3B3B3  inset`, width: '200px'} : {width: 'fit-content'}
                 }
            >
                <div
                    className={playerStyle['song-name-artists-details']}>
                    <div className={playerStyle['song-name-box']}

                         onMouseOver={() => setSongNameHover(true)}
                         onMouseOut={() => setSongNameHover(false)}
                    >
                        {currentlyPlaying?.item?.name ? <a className={playerStyle["song-name"]}
                                                           ref={songNameRef}
                            >{currentlyPlaying?.item?.name}</a> :
                            <div className={playerStyle['song-name-skeleton']}>

                            </div>
                        }
                    </div>
                    <div className={playerStyle['song-name-box']}
                         onMouseOver={() => setArtistNameHover(true)}
                         onMouseOut={() => setArtistNameHover(false)}
                    >
                        {Number(currentlyPlaying?.item?.artists.length) > 0 ?
                            <div ref={artistNameRef}
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
                            </div> :

                            <div className={playerStyle['artists-name-skeleton']}></div>
                        }

                    </div>

                </div>

            </div>
            <div>
                {currentlyPlaying?.item?.name &&
                    <img src={Heart} width={20} height={18} alt="heart icon"></img>}
            </div>
        </div>
    </div>)

}

export default SongDetails