/*
    Angular
*/
import '@angular/platform-browser-dynamic';
import '@angular/platform-browser';
import '@angular/core';
import '@angular/http';
import '@angular/router';
import '@angular/forms';
import 'rxjs';

/*
    3rd party js
*/
// For vendors for example jQuery, Lodash, angular2-jwt import them here
// Also see src/typings.d.ts as you also need to run `typings install x` where `x` is your module
import 'jquery/src/jquery';
//window['_'] = require('lodash');
//import 'semantic-ui/dist/semantic';

import 'ng2-toastr';
import 'linq';
import './assets/scripts/linq.array';

window['moment'] = require('moment');

/*
    3rd party styles
*/
//import 'rome/dist/rome.css';
import 'semantic-ui/dist/semantic.css';
//import 'font-awesome/css/font-awesome.css';
import 'ng2-toastr/bundles/ng2-toastr.min.css';

//import "primeng/resources/themes/omega/theme.css";
//import "primeng/resources/primeng.min.css";

/*
    App styles
*/
import './assets/styles/globals.scss';
