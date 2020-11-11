export interface Socket {
    on(event: string, callback: (data: any) => void );
    emit(event: string, data: any);
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
    printerId: string;
    jobName: string;
    jobOwner: string;
    timeStarted: Date;
    printHours: number;
    printMinutes: number
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
