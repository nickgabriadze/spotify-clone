import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Provider} from 'react-redux'
import {SpotiStore} from './store/store.ts'
import {BrowserRouter, Route, Routes} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={SpotiStore}>
            <BrowserRouter>
                <Routes>
                    <Route path={'*'} element={<App/>}> </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
)
