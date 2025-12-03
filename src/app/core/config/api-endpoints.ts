export const API_ENDPOINTS = {
  CONFIG: {
    APP: '/assets/config/app.config.json',
  },
  JOURNEY: {
    GET: (productId: string) => `/api/journey/${productId}`,
    SUBMIT: '/api/journey/submit',
    BACK: '/api/journey/back',
  },
  PRODUCT: {
    ERROR_MESSAGES: (product: string) => `/assets/products/${product}/error-messages.json`,
    UI_CONFIG: (product: string) => `/assets/products/${product}/auto-ui-config.json`
  },
  VALIDATION: {
    REGISTRATION: (regNo: string) => `/api/validate/registration/${regNo}`
  }
};
