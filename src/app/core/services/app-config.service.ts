import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export interface AppConfig {
  apiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: AppConfig | null = null;
  private http = inject(HttpClient);

  async loadConfig(): Promise<void> {
    try {
      const config = await lastValueFrom(this.http.get<AppConfig>('/assets/config/app.config.json'));
      this.config = config;
      console.log('App config loaded:', this.config);
    } catch (error) {
      console.error('Could not load app configuration', error);
      // Fallback or rethrow depending on requirements
      this.config = { apiUrl: '' }; 
    }
  }

  get apiUrl(): string {
    return this.config?.apiUrl || '';
  }
}
