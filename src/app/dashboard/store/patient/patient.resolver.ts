import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { first, tap } from "rxjs/operators";
import { AppState } from "../../../store/app.reducer";
import { PatientActions } from "./patient-types";
import { selectRole } from "src/app/auth/store/auth.selectors";
import { Role } from "src/app/constants/role.constants";

@Injectable()
export class PatientResolver implements Resolve<any> {

  constructor(private store: Store<AppState>) {}

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    return this.store.pipe(
      select(selectRole),
      tap(role => {
        if (role === Role.ADMIN) {
          this.store.dispatch(PatientActions.loadAllPatients())
        }
      }),
      first(),
    )
  }

}
