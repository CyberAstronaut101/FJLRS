import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild{

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
        ): boolean | Observable<boolean> | Promise<boolean> {

            const isAuth = this.authService.getIsAuth();
            if(!isAuth){
                // navigate away
                this.router.navigate(['/auth/login']); // user must login to continue
            }
            return isAuth;
        // return true or pormise, observbale -- route is accessable
        // return false, router will deny going there, redirect

    }

    canActivateChild(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
            return this.canActivate(route, state);
        }
}