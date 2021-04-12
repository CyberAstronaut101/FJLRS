import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SubscribableOrPromise, Subscription } from 'rxjs';
import { PrintQueueItem } from 'src/assets/interfaces';
import { PrinterlabService } from '../printerlab.service';

@Component({
  selector: 'app-printerlab-history',
  templateUrl: './printerlab-history.component.html',
  styleUrls: ['./printerlab-history.component.css']
})
export class PrinterlabHistoryComponent implements OnInit {

  /*
      This component will reach out and display a list of previous jobs that are all marked as "completed"

      Will display a table that the user can search through

      This page will only show to employee or admin user accounts - access is enco

  */

  displayedColumns: string[] = ['Description', 'Material ID', 'Created At', 'Submitted By'];

  queueTableData: PrintQueueItem[] = [];
  resultsLength = 0;
  completedQueueDataSource;

  private printerSub: Subscription;

  constructor(
    private printerlabService: PrinterlabService
  ) { }

  ngOnInit() {

    this.printerlabService.getCompletedItems();

    this.printerSub = this.printerlabService.getCompletedItemsUpdatedListener()
      .subscribe((items: PrintQueueItem[]) => {
        console.log("History queue items loaded from API");
        console.log(items);

        this.queueTableData = items;
        this.completedQueueDataSource = new MatTableDataSource(this.queueTableData);
        this.resultsLength = this.completedQueueDataSource.length;
      })
  }

}
