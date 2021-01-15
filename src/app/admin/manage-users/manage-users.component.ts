import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';

import { User } from 'src/app/auth/user.model';
import { UserService } from './user.service';

import {Message} from 'primeng//api';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'admin-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
  providers: [MessageService]
})
export class ManageUsersComponent implements OnInit {


  // PrimeNG p-messages
  msgs: Message[] = [];
  private messagesUpdatedSub: Subscription;

  levels = ['student', 'employee', 'admin'];
  // =========== Class Memebers
  displayedColumns: string[] = ['select', 'Student ID', 'First Name', 'Last Name', 'Email', 'User Level'];

  userTableData: User[] = []; // stores the basic user model for the user table
  userDataSource;
  resultsLength = 0;
  private userSub: Subscription;
  checked;


  // Holds the data for the selected users in the 
  selection = new SelectionModel<User>(true, []);
  selectionLength = Selection.length;

  constructor(private userService: UserService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.userService.getUsers(); // prompts the userService to request the users from server
    this.userSub = this.userService.getUserUpdateListener()
      .subscribe((users: User[]) => {
        console.log('looading users to table');
        this.userTableData = users;
        this.userDataSource = new MatTableDataSource(this.userTableData);
        this.resultsLength = this.userTableData.length;
      })

    this.messagesUpdatedSub = this.userService.getUserMessagesUpdatedListener()
      .subscribe((messages: Message[]) => {
        console.log('new pmessage from user service');
        this.messageService.clear();
        messages.forEach(elem => {
          this.messageService.add(elem);
        });
      });
  }

  requestUserPasswordReset(userEmail: string) {
    // TODO make a call and email from the systems email in saved in the settings
    console.log('ManageUsersComponent::requestUserPasswordReset( ' + userEmail + ')');

    this.userService.startPasswordResetWorkflow(userEmail);

  }

  updateTrainingLevels(updatedUser: User
    // newLaserLab01: boolean,
    // newLaserLab02: boolean,
    // newWoodShop01: boolean,
    // newWoodShop02: boolean,
    // newWoodShop03: boolean,
    // newPlotters: boolean,
    // newProjectors: boolean
  ) {
    console.log("Updating selected user traning levels...");
    console.log(updatedUser);

    console.log("sending to userService:");
    // console.log(newTrainingLevels);

    this.userService.updateTrainingLevels(updatedUser);
  }

  // ============ FILTER for searching within user table
  applyFilter(filterValue: string) {
    this.userDataSource.filter = filterValue.trim().toLowerCase();
  }

  loadUserForEdit() {
    console.log('load user details into edit view:');
  }


  onItemSelected(row: string) {
    console.log("Item selected in row: ");
    console.log(row);

    // check if it was already selected, if so clean up the history/notes from the vars

    // Make api call to get the USER NOTES and (currently) the printer history elements belonging to the selected user

    // TODO not getting the _id for this user...

  }

  // HELPER FUNCTIONS FOR THE MAT DATA TAB

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    // console.log('checking if all rows are sleected');
    const numSelected = this.selection.selected.length;
    const numRows = this.userDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.userDataSource.data.forEach(row => this.selection.select(row));
  }

}
