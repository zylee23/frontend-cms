import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "../../../store/app.reducer";
import { ClinicActions } from "./clinic-types";
import { first, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable()
export class ClinicResolver implements Resolve<any> {

    constructor(private store: Store<AppState>) {}

    resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
        return this.store.pipe(
            tap(_ => this.store.dispatch(ClinicActions.loadAllClinics())),
            first(),
        )
    }

}
