import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../config/api-endpoints';

export interface AppConfig {
  apiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: AppConfig | null = null;
  private http = inject(HttpClient);

  loadConfig(): void {
    this.http.get<AppConfig>(API_ENDPOINTS.CONFIG.APP)
      .subscribe((config) => {
        this.config = config;
      });
  }

  get apiUrl(): string {
    return this.config?.apiUrl || '';
  }
}
