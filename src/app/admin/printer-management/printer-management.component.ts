import { Component, OnInit } from '@angular/core';
//Need to go through these
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';

import {Message} from 'primeng//api';
import {MessageService} from 'primeng/api';

import { Printer } from 'src/assets/interfaces';

import { PrinterService } from './printer.service';

import { NgForm } from '@angular/forms';

@Component({
  selector: 'admin-printer-management',
  templateUrl: './printer-management.component.html',
  styleUrls: ['./printer-management.component.css']
})
export class PrinterManagementComponent implements OnInit {

  displayedColumns: string[] = ['Printer Name', 'Printer Type', 'Delete'];

  printerTableData: Printer[] = [];
  printerDataSource;
  resultsLength = 0;

  newPrinterName: string;
  newPrinterType: string;

  private printerSub: Subscription;


  constructor(private printerService: PrinterService) {}

  ngOnInit() {

    // Setup listener
    this.printerService.getPrinters();
    console.log("printers:");
    this.printerSub = this.printerService.getPrintersUpdateListener()
        .subscribe((printers: Printer[]) => {
            console.log('printer subscription updated with new values!');
            //this.isLoading = false;


            // Set the table data
            this.printerTableData = printers;
            this.printerDataSource = new MatTableDataSource(this.printerTableData);
            this.resultsLength = this.printerTableData.length;
    });
  }

  applyFilter(filterValue: string) {
    this.printerDataSource.filter = filterValue.trim().toLowerCase();
  }

  addPrinter()
  {
    this.printerService.addPrinter(
      this.newPrinterName,
      this.newPrinterType
    );
  }

  deletePrinter(name: string)
  {
    console.log("DELTE ROW: "+name);
    this.printerService.deletePrinter(
      name
    );
  }
}
