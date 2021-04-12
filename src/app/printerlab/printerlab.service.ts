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
import { Comment } from 'src/assets/interfaces';

const BACKEND_URL = environment.apiUrl + '/printlab';

@Injectable({
  providedIn: 'root'
})
export class PrinterlabService {

  private items: PrintQueueItem[] = [];
  private itemsUpdated = new Subject<PrintQueueItem[]>();

  private completedItems: PrintQueueItem[] = []
  private completedItemsUpdated = new Subject<PrintQueueItem[]>();

  private job: PrintQueueItem;
  private jobUpdated = new Subject<PrintQueueItem>();

  private comments: Comment[] = [];
  private commentsUpdated = new Subject<Comment[]>();

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

  // RETURNS ALL ITEMS REGARDLESS OF PRINTSTATUS STATE
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

  // RETURN ALL ITEMS WITH printStatus: != Completed
  getCurrentQueueItems() {
    this.http
    .get<{message: string, printers: PrintQueueItem[]}>(BACKEND_URL+"/items/current")
    .subscribe(ret => {
        console.log("Current Print Queue Loaded Items:");
        console.log(ret);
        this.items = ret.printers;
        this.itemsUpdated.next([...this.items]);
    })
  }

  // RETURN ALL ITEMS with printStatus: "Completed"
  getCompletedItems() {
    this.http
      .get<{message: string, printers: PrintQueueItem[]}>(BACKEND_URL+"/items/completed")
      .subscribe(ret => {
        console.log("Completed Print Queue Loaded Items:")
        console.log(ret);
        this.completedItems = ret.printers;
        this.completedItemsUpdated.next([...this.completedItems]);
      })
  }

  // Get specific job?
  getJob(jobId) {
    this.http
      .get<{message: string, user: string, material: string, printer: string, printJob: PrintQueueItem}>(BACKEND_URL+"/item/" + jobId)
      .subscribe(ret => {

        // TODO continue here
        this.job = ret.printJob;
        this.job.userName = ret.user;
        this.job.material = ret.material;
        this.job.assignedPrinterName = ret.printer;
        this.job.createdAtString = this.formatTime(ret.printJob.createdAt);

        this.jobUpdated.next(this.job);
        

      })
  }

  // Assign a queue item to a printer
  assignPrinter(jobId, selectedPrinter, selectedPrinterName, newPrintStatus) {
    console.log("assign printer " + selectedPrinter + " to job " + jobId);
    let url = BACKEND_URL + '/assignPrinter';
    let postBody = {job: jobId, printerId: selectedPrinter, printStatus: newPrintStatus} 

    this.http.post<{message: string, ok: boolean}>(url, postBody)
      .subscribe(response => {
        if(response.ok)
        {
          this.job.assignedPrinterName = selectedPrinterName;
          this.job.printStatus = newPrintStatus;
          this.jobUpdated.next(this.job);
        }
      })
  }

  changePrintStatus(jobId, newPrintStatus) {
    let url = BACKEND_URL + '/changeStatus';
    let postBody = {job: jobId, printStatus: newPrintStatus} 

    this.http.post<{message: string, ok: boolean}>(url, postBody)
      .subscribe(response => {
        if(response.ok)
        {
          this.job.printStatus = newPrintStatus;
          this.jobUpdated.next(this.job);
        }
      })
  }

  getItemsUpdateListener(){
    return this.itemsUpdated.asObservable();
  }

  getCompletedItemsUpdatedListener() {
    return this.completedItemsUpdated.asObservable();
  }

  getJobUpdateListener() {
    return this.jobUpdated.asObservable();
  }

  getCommentsUpdateListener() {
    return this.commentsUpdated.asObservable();
  }

  //helper function
  formatTime(time) {
    var year = time.substring(0, 4);
    var month = time.substring(5, 7);
    var day = time.substring(8, 10);
    var clock = time.substring(11, 16);

    var newTime = month+"/"+day+"/"+year + " " + clock;
    return newTime;
  }


  //TODO MOVE THIS TO SEPARATE SERVICE???
  getComments(){
    this.http
        .get<{message: string, comments: Comment[]}>(environment.apiUrl + '/comment')
        .subscribe(ret => {
            console.log("Comment Service Loaded Comments:");
            console.log(ret);

            ret.comments.forEach(element => {
              element.createdAtString = this.formatTime(element.createdAt);
            });

            this.comments = ret.comments;
            this.commentsUpdated.next([...this.comments]);
        })
  }

  sendComment(job, subBy, commentText, user) {
    console.log("send Comment " + commentText);
    let url = environment.apiUrl + '/comment';
    let postBody = {jobId: job, submittedBy: subBy, text: commentText, userName: user} 

    this.http.post<{message: string, ok: boolean, comment: Comment}>(url, postBody)
      .subscribe(response => {
        if(response.ok)
        {
          console.log("Response after PUSH: " + response.comment);
          response.comment.createdAtString = this.formatTime(response.comment.createdAt);
          this.comments.push(response.comment);
          this.commentsUpdated.next([...this.comments]);
        }
      })
  }


}


