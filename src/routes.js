import InitialPage from './pages/initialPage'
import Main from './pages/main/'


import React from 'react'
import {Route, BrowserRouter} from 'react-router-dom'

const Routes = () =>{
    return(
        <BrowserRouter>
            
           <Route component={InitialPage} exact path ="/"/>
           <Route component={Main} path ="/token/:d" />
           
            
        </BrowserRouter>
    )
}

export default Routes