import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';



import { environment } from "../../environments/environment";

import { PMessage } from '../../assets/interfaces';

const BACKEND_URL = environment.apiUrl + "/user";

@Injectable({providedIn: 'root'})
export class WoodshopService {

    constructor(
        private http: HttpClient,
        public router: Router) {}



    /*
        Actions that this Service will provide

        -- Check the user into the lab
        -- Check the user out of the lab

        -- 

    */

}