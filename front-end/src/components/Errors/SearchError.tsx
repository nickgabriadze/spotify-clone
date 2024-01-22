import {useParams} from "react-router-dom";

export function SearchError() {

    const {query} = useParams();

    return <div style={{
        'display': 'flex',
        'justifyContent': 'center',
        'alignItems': 'center',
        'width': '100%',
        'flexDirection': 'column',
        'color': 'white',
        'padding': '10px',
        'gap': '5px',
        fontSize: '1.2rem'

    }}>
        <h1>No results found for</h1>
        <h5 style={{
            wordBreak: 'break-word',

        }}>{query}</h5>
        <h1
            style={{
                fontFamily: 'Gotham Medium, sans-serif',
                fontWeight: 'bold',
            }}
        >Please make sure your words are spelled correctly or try reloading the page.</h1>
    </div>

}

export default SearchError;