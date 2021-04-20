import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/admin/manage-users/user.service';
import { PrinterService } from 'src/app/admin/printer-management/printer.service';
import { Printer, PrintQueueItem, Comment } from 'src/assets/interfaces';
import { PrinterlabService } from '../printerlab.service';
import { AuthService } from '../../auth/auth.service';

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
    private userService: UserService,
    private authService: AuthService,) { }

  userIsAuthenticated: boolean;
  userLevel = "default";
  userName = "default";
  userId;

  job: PrintQueueItem;
  jobSub: Subscription;

  printers: Printer[];
  selectedPrinter: Printer;
  printerSub: Subscription;

  printStatus = "";
  statuses;
  selectedStatus: String;

  comments: Comment[];
  commentSub: Subscription;
  currentComment: String;
  

  ngOnInit() {
    console.log("PrinterLab-Detail OnInit");
    

    // Get admin/employee/student status
    // to get initial auth value
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userLevel = this.authService.getUserLevel();
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserFullName();
    // if need a subscription to userAuth status, example in navigation.component.ts
    

    //get job on load
    this.route.queryParams
      .subscribe(params => {
        console.log(params);

        // Make request with params.jobId
        this.printerLabService.getJob(params.jobId);

      })


    //set statuses
     var stats = [{label:"Submitted", value:"Submitted"}, {label:"Assigned", value:"Assigned"}, {label:"Need Info",value:"Need Info"}, 
        {label:"Printing", value:"Printing"}, {label:"Completed", value:"Completed"}];
     this.statuses = stats;

     

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

        //default to first printer
        //this.selectedPrinter = this.printers[0];
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

        //set comments
        this.printerLabService.getComments(this.job.id);
      })
    /* =======  End of PRINTER JOB DETAIL GET  ======= */

    
    //set comments
    this.commentSub = this.printerLabService.getCommentsUpdateListener()
     .subscribe(comments => {
       console.log("Got list of comments...");
       console.log(comments);
       this.comments = comments;
     })
    

  }

  assignPrinter()
  {
    this.printerLabService.assignPrinter(
      this.job.id,
      this.selectedPrinter.id,
      this.selectedPrinter.name,
      "Assigned"
    );
  }

  changePrintStatus()
  {
    this.printerLabService.changePrintStatus(
      this.job.id,
      this.selectedStatus
    );
  }

  downloadFile()
  {
    console.log("download file temp");
    
    // Make request to download file that was passed as the job.filqeId?
    // OR make request to download assets associated with the printQueueItem??
    // Going with printqueue item just for ease of expanding if more than 1 file at a time is allowed at download.

    this.printerLabService.downloadAssets(this.job.id);
  }

  sendComment()
  {
    if(this.currentComment != undefined)
    {
      console.log("Sending Comment: " + this.currentComment);
      this.printerLabService.sendComment(this.job.id, this.userId, this.currentComment, this.userName);

      this.currentComment = undefined;
    }
  }

}
