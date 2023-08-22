import skeletonStyle from "./skeletons.module.css"

export function ArtistCard() { 


    return <div className={skeletonStyle['artists-wrapper']}>

            <div className={skeletonStyle['artist-img-skeleton']}></div>
            <div className={skeletonStyle['artist-info-holder']}>
            <div className={skeletonStyle['artist-name-skeleton']}></div>
            <div className={skeletonStyle['artist-type-skeleton']}></div>
            </div>
    </div>
}


export default ArtistCard