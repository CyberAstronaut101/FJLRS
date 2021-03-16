import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Subject } from 'rxjs';



import { Message } from "primeng/api"
import { Observable } from 'rxjs';



// Environment file used to either point to local or production server, depending on how angular is compiled
import { environment } from "../../environments/environment";
import { PrintQueueItem } from 'src/assets/interfaces';
const BACKEND_URL = environment.apiUrl + '/printlab';

@Injectable({
  providedIn: 'root'
})
export class PrinterlabService {

  private items: PrintQueueItem[] = [];
  private itemsUpdated = new Subject<PrintQueueItem[]>();

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
  
  
  /**================================================== *
   * ==========  Upload/Download Files  ========== *
   * ================================================== */
  // http://howtonode.org/really-simple-file-uploads

  // uploadFile(file: any) {
  //   console.log("PrinterLabService::uploadFile()");
  //   console.log(file);

  //   this.http
  //     .post<{message: any}>(
  //       BACKEND_URL + '/upload',
  //       file
  //     )
  //     .subscribe(response => {
  //       console.log("RETURN from post@/api/printerlab/upload");
  //       console.log(response);
  //     })

    
  // }
//https://medium.com/coding-in-depth/customizing-angular-primeng-upload-control-87ea6aac0e63
  // uploadFile(filesToUpload: any): Observable<any> {
  //   let url = BACKEND_URL + '/upload';
  //   // url += id_alteracion + '/documentos';
  //   console.log("printerlab service files to upload:");
  //   console.log(filesToUpload);

  //   const formData: FormData = new FormData();

  //   // formData.append('json', JSON.stringify(catalogacion));

  //   // for (let file of filesToUpload) {
  //     formData.append('documento', filesToUpload, filesToUpload.name);
  //   // }

  //   console.log(formData);

  //   // let headers = new HttpHeaders();

  //   // return this.http.post(url, formData, { headers: headers });
  //   return this.http.post(url, formData);

  // }
  
  
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

  getItemsUpdateListener(){
    return this.itemsUpdated.asObservable();
  }

}


