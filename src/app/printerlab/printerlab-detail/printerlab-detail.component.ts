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

     //set comments
     /*
     var c = [{user:"Student", text:"test comment 1"},{user:"ADMIN",text:"test comment 2"},{user:"Student",text:"test comment 3"},
        {user:"ADMIN",text:"test comment 4"},{user:"Student",text:"test comment 5"},{user:"Bartholomew Longname", text:"test comment 6"}, 
        {user:"Student Jones", text:"test comment 7"},{user:"Student Jones", text:"test comment 8"},{user:"Student Jones", text:"test comment 9"},
        {user:"Student Jones", text:"test comment 10"}
      ];
      */
      var c = [{user:"Student", text:"test comment 1", createdAtString:"3/14/9999"},{user:"ADMIN",text:"test comment 2", createdAtString:"3/14/9999"},{user:"Student",text:"test comment 3", createdAtString:"3/14/9999"},
      {user:"Student",text:"test comment 5", createdAtString:"3/14/9999"},{user:"Bartholomew Longname", text:"test comment 6", createdAtString:"3/14/9999"}, 
      {user:"Student Jones", text:"test comment 7", createdAtString:"3/14/9999"}
    ];
     //this.comments = c;

     this.printerLabService.getComments();
     this.commentSub = this.printerLabService.getCommentsUpdateListener()
      .subscribe(comments => {
        console.log("Got list of comments...");
        console.log(comments);
        this.comments = comments;
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


        // render data as needed

        // Lookup USER ID
        // 
      })
    /* =======  End of PRINTER JOB DETAIL GET  ======= */
    

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
    console.log("User Name: " + this.userName);
    console.log("User ID: " + this.userId);
    console.log("User Level: " + this.userLevel);
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
