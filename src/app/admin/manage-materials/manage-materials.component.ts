import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { Material } from 'src/assets/interfaces';
//import {  } from './print.service';
import { ConfirmationDialogComponent } from 'src/app/shared-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'admin-manage-materials',
  templateUrl: './manage-materials.component.html',
  styleUrls: ['./manage-materials.component.css']
})
export class ManageMaterialsComponent implements OnInit {


  displayedColumns: string[] = ['Material Name', 'Material Type', 'Material Price'];


  MaterialTableData: Material[] = [];
  MaterialDataSource;
  resultsLength = 0;


  constructor() { }

  ngOnInit() {
  }

}
