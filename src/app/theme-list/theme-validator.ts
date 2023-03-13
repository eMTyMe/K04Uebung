import { AbstractControl, ValidationErrors } from "@angular/forms";
import { DbService } from "../shared/dbservice.service";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";

export class ThemeValidator {
  static descrExists(dbs: DbService) {
    return function(control: AbstractControl): Observable<ValidationErrors | null>  {
      return from(dbs.checkThemeExists(control.value))
        .pipe(map(data => data ? { descrExists: true } : null));
    };
  }
}
