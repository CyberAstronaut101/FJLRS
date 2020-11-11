import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";


@Injectable() // allows injection of other services
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}
    // runs for outgoing requests
    intercept(req: HttpRequest<any>, next: HttpHandler ) {
        // toget token, must inject service for auth
        const authToken = this.authService.getToken(); // gets token from service

        // manipulate request to add token to header
        // must make a copy before modifying 
        const authRequest = req.clone({
            headers: req.headers.set("Authorization", "Bearer " + authToken)
        });
        // continue call with the new authRequest with json 
        return next.handle(authRequest);
    }
}