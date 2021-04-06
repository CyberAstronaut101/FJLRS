import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/admin/manage-users/user.service';
import { PrinterService } from 'src/app/admin/printer-management/printer.service';
import { Printer, PrintQueueItem } from 'src/assets/interfaces';
import { PrinterlabService } from '../printerlab.service';

@Component({
  selector: 'app-printerlab-detail',
  templateUrl: './printerlab-detail.component.html',
  styleUrls: ['./printerlab-detail.component.css']
})
export class PrinterlabDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private printerLabService: PrinterlabService,
    private printerService: PrinterService,
    private userService: UserService) { }

  job: PrintQueueItem;
  jobSub: Subscription;

  printers: Printer[];
  selectedPrinter;
  printerSub: Subscription;

  ngOnInit() {
    console.log("PrinterLab-Detail OnInit");
    

    // Get admin/employee/student status

    this.route.queryParams
      .subscribe(params => {
        console.log(params);

        // Make request with params.jobId
        this.printerLabService.getJob(params.jobId);

      })


    
    /**================================================== *
     * ==========  GET AVAILABLE PRINTERS  ========== *
     * ================================================== */
    this.printerService.getPrinters();

    this.printerSub = this.printerService.getPrintersUpdateListener()
      .subscribe(printers => {
        // Load printers for frontend
        console.log("Got list of printers...");
        console.log(printers);
        this.printers = printers;
      })
    /* =======  End of GET AVAILABLE PRINTERS  ======= */


      
    /**================================================== *
     * ==========  PRINTER JOB DETAIL GET  ========== *
     * ================================================== */
    // !SUBSCRIPTION FOR SINGLE JOB
    this.jobSub = this.printerLabService.getJobUpdateListener()
      .subscribe(updatedJob => {
        // JOB RETURNED FORM DB LOOKUP
        this.job = updatedJob;
        console.log("JOB FROM DB");
        console.log(this.job);


        // render data as needed

        // Lookup USER ID
        // 
      })
    /* =======  End of PRINTER JOB DETAIL GET  ======= */
    

  }

}
