import skeletonStyle from "./skeletons.module.css";

export function SongCardSkeleton() {
  return (
    <section className={skeletonStyle["track-wrapper"]}>
      <div className={skeletonStyle["track-info-skeleton"]}>
        <div className={skeletonStyle["track-nth-skeleton"]}></div>
        <div className={skeletonStyle["track-img-skeleton"]}></div>

        <div className={skeletonStyle["track-name-artists"]}>
          <div className={skeletonStyle["track-name-skeleton"]}></div>
          <div className={skeletonStyle["track-artists-skeleton"]}></div>
        </div>
      </div>
      
      <div className={skeletonStyle["track-album-skeleton"]}></div>

      <div className={skeletonStyle["track-duration-skeleton"]}>
        <div className={skeletonStyle["track-minutes-skeleton"]}></div>
        <div className={skeletonStyle["track-two-dots"]}>
          <div></div>
          <div></div>
        </div>
        <div className={skeletonStyle["track-seconds-skeleton"]}></div>
      </div>
    </section>
  );
}

export default SongCardSkeleton;
