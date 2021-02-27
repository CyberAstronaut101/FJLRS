/*==================================================================================
====================================================================================

    MASTER INTERFACES FILE

    Unlike the wild west of JS, TypeScript has the ability to enforce TYPES in variables.

    This file specifically holds interfaces that can be imported in .ts files and 
    should be used to ensure that the data that is being recieved from the API
    is full and correct.

    For instance, if we get something back from the API that should have the structure
    of the  User interface, but is missing a few files, the type checking will fail 
    and setting the incoming data to a variable will throw errors because the incoming
    data does not look like it is expecting.

    IN general, if there exists a DB schema, there should be an interface that matches
    the fields exactly (unless before returning data to the client the API sanatizes the fields)


    NOTE FOR CAPSTONE PROJECT

    Most of these interfaces can be nuked, but we should have a process in place to 
    first refactor the code before removing references here because the angular 
    app will start throwing a fit curing compiling.

====================================================================================
====================================================================================*/


export interface Socket {
    on(event: string, callback: (data: any) => void );
    emit(event: string, data: any);
}


export interface Material {
    matId: string,
    name: string
}

/*==================================================================================

    Interfaces for 3D Printer Print queues

==================================================================================*/
export interface sanatizedUser {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
}

export interface User {
    id: string,
    firstname: string;
    lastname: string;
    studentID: number;
    phone: string;
    email: string;
    userLevel: string;
    laserInUse: Boolean;
    laserLab01: Boolean;
    laserLab02: Boolean;
    woodShop01: Boolean;
    woodShop02: Boolean;
    woodShop03: Boolean;
    plotters: Boolean;
    projectors: Boolean
}

export interface MachineHistoryAndUsers {
    machineId: string;
    machineName: string;
    currentJobId: string;
    history: [ {
        firstName: string;
        lastName: string;
        jobOwner: string;
        jobName: string;
        printHours: number;
        printMinutes: number;
        timeStarted: string;
        timeEnded: string
    }]
}

export interface PrintQueueItem {
    id: string;
    description: string;
    fileId: string;
    materialId: string;
    createdAt: Date;
    submittedBy: string;
}

export interface MachineList {
    id: string;
    machineName: string;
    currentJobId: string; // ID of the printQueueItem
}

export interface PMessage {
    severity: string;
    summary: string;
    detail: string
}

/*
    For use on rendering the 3d printer queue printing-studio.component
*/
export interface RenderData {
    machine: MachineList;
    currentJob: PrintQueueItem;
    currentJobOwner: sanatizedUser;
    queueItems: PrintQueueItem
}



/*
    * Interface for AdminPanel ManageDepartments
*/
// export interface DeptInfo {
//     id: string;
//     deptName: string;
//     buisnessHours: BuisnessHoursWeek [];
//     buisnessHoursOverrides: BuisnessHoursOverride [];
// }

export interface DeptInfo {
    id: string,
    deptName: string;
    currentOperatingSchedule: string,
    operatingHoursSchedules: DeptOperatingHoursSchedule [],
    operatingHoursOverrides: DeptOperatingHoursOverride []
}

export interface DeptOperatingHoursOverride {
    id: string,
    overrideReason: string,
    overrideStartDate: Date,
    overrideEndDate: Date,
    dayOfWeek: number,
    altOpenTime: Date,
    altCloseTime: Date,
    isOpen: boolean

}

export interface DeptOperatingHoursSchedule {
    id: string,
    scheduleName: string,
    buisnessHours: BuisnessHourDay []
}


export interface BuisnessHourDay {
    id: string,
    dayOfWeek: number,
    openTime: Date,
    closeTime: Date,
    isOpen: boolean
}

// old 
export interface BuisnessHoursWeek {
    id: string;
    dayOfWeek: number;
    openTime: Date;
    closeTime: Date;
    isOpen: boolean;
}

export interface BuisnessHoursOverride {
    id: string;
    overrideReason: string;
    overrideStartDate: Date;
    overrideEndDate: Date;
    dayOfWeek: number;
    altOpenTime: Date;
    altCloseTime: Date;
    isOpen: boolean;
}


/*
 _   _  _____ _    _ _____
| \ | ||  ___| |  | /  ___|
|  \| || |__ | |  | \ `--.
| . ` ||  __|| |/\| |`--. \
| |\  || |___\  /\  /\__/ /
\_| \_/\____/ \/  \/\____/

*/
export interface News {
    id: string,
    title: string,
    content: string,
    postedDate: Date
}


// For use with manage-alert-emails
export interface EmailAccount {
    id: string,
    email: string,
    password: string,
    type: string
  }

export interface EmailHistory {
  id: string,
  from: string,
  to: string,
  subject: string,
  html: string,
  sendData: string,
  rc: string
}

//BIG BOY PRINTER TIME
export interface Printer {
    name: string,
    type: string,
    octopiUrl: string
}