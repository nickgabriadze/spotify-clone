import playerStyle from "../player.module.css";
import Pause from "../icons/pause.svg";
import Shuffle from "../icons/shuffle.svg";
import SkipNext from "../icons/skip-next.svg";
import SkipPrevious from "../icons/skip-previous.svg";
import Repeat from "../icons/repeat.svg";


export function PlayerSkeleton() {
    return (
        <div className={playerStyle['skeleton-wrapper']}>

            <div className={playerStyle['player-buttons']}>
                <img draggable={false} alt={'shuffle-skeleton'} src={Shuffle} width={20} height={20}></img>
                <img draggable={false} alt={'skip-previous-skeleton'} src={SkipPrevious} width={30} height={30}></img>
                <img draggable={false} alt={'pause-skeleton'} src={Pause} width={40} height={40}></img>
                <img draggable={false} alt={'skip-next-skeleton'} src={SkipNext} width={30} height={30}></img>
                <img draggable={false} alt={'repeat-skeleton'} src={Repeat} width={20} height={20}></img>
            </div>

            <div className={playerStyle['streaming-progress']}>

                <div>--:--</div>

                <div className={playerStyle['duration-placeholder']}></div>

                <div>--:--</div>
            </div>


        </div>
    );
}