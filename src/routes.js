
import App from './App'


import React from 'react'
import {Route, BrowserRouter} from 'react-router-dom'

const Routes = () =>{
    return(
        <BrowserRouter>
            <Route component={App} path ="/token:/:d" exact/>
           <Route component={App} path ="/"/>
            
        </BrowserRouter>
    )
}

export default Routes