import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { MaterialService } from 'src/app/admin/manage-materials/material.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Material } from 'src/assets/interfaces';
import { JobRequestService } from '../job-request.service';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css'],
  styles: [`:host /deep/ .ui-steps .ui-steps-item {
    width: 20%;
}`],
  providers: [MessageService]
})
export class RequestFormComponent implements OnInit {

  // FILE UPLOAD DATA
  uploadFiles: any;
  selectedMaterial: Material;

  // For the material selection
  materials: Material[];
  private materialSub: Subscription;

  extraComments: string = "";
  uid: string;

  private jobSubmissionSub: Subscription;

  constructor(
    private jobRequestService: JobRequestService,
    private materialService: MaterialService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private dialog: MatDialog) {
  }

  ngOnInit() {

    if(this.authService.getIsAuth()) {
      // User logged in
      this.uid = this.authService.getUserId();
    }


    // Get the current available materials from the service
    this.materialService.getMaterials();
    this.materialSub = this.materialService.getMaterialsUpdateListener()
      .subscribe((materials: Material[]) => {
        console.log("Retrieved current materials from db...");
        
        console.log(materials);
        this.materials = materials;
      })

    // Setup listener for after job is submitted
    this.jobSubmissionSub = this.jobRequestService.getJobRequestListener()
      .subscribe(any => {
        console.log("After successful submission.....");

        console.log(any);
        this.messageService.clear();
        this.messageService.add(any.message);
        
        // // Prompt user with confirmation dialog
        // const dialogRef = this.dialog.open(NotificationDialogComponent, {
        //   width: '350px',
        //   data: 'Successfully submitted job request!'
        // });
        // dialogRef.afterClosed().subscribe(result => {

        //     // User acknoledged the dialog
        //     // Regardless of yes/no, redirect
        //     this.router.navigate(['/printerlab']);

        // });

        setTimeout(() => {
          this.router.navigate(['/printerlab']);
        }, 1000)
        


      });


  }

  submit() {
    this.messageService.clear();
    // Data to submit
    console.log('Submit for job request clicked');

    // Make sure file is selected
    // Make sure material is selected
    // Dont worry about extraComments, set to 'none'

    // Check if file has been selected
    if(!this.uploadFiles) {
      console.log("No file selected..");
      this.messageService.add({
        severity: "error",
        summary: "Not Submitted",
        detail: "No job file selected for upload"
      })
      return;
    }

    if(!this.selectedMaterial) {
      console.log("No Material selected..");
      this.messageService.add({
        severity: "error",
        summary: "Not Submitted",
        detail: "No print material selected"
      })
      return;
    }

    // MongoDB wants item with length, so if no additional commands set to 'none provided'
    if(this.extraComments.length == 0){
      this.extraComments = "None Provided";
    }


    console.log(this.uploadFiles);
    console.log(this.selectedMaterial);
    console.log(this.extraComments);


    let formData:FormData = new FormData();
    formData.append('file', this.uploadFiles, this.uploadFiles.name);
    formData.append('material', this.selectedMaterial.id);
    formData.append('comments', this.extraComments);
    formData.append('uid', this.uid);

    this.jobRequestService.submitJobRequest(formData);
  }

  // For file upload
  onSelect($event) {
    // this.fileToUpload = $event.files[0];
    this.uploadFiles = $event.files[0];
  }

  

}
