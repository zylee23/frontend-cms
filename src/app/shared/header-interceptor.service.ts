import { HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { switchMap, take } from "rxjs/operators";
import { selectAuthState } from "../auth/store/auth.selectors";
import { AppState } from "../store/app.reducer";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor(private store: Store<AppState>) {}

  intercept(request: HttpRequest<any>, next:HttpHandler) {
    return this.store.select(selectAuthState).pipe(
      take(1),
      switchMap(auth => {
        // Only add the content-type and content-disposition headers when
        // converting speech to text on the web application
        if (request.url.includes("stt") && !request.url.includes("stt/mobile")) {
          return next.handle(request.clone({
            headers: new HttpHeaders({
              "Content-Type": 'audio/wav',
              "Content-Disposition": 'attachment; filename="speech.wav"'
            })
          }));
        }

        if (auth.token) {
          return next.handle(request.clone({
            headers: request.headers.set("Authorization", `Token ${auth.token}`)
          }));
        }

        return next.handle(request);
      })
    );
  }

}
