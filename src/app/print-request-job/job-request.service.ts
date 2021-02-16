import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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

  jobSubmissionComplete$ = this.jobSubmissionComplete.asObservable();


  uploadFileSelected(uploadFile) {
    this.jobSubmissionInformation.file = uploadFile;
    this.hasFile = true;
  }

  materialSelected(material) {
    this.jobSubmissionInformation.material = material;
    this.hasMaterial = true;
  }

  submitJobRequest() {

    // Right now only file and material are required items
    if(this.hasFile && this.hasMaterial) {
      // Make fileupload request
      
      \// Then on the callback upload the queue item with the fileupload ._id
    }

  }



  getJobSubmissionInformation() {
    return this.jobSubmissionInformation;
  }

}
