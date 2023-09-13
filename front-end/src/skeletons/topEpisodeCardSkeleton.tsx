import skeletonStyle from "./skeletons.module.css";

export function TopEpisodeCardSkeleton(){


    return <div className={skeletonStyle['top-episode-skeleton-wrapper']}>

        <div className={skeletonStyle['top-episode-image-skeleton-wrapper']}>
            <div className={skeletonStyle['top-episode-image-skeleton']}></div>
            <div className={skeletonStyle['top-episode-small-image-skeleton']}></div>
        </div>

        <div className={skeletonStyle['top-episode-title-skeleton']}></div>
        <div className={skeletonStyle['top-episode-info-skeleton']}>
            <div className={skeletonStyle['top-episode-explicit-skeleton']}></div>
            <div className={skeletonStyle['top-episode-date-time-skeleton']}></div>
        </div>
    </div>
}

export default TopEpisodeCardSkeleton;