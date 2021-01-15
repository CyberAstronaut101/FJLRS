import { Component, OnInit } from '@angular/core';

// For shared confirmation-dialog component
import { MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { NewDeptInfoDialogComponent } from 'src/app/shared-components/new-dept-info-dialog/new-dept-info-dialog.component';
import { MessageService, Message, TreeNode } from 'primeng/api';
import { ManageDeptService } from './manage-depts.service';
import { Subscription } from 'rxjs';

import { NgForm } from '@angular/forms';

import { DeptInfo, PMessage, BuisnessHoursOverride, DeptOperatingHoursSchedule, DeptOperatingHoursOverride } from '../../../assets/interfaces';

import { Moment } from 'moment';
import { ConfirmationDialogComponent } from 'src/app/shared-components/confirmation-dialog/confirmation-dialog.component';
import { PrinterlabService } from 'src/app/printerlab/printerlab.service';
import { Tree } from 'primeng/tree';



@Component({
  selector: 'app-manage-depts',
  templateUrl: './manage-depts.component.html',
  styleUrls: ['./manage-depts.component.css'],
  providers: [MessageService]
})
export class ManageDeptsComponent implements OnInit {

  /* =========================================

    When the Manage Departments panel first renders,

    there will be a list of the deparments that are in the DeptInfo Collection

    The right side will be empty, unless you want to interact with a department

  ..... TODO continue this description .....

  ===========================================*/

  isLoading = false;

  // PrimeNG p-messages
  msgs: Message[] = [];
  private messagesUpdatedSub: Subscription;

  // List of departments and subscription to new values
  deptInfo: DeptInfo[] = [];
  private deptInfoUpdatedSub: Subscription;


  public weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Every Day'];
  


  constructor(
    private deptService: ManageDeptService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    this.deptService.getDepartments();  // Makes request to populate DeptInfo[] 
    
    // Setup Update Subscriptions
    // TODO need to make this just update and rerender what is needed....?
    this.deptInfoUpdatedSub = this.deptService.getDepartmentsUpdatedListener()
      .subscribe((newDeptInfo: DeptInfo[]) => {
        console.log('ManageDeptComponent::deptInfoUpdatedSub updated with new values --->');
        console.log(newDeptInfo);

        // Clear the modify panel
        this.showCreateNewDepartmentForm = false;
        this.showModifyPanel = false;

        // Clear any schedules that were loaded to be edited
        this.showWeeklySchedulePanel = false;
        this.weeklyScheduleSubmitMode = 'create';
        // Clear the variables in the form?



        // Prepares the buisnessHours panel to default values
        this.onResetWeeklyScheduleForm();

        // Prepares the buisnessHoursOverride panle to have default values
        // this.onShowCreateNewOverrideCard();
        
        // Then hide the panel
        // this.clearModifyPanel();

        this.deptInfo = [];
        this.deptInfo = newDeptInfo;

        let deptInfoUpdatedMessage = {
          severity: 'success',
          summary: 'DeptInfo Subscription updated!',
          detail: 'New DeptInfo data'
        };

        // this.messageService.clear();
        this.messageService.add(deptInfoUpdatedMessage);

      });



    // Setup PMessages Subscription
    this.messagesUpdatedSub = this.deptService.getMessagesUpdatedListener()
      .subscribe((newPMessages: any[]) => {
        console.log('new pmessages from manage-depts component...');
        console.log(newPMessages);

        this.messageService.clear();
        newPMessages.forEach(elem => {
          this.messageService.add(elem);
        });
        // this.messageService.addAll(newPMessages);
      });



    this.isLoading = false; // Removes the loading animation after componenet has been initialized
  }


  /*=================================================================================
    ___  ______________ _____________   __ ______  ___   _   _  _____ _ 
    |  \/  |  _  |  _  \_   _|  ___\ \ / / | ___ \/ _ \ | \ | ||  ___| |
    | .  . | | | | | | | | | | |_   \ V /  | |_/ / /_\ \|  \| || |__ | |
    | |\/| | | | | | | | | | |  _|   \ /   |  __/|  _  || . ` ||  __|| |
    | |  | \ \_/ / |/ / _| |_| |     | |   | |   | | | || |\  || |___| |____
    \_|  |_/\___/|___/  \___/\_|     \_/   \_|   \_| |_/\_| \_/\____/\_____/

    MODIFY PANEL

  =================================================================================*/

  showModifyPanel = false; // Render control for show department modify panel
  
  // Whenever a department is loaded into the modify panel, these variables are updated to 
  // Represent the item
  deptModifyItem: DeptInfo; // Holds the department object that is currently being edited
  currentOperatingScheduleName: string; // holds the string name of the reference to the current active operating schedule
  deptOperatingHoursSchedules: DeptOperatingHoursSchedule[];  // Holds list of operatingHoursSchedules
  deptOperatingHoursOverrides: DeptOperatingHoursOverride[];  // SAVED OPERATING HOURS OVERRIDES

  // Initial variable names...
  modifyPanelDeptIndex: number;       // Holds the index of current deptInfo in the deptInfo array
  modifyPanelDeptInfo: DeptInfo;  // Holds the values of the current deptInfo, if modifying existing dept
  modifyPanelDeptId: string;

  // TREE ELEMENTS FOR SAVED WEEKLY SCHEDULES
  expandingTree: Tree; // Root of department schedules tree
  departmentSchedulesTree: TreeNode[]; // Holds the list of schedule items
  departmentScheduleSelectedItem: TreeNode;

  // TREE ELEMENTS FOR SAVED BUISNESS HOUR OVERRIDES
  departmentOverridesTree: TreeNode[]; // Holdes the list of overrides for the selected department modify item
  departmentOverridesSelectedItem: TreeNode; // Holds the item that was selected from tree

  /*=================================================================================
    ______ ___________  ___  ______ ________  ___ _____ _   _ _____ 
    |  _  \  ___| ___ \/ _ \ | ___ \_   _|  \/  ||  ___| \ | |_   _|
    | | | | |__ | |_/ / /_\ \| |_/ / | | | .  . || |__ |  \| | | |
    | | | |  __||  __/|  _  ||    /  | | | |\/| ||  __|| . ` | | |
    | |/ /| |___| |   | | | || |\ \  | | | |  | || |___| |\  | | |
    |___/ \____/\_|   \_| |_/\_| \_| \_/ \_|  |_/\____/\_| \_/ \_/

    DEPARTMENT
  =================================================================================*/

  showCreateNewDepartmentForm = false; // Control for 'new department' form visibility


  onDeleteDepartment() {
    console.log('! Delete Department id: ');
    console.log(this.modifyPanelDeptId);

    // Prompt with confirm dialog
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete the ' + this.modifyPanelDeptInfo.deptName + ' department?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        console.log(result);

        // send current modify panel dept id as id in delete request
        this.deptService.deleteDepartment(this.modifyPanelDeptId);
        // Start the password reset workflow
        // this.userService.startPasswordResetWorkflow(result.data); // result is the email input from popup form
      }
    });

    // on yes, make delete service request
    // if no, do nothing
  }

  // Shows the new department form 
  onShowCreateNewDepartment() {
    // Set the show modify panel to false?
    this.showModifyPanel = false
    this.showCreateNewDepartmentForm = true;
  }

  // On Creating a new Department
  onCreateNewDepartment(form: NgForm) {
    console.log('onCreateNewDepartment(' + form.value.newDeptName + ')');
    // Only item in the form is the name of the new department
    this.deptService.createNewDepartment(form.value.newDeptName);
    // Reset the form input fields
    form.resetForm();
    // hide the form panel
    this.showCreateNewDepartmentForm = false;
  }

  // On Updating the department Name
  onUpdateDepartmentName(form: NgForm) {
    console.log('Updating Department name from ' + this.deptModifyItem.deptName + ' to: ' + form.value.scheduleFormName);
    console.log(this.deptModifyItem);
    console.log(form.value.scheduleFormName);


    // MAKE SURE THE FORM ACTUALLY HAS A VALUE
    if (form.invalid) {
      // Error in the form, not submitting
      this.messageService.clear();
      this.messageService.add({
        severity: 'warn',
        detail: 'Department Name Update Form Invalid',
        summary: 'not able to update department name'
      });
      return;
    }


    // form.value.scheduleFormName
    if (this.deptModifyItem.deptName !== form.value.scheduleFormName) {
      console.log('names are different...submitting');

      console.log(form.value.scheduleFormName);
      console.log(this.deptModifyItem.id);
      this.deptService.updateDepartmentName(form.value.scheduleFormName, this.deptModifyItem.id);

      // Reset the form AFTER you make the service call dumpass
      form.resetForm();
      // Call the department Service here
    } else {
      // The names are the same
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        detail: 'New Department Name Same as OLD!',
        summary: 'If you want to update the department name, choose a different name'
      });
      return;
    }
    // Check if the submitted name is different than this.deptModifyItem.deptName





    // Only make the request to update the department name if it is different that what is currently set



  }


  /* ============================================================

    Method that is called when user wants to edit a department
      - Enable the edit panel
      - Load the DB .id into local variable

  ============================================================*/
  onShowModifyPanel(modifyDeptId: string) {
    this.isLoading = true;                    // Start the loading animation
    this.showCreateNewDepartmentForm = false; // hides if user hit create dept before edit
    this.showModifyPanel = true;              // Shows the Right Hand Modify Panel

    console.log('Loading Dept ' + modifyDeptId + ' to modifyPanel...');

    // Get the index in the DeptInfo Array using the modifyDeptId to find it
    let editDeptIndex = this.deptInfo.findIndex(n => n.id === modifyDeptId);

    // Save the DeptInfo object to local variable
    this.deptModifyItem = this.deptInfo[editDeptIndex];

    // Load the DeptInfo fields into the local list variables
    this.deptOperatingHoursSchedules = this.deptInfo[editDeptIndex].operatingHoursSchedules;
    this.deptOperatingHoursOverrides = this.deptInfo[editDeptIndex].operatingHoursOverrides;

    // console.log(this.deptOperatingHoursOverrides);

    // Get the name of the current operating schedule
    let currentScheduleIndex = this.deptInfo[editDeptIndex].operatingHoursSchedules.findIndex(n => n.id == this.deptInfo[editDeptIndex].currentOperatingSchedule);
    console.log(currentScheduleIndex);
    if (currentScheduleIndex === -1 ) {
      this.currentOperatingScheduleName = "No Current Active Schedule Found...";
    } else {
      this.currentOperatingScheduleName = this.deptInfo[editDeptIndex].operatingHoursSchedules[currentScheduleIndex].scheduleName;
    }

    // Only runs this if there is a schedule
    // Propogate the P-Tree TreeNodes with the operatingHours schedules
    this.departmentSchedulesTree = []; // Clear the existing tree
    // Push new tree elements (schedules) into the p-tree
    this.deptOperatingHoursSchedules.forEach(item => {
      this.departmentSchedulesTree.push({
        label: item.scheduleName,
        data: item.id,
        icon: "pi pi-bars"
      })
    });

    // Propogate the buisness hours overrides rules tree
    this.departmentOverridesTree = []; // Clear the existing tree
    // Loop through and load the array with the overrides rules
    this.deptOperatingHoursOverrides.forEach(item => {
      this.departmentOverridesTree.push({
        label: item.overrideReason,
        data: item.id,
        icon: "pi pi-bars"
      });
    });

    // Load that index as the modifyDeptInfo
    this.modifyPanelDeptInfo = this.deptInfo[editDeptIndex];
    this.modifyPanelDeptIndex = editDeptIndex;
    this.modifyPanelDeptId = this.deptInfo[editDeptIndex].id;

    // Make a copy of the current values to the variables in the form


    console.log(this.modifyPanelDeptInfo);




    // this.deptFormName = this.modifyPanelDeptInfo.deptName;
 
    this.isLoading = false;

  }


  /*
      METHODS FOR THE p-tree holding the weekly schedules
  */
 

/*=================================================================================
 _    _           _    _         _____      _              _       _      
| |  | |         | |  | |       /  ___|    | |            | |     | |     
| |  | | ___  ___| | _| |_   _  \ `--.  ___| |__   ___  __| |_   _| | ___ 
| |/\| |/ _ \/ _ \ |/ / | | | |  `--. \/ __| '_ \ / _ \/ _` | | | | |/ _ \
\  /\  /  __/  __/   <| | |_| | /\__/ / (__| | | |  __/ (_| | |_| | |  __/
 \/  \/ \___|\___|_|\_\_|\__, | \____/ \___|_| |_|\___|\__,_|\__,_|_|\___|
                          __/ |                                           
                         |___/                                            
=================================================================================*/

showWeeklySchedulePanel = false;            // Render controller for show the modify panel
  weeklyScheduleSubmitMode = 'create';        // Controller for what service func is called

public scheduleFormName: string;  // Name of the weekly schedule currently in the editor
public scheduleFormId: string; // uid of the schedule object currently in the editor

// Variables for use in the OpearingHoursSchedule form fields
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


  onRenderNewWeeklySchedule(form: NgForm) {
    console.log('Rendering panel to create new weekly schedule')

    this.onResetWeeklyScheduleForm(); // Resets the form to default values

    // Set control to show the weekly schedule form
    this.showWeeklySchedulePanel = true;    
  }

  onHideWeeklySchedulePanel(form: NgForm) {
    console.log('Hiding schedule modify panel..');
    this.weeklyScheduleSubmitMode = 'create';
    this.showWeeklySchedulePanel = false;

    // Clear the form values
    form.resetForm();

  }

  onSubmitWeeklySchedulePanel(form: NgForm) {
    console.log('Submit button pressed for weekly schedule form...');

    if(form.invalid) {
      console.log('Form for saving new schedule is invalid...');
      this.messageService.clear();
      this.messageService.add({
        severity: 'warn',
        detail: 'Schedule form is invalid',
        summary: 'something on the form is throwing invalid state...'
      });
      return;
    }

    // If the new weekyl schedule is valid....
    console.log('Saving new weekly Schedule with values:');

    // Convert the form values into a DeptOperatingHoursSchedule item



    if(this.weeklyScheduleSubmitMode == 'create') {
      // SEND A POST REQUEST TO CREATE A NEW SCHEDULE FOR THE DEPT

      // Create the DeptOperatingHoursSchedule object
      let newOperatingHoursSchedule = {
        scheduleIdentifier: form.value.scheduleFormName,
        buisnessHours: [
          {
            dayOfWeek: 0,
            isOpen: form.value.mondayStatus,
            openTime: form.value.mondayOpenTime,
            closeTime: form.value.mondayCloseTime
          },
          {
            dayOfWeek: 1,
            isOpen: form.value.tuesdayStatus,
            openTime: form.value.tuesdayOpenTime,
            closeTime: form.value.tuesdayCloseTime
          },
          {
            dayOfWeek: 2,
            isOpen: form.value.wednesdayStatus,
            openTime: form.value.wednesdayOpenTime,
            closeTime: form.value.wednesdayCloseTime
          },
          {
            dayOfWeek: 3,
            isOpen: form.value.thursdayStatus,
            openTime: form.value.thursdayOpenTime,
            closeTime: form.value.thursdayCloseTime
          },
          {
            dayOfWeek: 4,
            isOpen: form.value.fridayStatus,
            openTime: form.value.fridayOpenTime,
            closeTime: form.value.fridayCloseTime
          },
          {
            dayOfWeek: 5,
            isOpen: form.value.saturdayStatus,
            openTime: form.value.saturdayOpenTime,
            closeTime: form.value.saturdayCloseTime
          },
          {
            dayOfWeek: 6,
            isOpen: form.value.sundayStatus,
            openTime: form.value.sundayOpenTime,
            closeTime: form.value.sundayCloseTime
          }
        ]

      }

      console.log(newOperatingHoursSchedule);

      this.deptService.createNewWeeklySchedule(this.deptModifyItem.id, newOperatingHoursSchedule);
      
    } else if (this.weeklyScheduleSubmitMode == 'edit') {
      // SENDS A PUT REQUREST TO UPDATE EXISTING SCHEDULE

      let newOperatingHoursSchedule = {
        scheduleName: form.value.scheduleFormName,
        buisnessHours: [
          {
            dayOfWeek: 0,
            isOpen: form.value.mondayStatus,
            openTime: form.value.mondayOpenTime,
            closeTime: form.value.mondayCloseTime
          },
          {
            dayOfWeek: 1,
            isOpen: form.value.tuesdayStatus,
            openTime: form.value.tuesdayOpenTime,
            closeTime: form.value.tuesdayCloseTime
          },
          {
            dayOfWeek: 2,
            isOpen: form.value.wednesdayStatus,
            openTime: form.value.wednesdayOpenTime,
            closeTime: form.value.wednesdayCloseTime
          },
          {
            dayOfWeek: 3,
            isOpen: form.value.thursdayStatus,
            openTime: form.value.thursdayOpenTime,
            closeTime: form.value.thursdayCloseTime
          },
          {
            dayOfWeek: 4,
            isOpen: form.value.fridayStatus,
            openTime: form.value.fridayOpenTime,
            closeTime: form.value.fridayCloseTime
          },
          {
            dayOfWeek: 5,
            isOpen: form.value.saturdayStatus,
            openTime: form.value.saturdayOpenTime,
            closeTime: form.value.saturdayCloseTime
          },
          {
            dayOfWeek: 6,
            isOpen: form.value.sundayStatus,
            openTime: form.value.sundayOpenTime,
            closeTime: form.value.sundayCloseTime
          }
        ]

      }

      console.log(newOperatingHoursSchedule);

      this.deptService.updateWeeklySchedule(this.deptModifyItem.id, this.scheduleFormId, newOperatingHoursSchedule);
    }

  }

  applyScheduleAsCurrent() {
    // Update the current edit dept currentOperatingSchedule to the current edit schedule item
    console.log('Setting as ' + this.scheduleFormId +' as the active schedule for dept ' + this.modifyPanelDeptId);
    this.deptService.setActiveWeeklySchedule(this.modifyPanelDeptId, this.scheduleFormId);
  }

  onDeleteWeeklySchedule() {
    console.log('Deleting weekly schedule ' + this.scheduleFormId + ' for dept ' + this.deptModifyItem.id);
    // Deletes the current schedule in the modify panel
    // If the 
    // Sends the department id and the operatingHoursSchedule id
    this.deptService.deleteWeeklySchedule(this.deptModifyItem.id, this.scheduleFormId);
  }

  /*
    Render the ModifyPanel for a new Dept creation
  */
  onResetWeeklyScheduleForm() {
    // Set Render Variable to true
    // this.showModifyPanel = true;
    
    // Show the weekly schedule panel
    this.showWeeklySchedulePanel = false;

    // Set variable for creating new Dept
    this.weeklyScheduleSubmitMode = 'create';
    // Clear the weekly schedule name
    this.scheduleFormName = "";

    // Since this is a new entry, values do not need to be loaded into the binded variables on the form
    const defaultOpenTime = new Date();
    defaultOpenTime.setHours(9);
    const defaultCloseTime = new Date();
    defaultCloseTime.setHours(22);

    // console.log('Default open time: ' + defaultOpenTime);
    // console.log('Default close time: ' + defaultCloseTime);

    // Set all of the opening times
    this.mondayOpenTime = defaultOpenTime;
    this.tuesdayOpenTime = defaultOpenTime;
    this.wednesdayOpenTime = defaultOpenTime;
    this.thursdayOpenTime = defaultOpenTime;
    this.fridayOpenTime = defaultOpenTime;
    this.saturdayOpenTime = defaultOpenTime;
    this.sundayOpenTime = defaultOpenTime;
    // Set all of the closing times
    this.mondayCloseTime = defaultCloseTime;
    this.tuesdayCloseTime = defaultCloseTime;
    this.wednesdayCloseTime = defaultCloseTime;
    this.thursdayCloseTime = defaultCloseTime;
    this.fridayCloseTime = defaultCloseTime;
    this.saturdayCloseTime = defaultCloseTime;
    this.sundayCloseTime = defaultCloseTime;
    // Set all of the isOpen status to false
    this.mondayOpenStatus = false;
    this.tuesdayOpenStatus = false;
    this.wednesdayOpenStatus = false;
    this.thursdayOpenStatus = false;
    this.fridayOpenStatus = false;
    this.saturdayOpenStatus = false;
    this.sundayOpenStatus = false;
    // Set the name to nothing
  }

  // On Selection of schedule in the p-tree for operatingHoursSchedules
  onScheduleNodeSelect(event) {
    console.log("Node item selected");
    console.log(event);

    // Load the selected node item into 
    let index = this.deptOperatingHoursSchedules.findIndex(n => n.id == event.node.data);

    // Load the items at the index into the schedule form field variables
    this.scheduleFormName = this.deptOperatingHoursSchedules[index].scheduleName;
    this.scheduleFormId = this.deptOperatingHoursSchedules[index].id;

    this.mondayOpenStatus = this.deptOperatingHoursSchedules[index].buisnessHours[0].isOpen;
    this.mondayOpenTime = new Date(this.deptOperatingHoursSchedules[index].buisnessHours[0].openTime);
    this.mondayCloseTime = new Date(this.deptOperatingHoursSchedules[index].buisnessHours[0].closeTime);

    this.tuesdayOpenStatus = this.deptOperatingHoursSchedules[index].buisnessHours[1].isOpen;
    this.tuesdayOpenTime = new Date(this.deptOperatingHoursSchedules[index].buisnessHours[1].openTime);
    this.tuesdayCloseTime = new Date(this.deptOperatingHoursSchedules[index].buisnessHours[1].closeTime);

    this.wednesdayOpenStatus = this.deptOperatingHoursSchedules[index].buisnessHours[2].isOpen;
    this.wednesdayOpenTime = new Date(this.deptOperatingHoursSchedules[index].buisnessHours[2].openTime);
    this.wednesdayCloseTime = new Date(this.deptOperatingHoursSchedules[index].buisnessHours[2].closeTime);

    this.thursdayOpenStatus = this.deptOperatingHoursSchedules[index].buisnessHours[3].isOpen;
    this.thursdayOpenTime = new Date(this.deptOperatingHoursSchedules[index].buisnessHours[3].openTime);
    this.thursdayCloseTime = new Date(this.deptOperatingHoursSchedules[index].buisnessHours[3].closeTime);

    this.fridayOpenStatus = this.deptOperatingHoursSchedules[index].buisnessHours[4].isOpen;
    this.fridayOpenTime = new Date(this.deptOperatingHoursSchedules[index].buisnessHours[4].openTime);
    this.fridayCloseTime = new Date(this.deptOperatingHoursSchedules[index].buisnessHours[4].closeTime);

    this.saturdayOpenStatus = this.deptOperatingHoursSchedules[index].buisnessHours[5].isOpen;
    this.saturdayOpenTime = new Date(this.deptOperatingHoursSchedules[index].buisnessHours[5].openTime);
    this.saturdayCloseTime = new Date(this.deptOperatingHoursSchedules[index].buisnessHours[5].closeTime);

    this.sundayOpenStatus = this.deptOperatingHoursSchedules[index].buisnessHours[6].isOpen;
    this.sundayOpenTime = new Date(this.deptOperatingHoursSchedules[index].buisnessHours[6].openTime);
    this.sundayCloseTime = new Date(this.deptOperatingHoursSchedules[index].buisnessHours[6].closeTime);

    // Shows the edit panel
    this.weeklyScheduleSubmitMode = 'edit'; // Sets action on save button to create new schedule
    this.showWeeklySchedulePanel = true;

  }

  // On Unselection of schedule in the p-tree for operatingHoursSchedules
  onScheduleNodeUnselect(event) {
    // Clear the 
    
    // Hide the weekly schedule panel
    this.showWeeklySchedulePanel = false;

    // TODO clear the variables used in the form
  }



/*=================================================================================
     _____  _   _ _________________ ___________ _____ _____ 
    |  _  || | | |  ___| ___ \ ___ \_   _|  _  \  ___/  ___|
    | | | || | | | |__ | |_/ / |_/ / | | | | | | |__ \ `--. 
    | | | || | | |  __||    /|    /  | | | | | |  __| `--. \
    \ \_/ /\ \_/ / |___| |\ \| |\ \ _| |_| |/ /| |___/\__/ /
     \___/  \___/\____/\_| \_\_| \_|\___/|___/ \____/\____/
=================================================================================*/

  // TODO NEED TO PICKUP HERE AND POLISH UP
  //-----MANAGE BUISNESS HOURS OVERRIDES CONTROLS
  showEditOverrides = false; // controls if the modify panel is shown
  editOverrideMode = false; // default to create new override panel rendering
  editOverridesId: string = ''; // ID of the override rule being edited
  currentOverrideEdit: BuisnessHoursOverride;

  // Variables for the buisness hours override form
  public buisnessHoursOverrideReason: string;
  public rangeDates: Date[];
  public overrideStartDate: Date;
  public overrideEndDate: Date;
  public dayOfWeek: number;
  public altOpenTime: Date;
  public altCloseTime: Date;
  public isOpen: boolean;


  onSaveOverrideRule(form: NgForm) {
    console.log('Saving New Buisness Hours Override with form:');
    console.log(form.value);

    // ID of the override rule
    // this.editOverridesId

    // Create the new buisnessHoursOverrides rule
    const overrideRule = {
      overrideReason: form.value.buisnessHoursOverrideReason,
      overrideStartDate: form.value.overrideStartDate,
      overrideEndDate: form.value.overrideEndDate,
      dayOfWeek: form.value.dayOfWeek,
      altOpenTime: form.value.altOpenTime,
      altCloseTime: form.value.altCloseTime,
      isOpen: form.value.isOpen
    };

    console.log('Object being submitted: ');
    console.log(overrideRule);

    // Check if this is modifying a rule, or creating a new rule
    if(this.editOverrideMode) {
      // Updating the rule requires deptId, , and the updated rule
      this.deptService.updateOverrideRule(this.modifyPanelDeptId, this.editOverridesId, overrideRule);
    } else {
      // Creating a new rule only requires the department id and the new rule
      this.deptService.createNewHourOverrideRule(this.modifyPanelDeptId, overrideRule);
    }

    // Reset the form values
    // form.resetForm(); //NOPE, NEED TO MANUALLY SET THESE 

  }

  onLoadOverrideForEdit(overrideRule: BuisnessHoursOverride) {
    console.log('Loading Override rule for edit...');
    console.log(overrideRule);

    this.onShowEditOverrideCard(); // set the edit view to true, editOverrideMode true
    // Current department being modified is modifyPanelDeptInfoId
    // const overrideIndex = this.modifyPanelDeptInfo.buisnessHoursOverrides.findIndex(n => n.id === overrideRuleId);
    // const buisnessOverrideToEdit = this.modifyPanelDeptInfo.buisnessHoursOverrides[overrideIndex];
    // this.currentOverrideEdit = buisnessOverrideToEdit; // saving the component var

    // Variables for the buisness hours override form
    this.buisnessHoursOverrideReason = overrideRule.overrideReason;
    this.overrideStartDate = new Date(overrideRule.overrideStartDate);
    this.overrideEndDate = new Date(overrideRule.overrideEndDate);
    this.dayOfWeek = overrideRule.dayOfWeek;
    this.altOpenTime = new Date(overrideRule.altOpenTime);
    this.altCloseTime = new Date(overrideRule.altCloseTime);
    this.isOpen = overrideRule.isOpen;


  }

  onRemoveOverrideRule(overrideRuleId: string){
    console.log('onRemoveOverrideRule()');
    console.log(overrideRuleId);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this BuisnessHoursOverride rule?'
      });

        dialogRef.afterClosed().subscribe(result => {
        if (result) {
            console.log('Yes clicked');
            console.log(result);
            
            this.deptService.deleteOverrideRule(this.modifyPanelDeptId, overrideRuleId);

        }
      });
    

  }

  // Load the BuisnessHoursOverride Form as a new entry
  onShowCreateNewOverrideCard() {
    console.log('Rendering showEditOverrideCard in create mode');
    this.showEditOverrides = true; // Show the mat-card holding the form
    this.editOverrideMode = false;
    // Set initial values in form
    this.buisnessHoursOverrideReason = '';
    this.dayOfWeek = 7;
    this.overrideStartDate = new Date();
    this.overrideEndDate = new Date();
    this.altOpenTime = new Date();
    this.altCloseTime = new Date();
  }

  // Load the BuisnessHoursOverride Form as a new entry
  onShowEditOverrideCard() {
    console.log('Rendering showEditOverrideCard in edit mode');
    this.showEditOverrides = true; // Show the mat-card holding the form
    this.editOverrideMode = true; // set it to render the verbage for editing
    // Set initial values in form

  }

  onCloseEditOverrideCard() {
    console.log('nevermind button clicked, hiding the edit override card');
    this.showEditOverrides = false;
  }

  onOverrideNodeSelect(event) {
    console.log('Override Hour Rule node selected...');
    // console.log(event);

    // Get index of the override rule 
    let index = this.deptOperatingHoursOverrides.findIndex(n => n.id == event.node.data);

    // Variable holding the ID of the entry
    this.editOverridesId = this.deptOperatingHoursOverrides[index].id; // The ID of the override entry

    // Variables For the Form
    this.buisnessHoursOverrideReason = this.deptOperatingHoursOverrides[index].overrideReason;
    this.overrideStartDate = new Date(this.deptOperatingHoursOverrides[index].overrideStartDate);
    this.overrideEndDate = new Date(this.deptOperatingHoursOverrides[index].overrideEndDate);
    this.dayOfWeek = this.deptOperatingHoursOverrides[index].dayOfWeek;
    console.log('Day Of Week: ' + this.dayOfWeek);
    this.altOpenTime = new Date(this.deptOperatingHoursOverrides[index].altOpenTime);
    this.altCloseTime = new Date(this.deptOperatingHoursOverrides[index].altCloseTime);
    this.isOpen = this.deptOperatingHoursOverrides[index].isOpen;

    // Render controls and submit mode 
    this.showEditOverrides = true; // Render the override rule form
    this.editOverrideMode = true; // Set the submit mode to 'edit mode' aka update

  }

  onOverrideNodeUnselect(event) {
    console.log('Override Hour Rule node unselected...');

    // Clear the variables

    // Derender the panel
  }



  /*
    Called when 'Discard Changes' button is clicked when modifyPanel is rendered
  */
  onDiscardModifyPanel() {
    // Derender the modifyPanel and disregard changes
    this.showModifyPanel = false;
  }


  



}
