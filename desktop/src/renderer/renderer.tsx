import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

//custom css
import './assets/css/index.css';
import './assets/css/bootstrap-custom.css';

//bootstrap
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';

import './react-customprops';

ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );


