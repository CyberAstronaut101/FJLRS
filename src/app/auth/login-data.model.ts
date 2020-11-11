// hacky for posting to /api/user/login
// email and password to compare and then serve json webtoken if they are valid
export interface LoginData {
    email: string;
    password: string;
}