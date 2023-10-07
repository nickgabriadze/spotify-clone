import skeletonStyle from "./skeletons.module.css";

export function usersTopItemSkeleton(){


    return <div className={skeletonStyle['user-top-item-skeleton']}>
        <div className={skeletonStyle['shimmer']}></div>
        <div className={skeletonStyle['user-top-item-album-img-skeleton']}></div>

        <div className={skeletonStyle['user-top-item-info-skeleton']}>
            <div className={skeletonStyle['user-top-item-title-skeleton']}></div>
        </div>
    </div>
}

export default usersTopItemSkeleton;