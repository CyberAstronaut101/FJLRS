import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { Printer } from 'src/assets/interfaces';
import { PrinterService } from './printer.service';
import { ConfirmationDialogComponent } from 'src/app/shared-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'admin-printer-management',
  templateUrl: './printer-management.component.html',
  styleUrls: ['./printer-management.component.css']
})
export class PrinterManagementComponent implements OnInit {

  displayedColumns: string[] = ['Printer Name', 'Printer Type', 'Octopi URL', 'Delete'];

  printerTableData: Printer[] = [];
  printerDataSource;
  resultsLength = 0;

  newPrinterName: string;
  newPrinterType: string;
  newPrinterURL: string;

  private printerSub: Subscription;


  constructor(private printerService: PrinterService, private dialog: MatDialog) {}

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
      this.newPrinterType,
      this.newPrinterURL
    );
  }

  deleteDialog(name: string)
  {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete the printer: ' + name 
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePrinter(name);
      }
    });
  }

  deletePrinter(name: string)
  {
    console.log("DELTE ROW: "+name);
    this.printerService.deletePrinter(
      name
    );
  }
}
