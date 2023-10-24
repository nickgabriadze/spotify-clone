import {Category} from "../../../types/categories.ts";
import {useAppDispatch} from "../../../store/hooks.ts";
import {addReactComponentToNavigation} from "../../../store/features/navigationSlice.ts";


export function BrowsingCategoryCard({
                                         category,
                                         colorHex
                                     }: {
    category: Category;
    colorHex: string;
}) {

    const dispatch = useAppDispatch();
    const categoryName = category.name
                        .split("-")
                        .map((letter) => letter[0].toUpperCase().concat(letter.slice(1)))
                        .join(" ")

    return (
        <div
            style={{
                cursor: "pointer",
                backgroundColor: colorHex,
                height: "200px",
                color: "white",
                borderRadius: "10px",
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: "relative"
            }}
            onClick={() => dispatch(addReactComponentToNavigation({componentName: 'BrowsingCategory', props: [category?.id, categoryName]}))}
        >
            <div >
              <h1 style={{padding: '10px', wordWrap: 'break-word'}}>
                    {categoryName}
                </h1>
            </div>

            <div
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: "hidden",

                }}
            >
                <img
                    style={{
                        position: 'relative',
                        top: 70,
                        left: 120,
                        objectFit: 'cover',
                        transform: 'rotate(30deg)'
                    }}
                    alt={"category image"} src={category.icons[0].url} width={100} height={100}></img>
            </div>
        </div>
    );
}

export default BrowsingCategoryCard;
