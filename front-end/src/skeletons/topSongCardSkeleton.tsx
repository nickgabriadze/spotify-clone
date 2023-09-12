import skeletonStyle from "./skeletons.module.css";

export function TopSongCardSkeleton(){


    return <div className={skeletonStyle['top-song-skeleton-wrapper']}>

        <div className={skeletonStyle['top-song-details-skeleton']}>

            <div className={skeletonStyle['top-song-image-skeleton']}></div>

            <div className={skeletonStyle['top-song-title-artist-skeleton']}>
                <div className={skeletonStyle['top-song-title-skeleton']}></div>
                <div className={skeletonStyle['top-song-explicit-artists']}>
                    <div></div>
                    <div></div>
                </div>
            </div>

        </div>

        <div className={skeletonStyle['top-song-duration-skeleton']}>

        </div>

    </div>
}

export default TopSongCardSkeleton;