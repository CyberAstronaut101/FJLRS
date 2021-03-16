import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
//import { Printer } from 'src/assets/interfaces';
//import { PrinterService } from './printer.service';

import {PrintQueueItem} from 'src/assets/interfaces';
import { PrinterlabService } from '../printerlab.service';

import { ConfirmationDialogComponent } from 'src/app/shared-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-printerlab-home',
  templateUrl: './printerlab-home.component.html',
  styleUrls: ['./printerlab-home.component.css']
})
export class PrinterlabHomeComponent implements OnInit {

  displayedColumns: string[] = ['Description', 'Material ID', 'Created At', 'Submitted By', 'Open'];

  queueTableData: PrintQueueItem[] = [];
  resultsLength = 0;
  queueDataSource;

  private printerSub: Subscription;

  items: PrintQueueItem[];
  

  constructor(private printerlabService: PrinterlabService) { }

  ngOnInit() {
    // Setup listener
    this.printerlabService.getItems();
    console.log("items:");
    this.printerSub = this.printerlabService.getItemsUpdateListener()
        .subscribe((items: PrintQueueItem[]) => {
            console.log('item subscription updated with new values!');
            //this.isLoading = false;

            // Set the table data
            this.queueTableData = items;
            this.queueDataSource = new MatTableDataSource(this.queueTableData);
            this.resultsLength = this.queueTableData.length;
    });
  }

}
