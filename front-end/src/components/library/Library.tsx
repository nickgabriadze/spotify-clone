import libraryStyle from './library.module.css';
import LibrarySVG from "./icons/library.svg";

export function Library() {


    return <section className={libraryStyle['lib-wrapper']}>
        <div className={libraryStyle['library-title']}>
            <img alt={"Library icon"} draggable={false} width={25} height={25} src={LibrarySVG}></img>
            <text>Your Library</text>
        </div>
    </section>
}

export default Library;