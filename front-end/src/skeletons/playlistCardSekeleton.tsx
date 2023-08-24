import skeletonStyle from "./skeletons.module.css";

export function PlaylistCardSkeleton() {
  return (
    <div className={skeletonStyle["playlist-wrapper"]}>
      <div className={skeletonStyle["playlist-img-skeleton"]}></div>
      <div className={skeletonStyle["playlist-info-holder"]}>
        <div className={skeletonStyle["playlist-name-skeleton"]}></div>
        <div className={skeletonStyle["playlist-type-skeleton"]}></div>
      </div>
    </div>
  );
}


export default PlaylistCardSkeleton