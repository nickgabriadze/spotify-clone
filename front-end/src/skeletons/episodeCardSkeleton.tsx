import skeletonStyle from "./skeletons.module.css"
export function EpisodeCardSkeleton(){


    return (
        <div className={skeletonStyle['episode-skeleton-wrapper']}>
            <div className={skeletonStyle['episode-img-skeleton']}></div>

            <div className={skeletonStyle['episode-info-wrapper']}>
                <div className={skeletonStyle['episode-title-skeleton']}></div>
                <div className={skeletonStyle['episode-description-skeleton']}></div>
                <div className={skeletonStyle['episode-smaller-details-skeleton']}>
                    <div className={skeletonStyle['episode-explicit-skeleton']}></div>
                    <div className={skeletonStyle['episode-date-skeleton']}></div>
                    <div className={skeletonStyle['episode-small-dot-skeleton']}></div>
                    <div className={skeletonStyle['episode-duration-skeleton']}></div>
                </div>


            </div>
        </div>
    )

}

export default EpisodeCardSkeleton;
