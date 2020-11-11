import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

import { DeptInfo, PMessage, BuisnessHoursOverride, DeptOperatingHoursSchedule } from '../../../assets/interfaces';
import { environment } from '../../../environments/environment';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

// Construct the url to use to access the node.js API server
const BACKEND_URL = environment.apiUrl + "/department";

@Injectable({
  providedIn: 'root'
})
export class ManageDeptService {

  // The DeptInfo Objects from the DB
  private departments: DeptInfo[] = [];
  private departmentsUpdated = new Subject<DeptInfo[]>();

  private pMessages: PMessage[] = [];
  private deptServiceMessagesUpdated = new Subject<PMessage[]>();

  constructor(
    private http: HttpClient
  ) {}

  getDepartments(){
    // GETS ALL DEPARTMENTS IN THE DEPTINFOS COLLECTION
    this.http
      .get<{ message: PMessage, depts: DeptInfo[]}>(BACKEND_URL)
      .subscribe(resData => {
        console.log('!!! API !!! ManageDeptService::GET@/api/depts results:');
        console.log(resData);

        // Update the messages array
        this.pMessages = [];
        this.pMessages.push(resData.message);
        this.deptServiceMessagesUpdated.next([...this.pMessages]);

        // Update the departments array
        this.departments = [];
        this.departments = resData.depts;
        this.departmentsUpdated.next([...this.departments]);
      });
  }

  /*
    Update DeptInfo entry
    PUT@/api/department/:id
  */
  updateDepartment(newDeptInfoData:DeptInfo ) {
    console.log("ManageDeptService::updateDepartment() with data: ");
    console.log(newDeptInfoData);

    // !Enforce the times to make sure its a valid operating hours entry
    // Clear the pmessages for any new messages from the form submit
    // let validForm = true; // For tracking to get all the form errors before returning
    // this.pMessages = [];

    // const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    // // Loop through the 7 items that are each days operational hours
    // newDeptInfoData.buisnessHours.forEach((item, index) => {
    //   if(item.isOpen) {
    //     // The Department is open on this day
    //     console.log(days[index] + ' is open... checking hours');

    //     console.log('Open Hour: ' + item.openTime.getHours());
    //     console.log('Open Minutes: ' + item.openTime.getMinutes());
    //     console.log('Close Hour: ' + item.closeTime.getHours());
    //     console.log('Close Minutes: ' + item.closeTime.getMinutes());


    //     // If Closing time comes before Opening time
    //     if(item.openTime.getHours() > item.closeTime.getHours()) {
    //       console.log('... Open Hours come after Close Hours...');
    //       this.pMessages.push({
    //         severity: 'warn',
    //         summary: days[index] + ' Hours',
    //         detail: 'Cannot have open time later than closing time'
    //       });
    //       // No longer a valid form
    //       validForm = false;
    //     } else if (item.openTime.getHours() === item.closeTime.getHours()) {
    //       // The hour is the same, make sure that the minutes make sense

    //       // The times match exactly, hours and minutes wise
    //       if(item.openTime.getMinutes() === item.closeTime.getMinutes()) {
    //         console.log('open time matches hours and minutes with close time');
    //         this.pMessages.push({
    //           severity: 'info',
    //           summary: days[index] + ' is SEMI OPEN',
    //           detail: days[index] + ' is marked as open, but the open and close times are the same.'
    //         });
    //       } else if(item.openTime.getMinutes() > item.closeTime.getMinutes()) {
    //         // The Open minutes are later in the hour than the closing minutes

    //         // 1:45 --> 1:30, the minutes are not right
    //         console.log('same hour, openMinutes larger than closeMinutes...');
    //         this.pMessages.push({
    //           severity: 'warn',
    //           summary: days[index] + ' Hours',
    //           detail: 'Open Minutes comes after Close Minutes'
    //         });
  
    //         validForm = false;
    //       } else {
    //         // The open minutes are less than the clost minutes
            
    //         // And the close time comes after the open time minutes
    //         console.log('dept is open for less than an hour on monday...');
    //       }
    //     } // end of 
    //   } // end of isOpen
    // }); // end of for each loop


    // if(validForm) {

    //   this.http
    //     .put<{updatedDept: DeptInfo, message: PMessage}>(BACKEND_URL + '/' + newDeptInfoData.id, newDeptInfoData)
    //     .subscribe(results => {
    //       console.log('results from PUT@/api/departments/' + newDeptInfoData.id);
    //       console.log(results);

    //       // Update The Service departments array with the updated values
    //       const updatedNews = [...this.departments];
    //       // Find the old record index
    //       const oldNewsIndex = updatedNews.findIndex(n => n.id === results.updatedDept.id);
    //       // Replace the index with the updated one from API
    //       updatedNews[oldNewsIndex] = results.updatedDept;
    //       this.departments = updatedNews;
    //       this.departmentsUpdated.next([...this.departments]); // sending the correct dataset to all subscribers

          
    //       this.pMessages.push(results.message);
    //       this.deptServiceMessagesUpdated.next([...this.pMessages]);

    //     })


    // } else {
    //   // no http request if the form is not valid
    //   console.log('some operating hours times did not make sense, try again');
    //   this.pMessages.push({
    //     severity: 'error',
    //     summary: 'Update Department Failed',
    //     detail: 'Validate operational hours and try again'
    //   });
    //   this.deptServiceMessagesUpdated.next([...this.pMessages]);
    // }


  }

  /*
    On creating a new department,
      Just the name and the week long buisness hours are passed

      When override Hours need to be created, that will be part of a secondary panel/overridEHours input
  */
  createNewDepartment(newDeptName: string) {
    console.log('ManageDeptService::createNewDepartment with name: ' + newDeptName);

    let sendData = {
      newDeptName: newDeptName
    }

    this.http
      .post<{ newDept: DeptInfo, message: PMessage }>(BACKEND_URL, sendData)
      .subscribe(resData => {
        console.log('\nPOST@/api/deparment results:');
        console.log(resData);

        // If no error in response message, then continue
        if(resData.message.severity == 'error') {
          // Something bad happened, just update the messages      
          this.pMessages = [];    
          this.pMessages.push(resData.message);
          this.deptServiceMessagesUpdated.next([...this.pMessages]);

        } else {
          // there was no error, update the departments list AND the messages
          this.departments.push(resData.newDept);
          this.departmentsUpdated.next([...this.departments]);

          this.pMessages = [];
          this.pMessages.push(resData.message);
          this.deptServiceMessagesUpdated.next([...this.pMessages]);
        }

        // this.departments.push(resData.newDept);
        // this.departmentsUpdated.next([...this.departments]);

        // this.pMessages.push(resData.message);
        // this.deptServiceMessagesUpdated.next([...this.pMessages]);

      })


  }
 
  updateDepartmentName(updatedDeptName: string, deptId: string) {
    // Send put request to /api/department/deptname/:id with :id for dept, 
    // and body containing newDeptName entry 
    
    let submitObject ={
      newDeptName: updatedDeptName
    }

    this.http
      .put<{ updatedDept: DeptInfo, message: PMessage }>(BACKEND_URL + '/deptname/' + deptId, submitObject)
      .subscribe(resData => {
        console.log('Response from request to update dept name...');
        console.log(resData);

         // push the new pmessage
         this.pMessages = [];
         this.pMessages.push(resData.message);
         this.deptServiceMessagesUpdated.next([...this.pMessages]);
 
         // push the new updated dept
         const updatedDepartments = [...this.departments]; // make a copy
         const updatedDeptIndex = updatedDepartments.findIndex(n => n.id === resData.updatedDept.id); // get the index of the old
         updatedDepartments[updatedDeptIndex] = resData.updatedDept; // replace the old with the new
         this.departments = updatedDepartments;
         this.departmentsUpdated.next([...this.departments]);
      })
  }

  deleteDepartment(deleteDeptId: string) {
    console.log('ManageDeptsService::deleteDepartment() with id: ' + deleteDeptId);

    // DELETE@/api/department/:id
    this.http
      .delete<{message: PMessage}>(BACKEND_URL + '/' + deleteDeptId)
      .subscribe(resData => {
        console.log('Results from API deleteDepartment() call');
        console.log(resData);

        // If successful, remove from the local copy
        if(resData.message.severity == "success") {
          // Remove the local copy of the DeptInfo from the browser list
          const updatedDepartments = [...this.departments]; // copy of current depts
          const deletedDeptIndex = updatedDepartments.findIndex(n => n.id === deleteDeptId); // get index of deleted item
          updatedDepartments.splice(deletedDeptIndex, 1); // remove one item at deletedDeptIndex 
          this.departments = updatedDepartments; // update array with item removed
          this.departmentsUpdated.next([...this.departments]); // sending the correct dataset to all subscribers

          // Update the messages
          this.pMessages = [];
          this.pMessages.push(resData.message);
          this.deptServiceMessagesUpdated.next([...this.pMessages]);


        } else {
          // The request errored, just update the messages
          this.pMessages = [];
          this.pMessages.push(resData.message);
          this.deptServiceMessagesUpdated.next([...this.pMessages]);
        }

        // Update the pmessages
        

        

      })
  }



  /* ===========================================================================

    MANAGE WEEKLY SCHEDULES FOR DEPARTMENTS
      -- create new weekly schedule
      -- delete weekly schedule
      -- set the active schedule
      

  =========================================================================== */

  createNewWeeklySchedule(targetDeptId: string, newSchedule: any) {

    // Create the DeptOperatingHoursSchedule item here for post?
    console.log('ManageDeptService::createNewWeeklySchedule');
    console.log('for dept: ' + targetDeptId + ' with newSchedule of:');
    console.log(newSchedule);

    this.http
      .post<{newDept: DeptInfo, message: PMessage}>(BACKEND_URL + '/schedule/' + targetDeptId, newSchedule)
      .subscribe(resData => {
        console.log('response from createNewWeeklySchedule API call');
        console.log(resData);

        // push the new pmessage
        this.pMessages = [];
        this.pMessages.push(resData.message);
        this.deptServiceMessagesUpdated.next([...this.pMessages]);


        // TODO NEED TO MAKE SURE THAT THE SCHEDULE GETS ADDED!!

        // push the new updated dept
        const updatedDepartments = [...this.departments]; // make a copy
        const updatedDeptIndex = updatedDepartments.findIndex(n => n.id === resData.newDept.id); // get the index of the old
        updatedDepartments[updatedDeptIndex] = resData.newDept; // replace the old with the new
        this.departments = updatedDepartments;
        this.departmentsUpdated.next([...this.departments]);
      })
  }

  updateWeeklySchedule(targetDeptId: string, targetWeeklySchedule: string, updatedSchedule: any) {
    console.log('ManageDeptService::createNewWeeklySchedule');
    console.log('for dept: ' + targetDeptId + ' updating schedule ' + targetWeeklySchedule + ' newSchedule of:');
    console.log(updatedSchedule);

    this.http
      .put<{newDept: DeptInfo, message: PMessage}>(BACKEND_URL + '/schedule/' + targetDeptId + '/' + targetWeeklySchedule, updatedSchedule)
      .subscribe(resData => {
        console.log('response from createNewWeeklySchedule API call');
        console.log(resData);

        // push the new pmessage
        this.pMessages = [];
        this.pMessages.push(resData.message);
        this.deptServiceMessagesUpdated.next([...this.pMessages]);

        // push the new updated dept
        const updatedDepartments = [...this.departments]; // make a copy
        const updatedDeptIndex = updatedDepartments.findIndex(n => n.id === resData.newDept.id); // get the index of the old
        updatedDepartments[updatedDeptIndex] = resData.newDept; // replace the old with the new
        this.departments = updatedDepartments;
        this.departmentsUpdated.next([...this.departments]);
      })
  }

  setActiveWeeklySchedule(deptId: string, newCurrentSchedule: any) {

    // Make POST request to /api/schedule/active/:id/:activeId
    this.http
      .get<{updatedDept: DeptInfo, message: PMessage}>(BACKEND_URL + '/schedule/active/' + deptId + '/' + newCurrentSchedule)
      .subscribe(resData => {
        console.log('resData from /api/department/schedule/active/:id/:activeId');
        console.log(resData);

        // push the new pmessage
        this.pMessages = [];
        this.pMessages.push(resData.message);
        this.deptServiceMessagesUpdated.next([...this.pMessages]);

        // push the new updated dept
        const updatedDepartments = [...this.departments]; // make a copy
        const updatedDeptIndex = updatedDepartments.findIndex(n => n.id === resData.updatedDept.id); // get the index of the old
        updatedDepartments[updatedDeptIndex] = resData.updatedDept; // replace the old with the new
        this.departments = updatedDepartments;
        this.departmentsUpdated.next([...this.departments]);
        

      })

  }

  deleteWeeklySchedule(deptId: string, targetWeeklySchedule: string) {
    // Make a DELETE request to /api/department/schedule/:id/:scheduleId
    console.log('ManageDeptService::deleteWeeklySchedule()');

    this.http
      .delete<{updatedDept: DeptInfo, message: PMessage}>(BACKEND_URL + '/schedule/' + deptId + '/' + targetWeeklySchedule)
      .subscribe(resData => {
        console.log('resData from DELETE@/api/department/schedule/:id/:scheduleId');
        console.log(resData);

        // TODO push message and update dept schedule list
        if(resData.message) {
          this.pMessages = [];
          this.pMessages.push(resData.message);
          this.deptServiceMessagesUpdated.next([...this.pMessages]);
        }

        // push the new updated dept
        const updatedDepartments = [...this.departments]; // make a copy
        const updatedDeptIndex = updatedDepartments.findIndex(n => n.id === resData.updatedDept.id); // get the index of the old
        updatedDepartments[updatedDeptIndex] = resData.updatedDept; // replace the old with the new
        this.departments = updatedDepartments;
        this.departmentsUpdated.next([...this.departments]);


      })
  }






  createNewHourOverrideRule(deptInfoId: string, newOverrideRule: any) {
    console.log('Creating New Hour Override Rule for dept: ' + deptInfoId );
    console.log(newOverrideRule);

    // POST@/api/department/overrideRule/:id
    this.http
      .post<{updatedDept: DeptInfo ,message: PMessage}>(BACKEND_URL+'/overrideRule/' + deptInfoId, newOverrideRule)
      .subscribe(resData => {
        console.log('resData from post@/api/department/overrideRule/:id');
        console.log(resData);

        // Update the departments array entry with the updated version
        console.log(this.departments);

        const updatedDepartments = [...this.departments]; // make a copy
        const updatedDeptIndex = updatedDepartments.findIndex(n => n.id === resData.updatedDept.id); // get the index of the old
        updatedDepartments[updatedDeptIndex] = resData.updatedDept; // replace the old with the new
        this.departments = updatedDepartments;
        this.departmentsUpdated.next([...this.departments]);

        // Update the message service with the return message
        this.pMessages.push(resData.message);
        this.deptServiceMessagesUpdated.next([...this.pMessages]);
      });
  }

  updateOverrideRule(deptInfoId: string, overrideRuleId: string, newOverrideRule: any) {
    console.log('ManageDeptService::updateOverrideRule with args:');
    console.log(deptInfoId);
    console.log(newOverrideRule);

    // POST@/api/department/overrideRule/:id
    this.http
      .put<{updatedDept: DeptInfo ,message: PMessage}>(BACKEND_URL+'/overrideRule/' + deptInfoId + '/' + overrideRuleId, newOverrideRule)
      .subscribe(resData => {
        console.log('resData from put@/api/department/overrideRule/:id');
        console.log(resData);

        // Update the departments array entry with the updated version
        console.log(this.departments);

        const updatedDepartments = [...this.departments]; // make a copy
        const updatedDeptIndex = updatedDepartments.findIndex(n => n.id === resData.updatedDept.id); // get the index of the old
        updatedDepartments[updatedDeptIndex] = resData.updatedDept; // replace the old with the new
        this.departments = updatedDepartments;
        this.departmentsUpdated.next([...this.departments]);

        // Update the message service with the return message
        this.pMessages.push(resData.message);
        this.deptServiceMessagesUpdated.next([...this.pMessages]);

      });
    
  }

  deleteOverrideRule(deptInfoId: string, overrideRuleId: string) {
    console.log('ManageDeptService::deleteOverrideRule()');
    console.log(overrideRuleId);

    // DELETE@/api/department/overrideRule/:id
    this.http
      .delete<{updatedDept: DeptInfo, message: PMessage}>(BACKEND_URL + '/overrideRule/' + deptInfoId + '/' + overrideRuleId )
      .subscribe(resData => {
        console.log('response from DELET@/api/department/overrideRule/:id');
        console.log(resData);

        // Update the existing dept with the updated stuff
        const updatedDepartments = [...this.departments]; // make a copy
        const updatedDeptIndex = updatedDepartments.findIndex(n => n.id === resData.updatedDept.id); // get the index of the old
        updatedDepartments[updatedDeptIndex] = resData.updatedDept; // replace the old with the new

        this.departments = updatedDepartments;
        this.departmentsUpdated.next([...this.departments]);
        // Update message service
        // Update the message service with the return message
        this.pMessages.push(resData.message);
        this.deptServiceMessagesUpdated.next([...this.pMessages]);
      })
  }




  


  getDepartmentsUpdatedListener() {
    return this.departmentsUpdated.asObservable();
  }

  getMessagesUpdatedListener() {
    return this.deptServiceMessagesUpdated.asObservable();
  }
}
