// interface for the data for the manuel 
// user create field. 

// future development will be uploading an excel sheet
// or getting an api key or whatever and request from the 
// uark AD controller server.
export interface AuthData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    studentID: string;
    phone: string;
    userLevel: string;
}