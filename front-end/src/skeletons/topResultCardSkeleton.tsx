import skeletonStyle from "./skeletons.module.css";

export function TopResultCardSkeleton() {


    return <div className={skeletonStyle['top-res-skeleton-wrapper']}>
            <h2>Top Result</h2>
        <div className={skeletonStyle['top-res-inner-wrapper']}>
        <div className={skeletonStyle['top-res-image-skeleton']}></div>
        <div className={skeletonStyle['top-res-track-name-skeleton']}></div>
        <div className={skeletonStyle['top-res-track-artists-skeleton']}>
            <div className={skeletonStyle['top-res-explicit-skeleton']}></div>
            <div className={skeletonStyle['top-res-artist-skeleton']}></div>
            <div className={skeletonStyle['top-res-type-skeleton']}></div>
        </div>
        </div>

    </div>
}

export default TopResultCardSkeleton;