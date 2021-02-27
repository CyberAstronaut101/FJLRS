import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-request-submit-success',
  templateUrl: './request-submit-success.component.html',
  styleUrls: ['./request-submit-success.component.css']
})
export class RequestSubmitSuccessComponent {
  constructor(
    public dialogRef: MatDialogRef<RequestSubmitSuccessComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }
}
