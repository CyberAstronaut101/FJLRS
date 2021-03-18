import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { PrintQueueItem } from 'src/assets/interfaces';

const BACKEND_URL = environment.apiUrl + '/printlab';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient,
  ) { }


  // Get list of current open job requsts for user
  getCurrentOpenJobs(uid: string) {
    this.http
      .get<{message: string, jobs: PrintQueueItem[]}>(
        BACKEND_URL + '/user/' + uid)
      .subscribe(ret => {
        console.log(ret);
      })
    // Make HTTP GET request to API...
  }
}
