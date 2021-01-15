import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) {}

    intercept(req: HttpRequest<any>, next: HttpHandler ) {
        // how errors are handled within the app

        // .handle returns obervable stream
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = "default error message, something is actually fucked";

                console.log('!@#!@#!@# error from return data stream -->');
                console.log(error);


                /*
                    Added this catch for usage of PrimeNg elements.
                    TODO make this a component that is at the top app level and then 
                    have its own shadow box to send messages to if the API server returns a response.

                    For now i am just sending back a Message ojbect (severity, detail, summary) and giving components within admin-panel their own p-message block.
                */

                if(error.status == 401) {
                    // Needs to be just passed, component will handle the popup and showing stuff
                    return throwError(error);
                }


                if(error.error.message){
                    errorMessage = error.error.message;
                } else {
                    // there is an Error, but no error Message Returned from server

                    errorMessage = "*** ADMIN FIX *** API server not responding. Sending Alert to Admin...";

                    // TODO send emails to the admins saying that the API server is finsihed
                }

                this.dialog.open(ErrorComponent, {data: {message: errorMessage}});

                // returns observable with and without error
                return throwError(error); // return error observable
            })
        );
    }
}