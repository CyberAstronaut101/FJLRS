import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import {Subject } from 'rxjs';
import { map } from 'rxjs/operators'

import { Printer } from 'src/assets/interfaces';

import { environment } from "../../../environments/environment";
import { PMessage } from '../../../assets/interfaces';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + "/printer";

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  private printers: Printer[] = [];
  private printersUpdated = new Subject<Printer[]>();

  constructor(
    private http: HttpClient,
    public router: Router) { }


  getPrinters(){
    this.http
        .get<{message: string, printers: Printer[]}>(BACKEND_URL)
        .subscribe(ret => {
            console.log("PrinterService Loaded Printers:");
            console.log(ret);
            this.printers = ret.printers;
            this.printersUpdated.next([...this.printers]);
        })
  }

  getPrintersUpdateListener(){
    return this.printersUpdated.asObservable();
}

       

  addPrinter(Name: string, Type: string) {

    const newPrinter: Printer = {
        name: Name,
        type: Type
    }
    
    console.log('addPrinter() --> submitting single printer to api');
    console.log(newPrinter);
    console.log(BACKEND_URL+"/add");

    // post @ /api/printer
    this.http
      .post<{message: string}>(BACKEND_URL+"/add", newPrinter)
      .subscribe(ret => {
        console.log("PrinterService Added Printers:");
        console.log(ret);
        this.printers.push(newPrinter);
        this.printersUpdated.next([...this.printers]);
    });
  }

  deletePrinter(name: string) {
    this.http.delete(BACKEND_URL + '/' + name)
        .subscribe(() => {
            console.log('http delete request finished');
            // keep the elements that are not the same id
            const updatedPrinters = this.printers.filter(printers => printers.name!== name );
            this.printers = updatedPrinters;

            this.printersUpdated.next([...this.printers]);
        })
};
}
