import skeletonStyle from "./skeletons.module.css";

export function AlbumCardSkeleton() {
  return (
    <div className={skeletonStyle["album-wrapper"]}>
      <div className={skeletonStyle["album-img-skeleton"]}></div>
      <div className={skeletonStyle["album-info-holder"]}>
        <div className={skeletonStyle["album-name-skeleton"]}></div>
        <div className={skeletonStyle['album-details-skeleton']}>
          <div className={skeletonStyle["album-release-year-skeleton"]}></div>
          <div className={skeletonStyle["album-type-skeleton"]}></div>
        </div>
      </div>
    </div>
  );
}

export default AlbumCardSkeleton;
