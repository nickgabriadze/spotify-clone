import libraryStyle from "./library.module.css";

export function LibraryItemSkeleton() {


    return <div className={libraryStyle['library-skeleton-wrapper']}>
        <div className={libraryStyle['library-skeleton-img-holder']}>

        </div>
        <div className={libraryStyle['library-info-skeleton-wrapper']}>
            <div className={libraryStyle['library-info-title-skeleton']}>

            </div>
            <div className={libraryStyle['library-info-owner-skeleton']}>

            </div>
        </div>
    </div>
}

export default LibraryItemSkeleton;