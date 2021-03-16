import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor() { }


  // Get list of current open job requsts for user
  getCurrentOpenJobs(uid: string) {
    // Make HTTP GET request to API...
  }
}
