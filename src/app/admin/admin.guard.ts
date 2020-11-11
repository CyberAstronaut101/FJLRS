import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AdminGuard implements CanActivate, CanActivateChild{

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
        ): boolean | Observable<boolean> | Promise<boolean> {

            const isAdmin = this.authService.getUserLevel();

            if( isAdmin != "admin") {
                // Display Error: Must be an admin account
                alert("You must be an admin to access the admin panel silly!");
                this.router.navigate(['/']);
            } else {
                return true;
            }

        // return true or pormise, observbale -- route is accessable
        // return false, router will deny going there, redirect

    }

    canActivateChild(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
            return this.canActivate(route, state);
        }
}