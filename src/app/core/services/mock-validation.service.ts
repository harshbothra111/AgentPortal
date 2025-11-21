import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockValidationService {

  // Simulate a server check for unique registration number
  uniqueRegistrationValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      // Simulate network delay
      return timer(1000).pipe(
        map(() => {
          const taken = control.value.toLowerCase() === 'taken123';
          return taken ? { uniqueRegistration: true } : null;
        })
      );
    };
  }
}
