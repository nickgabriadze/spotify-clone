import {Outlet} from "react-router-dom";

export function SearchLayout() {



    return (<section style={{height: '100%', width: '100%'}}>
        <div style={{height: '100%', width: '100%'}}>
            <Outlet/>
        </div>
    </section>);

}

export default SearchLayout;