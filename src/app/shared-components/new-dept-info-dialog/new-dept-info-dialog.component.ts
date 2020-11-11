import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-dept-info-dialog',
  templateUrl: './new-dept-info-dialog.component.html',
  styleUrls: ['./new-dept-info-dialog.component.css']
})
export class NewDeptInfoDialogComponent {

  public newDeptName: string;




  public mondayOpenStatus: boolean;
  public mondayOpenTime: Date;
  public mondayCloseTime: Date;

  public tuesdayOpenStatus: boolean;
  public tuesdayOpenTime: Date;
  public tuesdayCloseTime: Date;

  public wednesdayOpenStatus: boolean;
  public wednesdayOpenTime: Date;
  public wednesdayCloseTime: Date;

  public thursdayOpenStatus: boolean;
  public thursdayOpenTime: Date;
  public thursdayCloseTime: Date;

  public fridayOpenStatus: boolean;
  public fridayOpenTime: Date;
  public fridayCloseTime: Date;

  public saturdayOpenStatus: boolean;
  public saturdayOpenTime: Date;
  public saturdayCloseTime: Date;

  public sundayOpenStatus: boolean;
  public sundayOpenTime: Date;
  public sundayCloseTime: Date;

  constructor(
    public dialogRef: MatDialogRef<NewDeptInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }

  onSaveEmail(form: NgForm): void {
    console.log("Form values");
    console.log(form.value);

    // *Maybe make another dialog popup you know lol

    //'

    var hours = Math.abs(form.value.mondayOpenTime - form.value.mondayOpenTime) / 36e5;
    console.log(hours);

    var minutes = Math.abs(form.value.mondayOpenTime - form.value.mondayCloseTime) / 1000 / 60; //convert miliseconds to minutes
    console.log(minutes);


    // Enforce that all the times make sense, aka am/pm checks, and display text to confirm
    if ( form.value.mondayOpenTime > form.value.mondayCloseTime ){
      console.log("open is larger than close -- non valid hours");
    }

    if ( form.value.mondayOpenTime < form.value.mondayCloseTime ){
      console.log("open is smaller than close -- valid hours");
    }

    if ( form.value.mondayOpenTime == form.value.mondayCloseTime ){
      console.log("open is same as close -- cant have this");
    }

    // console.log(diff);
    // console.log(diff2);




    // this.dialogRef.close(
    //   {
    //     data: form.value.newEmailAcct
    //   }
    // );
  }

  onTimeChange(startTimeRef, closeTimeRef) {
    console.log("enforcing operating hours time rules...");

    // ? All of this is returning undefined. Need to figure out what is going on
    // ! Maybe need to add a custom directive for this form validation..

    console.log(startTimeRef);
    console.log(closeTimeRef);
    console.log(this.mondayOpenTime);
    console.log(this.mondayCloseTime);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
