import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  private apiService = inject(ApiService);
  private messages = signal<Record<string, any>>({});

  loadProductMessages(product: string): void {
    this.apiService.get<Record<string, any>>(API_ENDPOINTS.PRODUCT.ERROR_MESSAGES(product))
      .subscribe((config) => {
        this.messages.set(config);
      });
  }

  getErrorMessage(key: string, params?: any, fieldName?: string): string {
    const allMessages = this.messages();
    let message: string | undefined;

    // 1. Try specific field message
    if (fieldName && allMessages[fieldName] && allMessages[fieldName][key]) {
      message = allMessages[fieldName][key];
    }

    // 2. Try default message
    if (!message && allMessages['default'] && allMessages['default'][key]) {
      message = allMessages['default'][key];
    }

    // 3. Fallback
    if (!message) {
      return 'Invalid value';
    }

    if (params) {
      Object.keys(params).forEach(paramKey => {
        message = message!.replace(`{${paramKey}}`, params[paramKey]);
      });
    }

    return message;
  }
}
