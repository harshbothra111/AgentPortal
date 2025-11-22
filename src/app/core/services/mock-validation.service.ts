import { Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MockValidationService {
  private apiService = inject(ApiService);

  // Simulate a server check for unique registration number
  uniqueRegistrationValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      
      return timer(500).pipe(
        switchMap(() => this.apiService.get<{ isTaken: boolean }>(`/api/validate/registration/${control.value}`)),
        map(response => {
          return response.isTaken ? { uniqueRegistration: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }
}
