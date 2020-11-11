import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

import { Router } from '@angular/router';

// import { Todo } from './todo.model';
// import { AuthService } from '../../auth/auth.service';
import { News } from '../../assets/interfaces';
// import { strictEqual } from 'assert';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/home';

// allows angjular to see at the root level, and it only creates 1 instance in the entire app
// there would be multiple copies of the todos else
@Injectable({providedIn: 'root'})
export class HomeService {

    // holds the list of Todos recieved from the server
    private news: News[] = [];

    /**************************************
      HomeService service for the initial render of the home screen


      This Service is purley to fetch information from the server on the status
      of the
        * *WoodShop
        * ?Laser Lab a-d status
        * todo 3D Printer queue
        * ! and make this expandable easily so that with future deparptments it can grow easier

    ***************************************/

    private newsUpdated = new Subject<News[]>();

    constructor(
        private http: HttpClient,
        private router: Router,
        ) {}



    getWoodshopStatus() {
      console.log('Getting woodshop status...');

      this.http.get<{results: any[]}>(BACKEND_URL + '/woodshop')
        .subscribe(resData => {
          console.log(resData);
        });

    }

}
