import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';



import { environment } from "../../environments/environment";

import { PMessage } from '../../assets/interfaces';

const BACKEND_URL = environment.apiUrl + "/printerLab";

@Injectable({providedIn: 'root'})
export class PrinterlabService {


    constructor(
        private http: HttpClient,
        public router: Router) {}



    /*
        PRINTER LAB SERVICE 
        -------------------------------------------

        -- Will do the creating jobs here?

    */

}