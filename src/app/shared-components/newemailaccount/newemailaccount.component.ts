import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmailAccount } from 'src/assets/interfaces';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-newemailaccount-dialog',
  templateUrl: './newemailaccount.component.html',
  styleUrls: ['./newemailaccount.component.css']
})
export class NewemailaccountComponent {

  public newEmailAcct: EmailAccount;

  constructor(
    public dialogRef: MatDialogRef<NewemailaccountComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }

    onSaveEmail(form: NgForm): void  {
      console.log("form email:")
      console.log(form.value.newEmailAcct)
      this.dialogRef.close({data: form.value.newEmailAcct});
    }

    onNoClick(): void {
    this.dialogRef.close();
  }

}
