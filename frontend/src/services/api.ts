import {
  ApiResponse,
  BaselineMetric,
  DashboardAnalytics,
  FoodListing,
  Match,
  AppNotification,
  PickupAssignment,
  PrototypeValidationReport,
  User,
  FoodPreparationRecord,
  FoodPreparationEntryPayload,
  SmartPreparationPrediction,
  PreparationAdvisorSummary,
} from '../types';

const API_BASE = '/api';

export class ApiError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (networkError: any) {
    throw new ApiError(
      'Unable to connect to the backend server. Please verify the Spring Boot service is running on port 8080.',
      0
    );
  }

  const rawText = await response.text();
  let json: ApiResponse<T> | null = null;

  if (rawText && rawText.trim().length > 0) {
    try {
      json = JSON.parse(rawText);
    } catch {
      // Body is not JSON (e.g., HTML error from proxy or web server)
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new ApiError(
        json?.message || 'Authentication required or session expired. Please log in again.',
        401
      );
    }
    if (response.status === 403) {
      throw new ApiError(
        json?.message || 'Access denied. You do not have permission for this action.',
        403
      );
    }
    if (response.status === 502 || response.status === 503 || response.status === 504) {
      throw new ApiError(
        'Backend server is temporarily unreachable (Gateway/Proxy error). Please ensure the backend is running.',
        response.status
      );
    }
    throw new ApiError(
      json?.message || `Request failed with HTTP status ${response.status}`,
      response.status
    );
  }

  if (!json) {
    // 200/204 response with empty body
    return ({} as unknown) as T;
  }

  if (json.success === false) {
    throw new ApiError(json.message || 'Operation failed', response.status);
  }

  return json.data !== undefined ? json.data : ((json as unknown) as T);
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; refreshToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (payload: any) =>
    request<{ token: string; refreshToken: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getCurrentUser: () => request<User>('/auth/me'),

  // Listings
  createListing: (payload: any) =>
    request<FoodListing>('/food-listings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getActiveListings: () => request<FoodListing[]>('/food-listings/active'),
  getActiveSurplus: () => request<FoodListing[]>('/food-listings/active'),

  getAllListings: (status?: string, category?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    return request<FoodListing[]>(`/food-listings?${params.toString()}`);
  },

  getListingById: (id: string) => request<FoodListing>(`/food-listings/${id}`),

  claimListing: (listingId: string, payload?: { quantity?: number; notes?: string }) =>
    request<any>(`/food-listings/${listingId}/claim`, {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    }),

  getProviderListings: (providerId: string) =>
    request<FoodListing[]>(`/food-listings/provider/${providerId}`),

  // Matching
  generateMatches: (listingId: string) =>
    request<Match[]>(`/matching/${listingId}`, { method: 'POST' }),

  getMatchesForListing: (listingId: string) =>
    request<Match[]>(`/matching/${listingId}`),

  getReceiverMatches: (receiverId: string) =>
    request<Match[]>(`/matching/receiver/${receiverId}`),

  acceptMatch: (matchId: string, notes?: string, volunteerId?: string) =>
    request<Match>(`/matching/${matchId}/accept`, {
      method: 'POST',
      body: JSON.stringify({ notes, volunteerId }),
    }),

  rejectMatch: (matchId: string, reason?: string) =>
    request<Match>(`/matching/${matchId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Pickups
  getAllPickups: (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return request<PickupAssignment[]>(`/pickups${query}`);
  },

  getPickupById: (id: string) => request<PickupAssignment>(`/pickups/${id}`),

  getVolunteerPickups: (volunteerId: string) =>
    request<PickupAssignment[]>(`/pickups/volunteer/${volunteerId}`),

  assignVolunteer: (pickupId: string, volunteerId: string) =>
    request<PickupAssignment>(`/pickups/${pickupId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ volunteerId }),
    }),

  updatePickupStatus: (pickupId: string, payload: {
    status: string;
    otp?: string;
    actualQuantity?: number;
    cancellationReason?: string;
    failedReason?: string;
    proofNotes?: string;
    proofPhotoUrl?: string;
  }) =>
    request<PickupAssignment>(`/pickups/${pickupId}/status`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Notifications
  getNotifications: () => request<AppNotification[]>('/notifications'),
  markNotificationRead: (id: string) =>
    request<void>(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () =>
    request<void>('/notifications/read-all', { method: 'PUT' }),

  // Analytics
  getAnalytics: (params?: { startDate?: string; endDate?: string; locality?: string; category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.locality) searchParams.append('locality', params.locality);
    if (params?.category) searchParams.append('category', params.category);
    const qs = searchParams.toString();
    return request<DashboardAnalytics>(`/analytics/dashboard${qs ? '?' + qs : ''}`);
  },

  exportAnalyticsSummaryCsv: (startDate?: string, endDate?: string) => {
    const searchParams = new URLSearchParams();
    if (startDate) searchParams.append('startDate', startDate);
    if (endDate) searchParams.append('endDate', endDate);
    const qs = searchParams.toString();
    const token = localStorage.getItem('token');
    return fetch(`/api/analytics/export/summary${qs ? '?' + qs : ''}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then(r => r.blob());
  },

  exportTransactionsCsv: (startDate?: string, endDate?: string) => {
    const searchParams = new URLSearchParams();
    if (startDate) searchParams.append('startDate', startDate);
    if (endDate) searchParams.append('endDate', endDate);
    const qs = searchParams.toString();
    const token = localStorage.getItem('token');
    return fetch(`/api/analytics/export/transactions${qs ? '?' + qs : ''}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then(r => r.blob());
  },

  // Transactions
  getTransactions: (page = 0, size = 20) =>
    request<{ content: any[]; totalElements: number; totalPages: number }>(`/transactions?page=${page}&size=${size}`),

  verifyPickupOtp: (id: string, otp: string, actualQuantity?: number) =>
    request<any>(`/transactions/${id}/verify-pickup`, {
      method: 'POST',
      body: JSON.stringify({ otp, actualQuantity }),
    }),

  verifyDeliveryOtp: (id: string, otp: string, actualQuantity?: number) =>
    request<any>(`/transactions/${id}/verify-delivery`, {
      method: 'POST',
      body: JSON.stringify({ otp, actualQuantity }),
    }),

  cancelTransaction: (id: string, reason: string) =>
    request<any>(`/transactions/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  reportFailedHandover: (id: string, reason: string) =>
    request<any>(`/transactions/${id}/report-failed`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Field Waste Audits
  getFieldWasteRecords: (isDemo = false) =>
    request<{ content: any[] }>(`/field-waste?isDemo=${isDemo}`),

  logFieldWasteRecord: (record: any) =>
    request<any>('/field-waste', {
      method: 'POST',
      body: JSON.stringify(record),
    }),

  exportFieldWasteCsv: (isDemo = false) => {
    const token = localStorage.getItem('token');
    return fetch(`/api/field-waste/export?isDemo=${isDemo}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then(r => r.blob());
  },

  // PSE Modules
  getPseModule1: () => request<any>('/pse/module-1'),
  getPseModule2: () => request<any>('/pse/module-2'),
  getPseModule3: () => request<any>('/pse/module-3'),
  getPseModule4: () => request<any>('/pse/module-4'),
  getPseModule5: () => request<any>('/pse/module-5'),
  refreshLiveDemo: () => request<any>('/pse/live-demo/refresh', { method: 'POST' }),
  updatePseIdea: (id: string, body: any) =>
    request<any>(`/pse/ideas/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  // Baseline
  getBaselineMetrics: () => request<BaselineMetric[]>('/baseline'),
  saveBaselineMetric: (metric: BaselineMetric) =>
    request<BaselineMetric>('/baseline', {
      method: 'POST',
      body: JSON.stringify(metric),
    }),
  calculateBaselineImprovement: (metricKey: string, postValue: number, postUnit: string, postScope: string, isPostDemo = false) =>
    request<any>('/baseline/calculate-improvement', {
      method: 'POST',
      body: JSON.stringify({ metricKey, postValue, postUnit, postScope, isPostDemo }),
    }),

  // Prototype Benchmark
  runBenchmark: () => request<PrototypeValidationReport>('/prototype-tests/run', { method: 'POST' }),
  getBenchmarkResults: (runId?: string) =>
    request<any[]>(`/prototype-tests/results${runId ? `?runId=${encodeURIComponent(runId)}` : ''}`),
  getBenchmarkRuns: () =>
    request<any[]>('/prototype-tests/runs'),

  // AI Assistance
  analyzeFoodAi: (payload: { foodName: string; category?: string; storageCondition?: string; elapsedMinutes?: number; quantityKg?: number }) =>
    request<any>('/ai/analyze-food', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // AI Food Image Checker
  uploadAndAnalyzeFoodImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/ai/image-check/upload-and-analyze', {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to analyze food image.');
    }
    return data.data;
  },

  confirmImageCheck: (id: string, payload: any) =>
    request<any>(`/ai/image-check/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getImageCheckHistory: () =>
    request<any[]>('/ai/image-check/history'),

  // AI Chatbot Assistant
  chatWithAi: (message: string, history?: Array<{ role: string; content: string }>) =>
    request<{ reply: string; source: string; suggestedFollowUps: string[] }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),

  // Smart Surplus Prediction & Preparation Advisor
  createPreparationRecord: (payload: FoodPreparationEntryPayload) =>
    request<FoodPreparationRecord>('/prediction/preparation-records', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updatePreparationRecord: (id: string, payload: FoodPreparationEntryPayload) =>
    request<FoodPreparationRecord>(`/prediction/preparation-records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  getPreparationRecords: (filters?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    mealPeriod?: string;
    providerId?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.mealPeriod) params.append('mealPeriod', filters.mealPeriod);
    if (filters?.providerId) params.append('providerId', filters.providerId);
    const qs = params.toString();
    return request<FoodPreparationRecord[]>(`/prediction/preparation-records${qs ? '?' + qs : ''}`);
  },

  getSmartDemandPrediction: (params: {
    foodItem?: string;
    mealPeriod?: string;
    targetDate?: string;
    safetyMarginPct?: number;
    providerId?: string;
  }) => {
    const qs = new URLSearchParams();
    if (params.foodItem) qs.append('foodItem', params.foodItem);
    if (params.mealPeriod) qs.append('mealPeriod', params.mealPeriod);
    if (params.targetDate) qs.append('targetDate', params.targetDate);
    if (params.safetyMarginPct !== undefined) qs.append('safetyMarginPct', params.safetyMarginPct.toString());
    if (params.providerId) qs.append('providerId', params.providerId);
    return request<SmartPreparationPrediction>(`/prediction/advisor/forecast?${qs.toString()}`);
  },

  getPreparationAdvisorDashboard: (filters?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    mealPeriod?: string;
    providerId?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.mealPeriod) params.append('mealPeriod', filters.mealPeriod);
    if (filters?.providerId) params.append('providerId', filters.providerId);
    const qs = params.toString();
    return request<PreparationAdvisorSummary>(`/prediction/advisor/dashboard${qs ? '?' + qs : ''}`);
  },

  getDonationHandoff: (recordId: string) =>
    request<any>(`/prediction/preparation-records/${recordId}/donate-handoff`, {
      method: 'POST',
    }),

  markRecordDonated: (recordId: string, quantity: number, listingId?: string) => {
    const qs = new URLSearchParams();
    qs.append('quantity', quantity.toString());
    if (listingId) qs.append('listingId', listingId);
    return request<FoodPreparationRecord>(`/prediction/preparation-records/${recordId}/mark-donated?${qs.toString()}`, {
      method: 'POST',
    });
  },
};

