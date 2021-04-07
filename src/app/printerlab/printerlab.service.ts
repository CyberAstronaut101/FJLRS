import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Subject } from 'rxjs';



import { Message } from "primeng/api"
import { Observable } from 'rxjs';



// Environment file used to either point to local or production server, depending on how angular is compiled
import { environment } from "../../environments/environment";
import { PrintQueueItem } from 'src/assets/interfaces';
import { stringify } from '@angular/compiler/src/util';
const BACKEND_URL = environment.apiUrl + '/printlab';

@Injectable({
  providedIn: 'root'
})
export class PrinterlabService {

  private items: PrintQueueItem[] = [];
  private itemsUpdated = new Subject<PrintQueueItem[]>();

  private job: PrintQueueItem;
  private jobUpdated = new Subject<PrintQueueItem>();

  constructor(private http: HttpClient, private router: Router) { }


  uploadFile(file) {
    console.log("PrinterLabService::uploadFile()");
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    // Append other keys here like user submit id etc once working

    // Seems like no actual 'data' is being added to the formData..?

    console.log(formData);
    let url = BACKEND_URL + '/upload';
    console.log("post url: " + url);
    this.http.post(url, formData);
        this.http
      .post<{message: any}>(
        BACKEND_URL + '/upload',
        formData
      )
      .subscribe(response => {
        console.log("RETURN from post@/api/printLab/upload");
        console.log(response);
      })
  }
  
  /* =======  End of Upload/Download Files  ======= */

  getItems(){
    this.http
        .get<{message: string, printers: PrintQueueItem[]}>(BACKEND_URL+"/items")
        .subscribe(ret => {
            console.log("PrintQueueItemService Loaded Items:");
            console.log(ret);
            this.items = ret.printers;
            this.itemsUpdated.next([...this.items]);
        })
  }

  getJob(jobId) {
    this.http
      .get<{message: string, user: string, printJob: PrintQueueItem}>(BACKEND_URL+"/item/" + jobId)
      .subscribe(ret => {

        // TODO continue here
        this.job = ret.printJob;
        this.job.userName = ret.user
        this.jobUpdated.next(this.job);

      })
  }

  assignPrinter(jobId, selectedPrinter, newPrintStatus) {
    console.log("assign printer " + selectedPrinter + " to job " + jobId);
    let url = BACKEND_URL + '/assignPrinter';
    let postBody = {job: jobId, printerId: selectedPrinter, printStatus: newPrintStatus} 

    this.http.post(url, postBody)
      .subscribe(response => {
        console.log("RETURN from post@/api/printLab/assignPrinter");
        console.log(response);
      })
  }

  changePrintStatus(jobId, newPrintStatus) {
    let url = BACKEND_URL + '/changeStatus';
    let postBody = {job: jobId, printStatus: newPrintStatus} 

    this.http.post(url, postBody)
      .subscribe(response => {
        console.log("RETURN from post@/api/printLab/changeStatus");
        console.log(response);
      })
  }

  getItemsUpdateListener(){
    return this.itemsUpdated.asObservable();
  }

  getJobUpdateListener() {
    return this.jobUpdated.asObservable();
  }

}


