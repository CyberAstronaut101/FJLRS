import { Component, OnInit, Input, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import { MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';

import { EmailService } from '../email.service';
import { EmailHistory } from 'src/assets/interfaces';
import { PagerService } from './pager.service';

import { AgGridAngular } from 'ag-grid-angular';



@Component({
  selector: 'app-emailhistorytable',
  templateUrl: './emailhistorytable.component.html',
  styleUrls: ['./emailhistorytable.component.css', './test.scss']
})
export class EmailhistorytableComponent implements OnChanges {

  // @ViewChild('agGrid') agGrid: AgGridAngular;

  @Input() historyDataInput: EmailHistory[];


  private gridApi;
  private gridColumnApi;

  columnDefs = [
    { headerName: 'From', field: 'from', sortable: true, filter: true, checkboxSelection: true},
    { headerName: 'To', field: 'to', sortable: true, filter: true},
    { headerName: 'Subject', field: 'subject', sortable: true, filter: true},
    { headerName: 'Return Code', field: 'rc', sortable: true, filter: true},
    { headerName: 'Send Date', field: 'sendDate', sortable: true, filter: true}
  ];
  private defaultColDef;
  // Row data for the grid is passed via the Input injector historyDataInput

  public gridOptionsInput;


  constructor() {
    this.columnDefs = [
      { headerName: 'From', field: 'from', sortable: true, filter: true, checkboxSelection: true},
      { headerName: 'To', field: 'to', sortable: true, filter: true },
      { headerName: 'Subject', field: 'subject', sortable: true, filter: true },
      { headerName: 'Return Code', field: 'rc', sortable: true, filter: true },
      { headerName: 'Send Date', field: 'sendDate', sortable: true, filter: true }
    ];

    this.defaultColDef = {
      width: 10,
      resizeable: true
    }

  }

  onGridReady(params) {
    console.log("!!! ON GRID READY() RUNNING !!!");
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
    window.onresize = () => {
      this.gridApi.sizeColumnsToFit();
    }


    // Set up subscriber for the data here? to will ngOnChanges take care of the data update
  }

  onFirstDataRendered(params) {
    console.log("AgGrid onFirstDataRendered()...");
    console.log(this.historyDataInput);
    // this.gridApi.autoSizeColumns();
    this.gridApi.sizeColumnsToFit();

  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    console.log('^^ EmailhistorytableComponent ngOnChanges() ^^^');
    console.log(changes);

    // This value is bound to the ag-grid-angular [rowData]
    console.log("new EmailHistory dataInput", this.historyDataInput);

    this.gridApi.sizeColumnsToFit();
  }



}
