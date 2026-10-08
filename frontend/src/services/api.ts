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

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    throw new ApiError(json.message || 'Network response failed', response.status);
  }

  return json.data;
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

  getAllListings: (status?: string, category?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    return request<FoodListing[]>(`/food-listings?${params.toString()}`);
  },

  getListingById: (id: string) => request<FoodListing>(`/food-listings/${id}`),

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

  updatePickupStatus: (pickupId: string, payload: { status: string; proofNotes?: string; proofPhotoUrl?: string }) =>
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
  getAnalytics: () => request<DashboardAnalytics>('/analytics/dashboard'),

  // PSE Modules
  getPseModule1: () => request<any>('/pse/module-1'),
  getPseModule2: () => request<any>('/pse/module-2'),
  getPseModule3: () => request<any>('/pse/module-3'),
  getPseModule4: () => request<any>('/pse/module-4'),
  getPseModule5: () => request<any>('/pse/module-5'),
  updatePseIdea: (id: string, body: any) =>
    request<any>(`/pse/ideas/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  // Baseline
  getBaselineMetrics: () => request<BaselineMetric[]>('/baseline'),
  saveBaselineMetric: (metric: BaselineMetric) =>
    request<BaselineMetric>('/baseline', {
      method: 'POST',
      body: JSON.stringify(metric),
    }),

  // Prototype Benchmark
  runBenchmark: () => request<PrototypeValidationReport>('/prototype-tests/run', { method: 'POST' }),
  getBenchmarkResults: () => request<any[]>('/prototype-tests/results'),
};
