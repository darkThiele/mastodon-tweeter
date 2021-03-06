import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from './components/App';
import queryString from 'query-string';

ReactDOM.render(
    <Router>
        <Route render={(props)=>
            <App
                qs={queryString.parse(props.location.search)} 
            />
        }/>
    </Router>,
    document.querySelector('#root')
);