import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-home',
  templateUrl: './account-home.component.html',
  styleUrls: ['./account-home.component.css']
})
export class AccountHomeComponent implements OnInit {

  

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit() {

    // On init, get the current user UID
    // Then pass it to the job 
    this.accountService.getCurrentOpenJobs(this.authService.getUserId());
  }

}
