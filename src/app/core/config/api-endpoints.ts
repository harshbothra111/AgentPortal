export const API_ENDPOINTS = {
  CONFIG: {
    APP: '/assets/config/app.config.json',
  },
  JOURNEY: {
    GET: (productId: string) => `/api/journey/${productId}`,
    SUBMIT: '/api/journey/submit',
  },
  PRODUCT: {
    ERROR_MESSAGES: (product: string) => `/assets/products/${product}/error-messages.json`
  },
  VALIDATION: {
    REGISTRATION: (regNo: string) => `/api/validate/registration/${regNo}`
  }
};
