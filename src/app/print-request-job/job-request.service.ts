import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/printlab";

@Injectable({
  providedIn: 'root'
})
export class JobRequestService {
  //Object that holds all the data from the different forms

  // Temporary hold for the file as it will be uploaded once 'submit' is clicked

  hasFile: boolean;
  hasMaterial: boolean;
  hasComment: boolean;
  hasQuote: boolean;

  jobSubmissionInformation = {
    file: {},  
    material: {},
    comment: '',
    quote: ''
  }

  private jobSubmissionComplete = new Subject<any>();

  constructor(
    private http: HttpClient
  ) {}

  submitJobRequest(uploadData: FormData) {

    console.log("job request service submit job reqeust");
    console.log(uploadData);

      this.http
        .post<{message: any}>(BACKEND_URL, uploadData)
        .subscribe(ret => {
          console.log("Return from API on new queue item request..");
          console.log(ret);

          // Expecting object with -- message::queueItem{}

          this.jobSubmissionComplete.next(ret);

        })
      // Then on the callback upload the queue item with the fileupload ._id
  }

  getJobRequestListener() {
    return this.jobSubmissionComplete.asObservable();
  }


}
