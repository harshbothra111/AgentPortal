import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private configService = inject(AppConfigService);

  private getFullUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    // Remove leading slash if present to avoid double slashes if apiUrl has trailing slash
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    const apiUrl = this.configService.apiUrl;
    const cleanApiUrl = apiUrl.endsWith('/') ? apiUrl.substring(0, apiUrl.length - 1) : apiUrl;
    
    return `${cleanApiUrl}/${cleanUrl}`;
  }

  get<T>(url: string, params?: any): Observable<T> {
    return this.http.get<T>(this.getFullUrl(url), { params });
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(this.getFullUrl(url), body);
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(this.getFullUrl(url), body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.getFullUrl(url));
  }
}
