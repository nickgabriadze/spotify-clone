import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './global.css'
import {Provider} from 'react-redux'
import {SpotiStore} from './store/store.ts'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import LoginPage from "./components/login/Login.tsx";


const routing = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path={'/welcome'} element={<LoginPage/>}></Route>
            <Route path={'*'} element={<App/>}/>
        </Route>
    )
)
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>

        <Provider store={SpotiStore}>
            <RouterProvider router={routing}></RouterProvider>
        </Provider>
    </React.StrictMode>,
)
