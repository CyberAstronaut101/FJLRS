import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { Material } from 'src/assets/interfaces';
//import {  } from './print.service';
import { ConfirmationDialogComponent } from 'src/app/shared-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { MaterialService } from './material.service';

@Component({
  selector: 'admin-manage-materials',
  templateUrl: './manage-materials.component.html',
  styleUrls: ['./manage-materials.component.css']
})
export class ManageMaterialsComponent implements OnInit {


  displayedColumns: string[] = ['Material Name', 'Material Type', 'Material Price', 'Delete'];


  MaterialTableData: Material[] = [];
  MaterialDataSource;
  resultsLength = 0;


  newMaterialName: string;
  newMaterialPrice: string;
  newMaterialType: string;
  private materialSub: Subscription;

  
constructor(private materialService: MaterialService, private dialog: MatDialog) { }

ngOnInit() {

  // Setup listener
  this.materialService.getMaterials();
  console.log("materials:");
  this.materialSub = this.materialService.getMaterialsUpdateListener()
      .subscribe((materials: Material[]) => {
          console.log('material subscription updated with new values!');
          //this.isLoading = false;

          // Set the table data
          this.MaterialTableData = materials;
          this.MaterialDataSource = new MatTableDataSource(this.MaterialTableData);
          this.resultsLength = this.MaterialTableData.length;
  });
}
  addMaterial()
  {
    this.materialService.addMaterial(
      this.newMaterialName,
      this.newMaterialType,
      this.newMaterialPrice
    );
  }

  deleteDialog(name: string)
  {
    console.log("name of material to delete: "+ name);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete the material: ' + name 
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.materialService.deleteMaterial(name);
      }
    });
  }


  // Functions for searching table

  applyFilter(filterValue: string) {
    this.MaterialDataSource.filter = filterValue.trim().toLowerCase();
  }
}
