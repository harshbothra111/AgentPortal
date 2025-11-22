export const API_ENDPOINTS = {
  JOURNEY: {
    GET_JOURNEY: (productId: string) => `/api/journey/${productId}`,
    SUBMIT_STEP: '/api/journey/submit',
    VALIDATE_REGISTRATION: (regNo: string) => `/api/validate/registration/${regNo}`
  }
};
