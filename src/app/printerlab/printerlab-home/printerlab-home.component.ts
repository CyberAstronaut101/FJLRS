import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
//import { Printer } from 'src/assets/interfaces';
//import { PrinterService } from './printer.service';

import { PrintQueueItem } from 'src/assets/interfaces';
import { PrinterlabService } from '../printerlab.service';
import { AuthService } from '../../auth/auth.service';

import { ConfirmationDialogComponent } from 'src/app/shared-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-printerlab-home',
  templateUrl: './printerlab-home.component.html',
  styleUrls: ['./printerlab-home.component.css'],
  providers: [MessageService]
})
export class PrinterlabHomeComponent implements OnInit {

  displayedColumns: string[] = ['Description', 'Material ID', 'Created At', 'Submitted By', 'Status'];

  
  // VARIABLES FOR THE CURRENT PRINT QUEUE JOBS TABLE
  queueTableData: PrintQueueItem[] = [];
  resultsLength = 0;
  currentQueueDataSource;
  private printerSub: Subscription;
  items: PrintQueueItem[];

  // VARIABLES FOR COMPLETED PRINT JOBS TABLE
  historyTableData: PrintQueueItem[] = [];
  historyResultsLength = 0;
  completedQueueDataSource;
  private historyItemSub: Subscription;

  // USER AUTH/CONTROL OF RENDER OBJECTS VARIABLES
  userIsAuthenticated: boolean;
  userLevel = "default";
  userId;
  userName = "default";

  msgs: Message[] = [];


  constructor(
    private printerlabService: PrinterlabService,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userLevel = this.authService.getUserLevel();
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserFullName();

    // GET CURRENT QUEUE JOBS
    this.printerlabService.getCurrentQueueItems();
    console.log("items:");
    this.printerSub = this.printerlabService.getItemsUpdateListener()
      .subscribe((items: PrintQueueItem[]) => {
        console.log('item subscription updated with new values!');
        // Set the table data
        this.queueTableData = items;
        this.currentQueueDataSource = new MatTableDataSource(this.queueTableData);
        this.resultsLength = this.queueTableData.length;
      });

    // GET COMPLETED PRINT JOBS
    this.printerlabService.getCompletedItems();
    this.historyItemSub = this.printerlabService.getCompletedItemsUpdatedListener()
      .subscribe((items: PrintQueueItem[]) => {
        console.log("History queue items loaded from API");
        console.log(items);
        // Set the table data
        this.historyTableData = items;
        this.completedQueueDataSource = new MatTableDataSource(this.historyTableData);
        this.historyResultsLength = this.completedQueueDataSource.length;
      })
  }

  openTicket(row) {
    console.log("Submitted By: " + row.submittedBy);
    console.log("Current User: " + this.userId);
    console.log("User Level: " + this.userLevel);

    if (this.userId == row.submittedBy || this.userLevel == 'admin') {
      this.router.navigate(['/printerlab/detail'], { queryParams: { jobId: row.id } });
    } else {
      // Display warning message if non-owner tries to access the queue job
      console.log("User has no access to queue line item");
      this.messageService.add(
        {
          severity: 'warn',
          summary: 'No Access!',
          detail: 'You do not own this queue item'
        }
      )
      // Wait 5 Seconds and then clear the pMessage
      setTimeout(() => {
        this.messageService.clear();
      }, 3000)
    }

  }

  applyCurrentFilter(filterValue: string) {
    console.log("applying filter: " + filterValue);
    this.currentQueueDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyHistoryFilter(filterValue: string) {
    console.log("applying filter: " + filterValue);
    this.completedQueueDataSource.filter = filterValue.trim().toLowerCase();
  }
}
