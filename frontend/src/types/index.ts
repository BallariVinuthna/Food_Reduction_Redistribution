export type Role = 'ADMIN' | 'FOOD_PROVIDER' | 'NGO_RECEIVER' | 'VOLUNTEER' | 'CONSUMER' | 'COLLECTION_PARTNER';

export type FoodStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'ACCEPTED'
  | 'PICKUP_ASSIGNED'
  | 'COLLECTED'
  | 'REDISTRIBUTED'
  | 'EXPIRED'
  | 'CANCELLED';

export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type MatchStatus = 'PROPOSED' | 'NOTIFIED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export type PickupStatus = 'ASSIGNED' | 'EN_ROUTE' | 'ARRIVED' | 'COLLECTED' | 'DELIVERED' | 'FAILED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  profileId?: string;
  organizationName?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface FoodSafetyCheck {
  id?: string;
  temperatureSafe: boolean;
  cleanPackaging: boolean;
  preparedWithinSafeWindow: boolean;
  allergenDeclared: boolean;
  providerCertified: boolean;
  notes?: string;
  checkedAt?: string;
}

export interface FoodListing {
  id: string;
  providerId: string;
  providerOrganizationName: string;
  foodName: string;
  foodCategory: string;
  quantity: number;
  remainingQuantity?: number;
  unit: string;
  preparationTime: string;
  availableFrom: string;
  availableUntil: string;
  address: string;
  latitude: number;
  longitude: number;
  foodCondition: string;
  vegetarian: boolean;
  allergenInfo?: string;
  storageCondition: string;
  pickupInstructions?: string;
  photoUrl?: string;
  contactPhone?: string;
  status: FoodStatus;
  urgencyLevel: UrgencyLevel;
  availableMinutesRemaining: number;
  createdAt: string;
  updatedAt: string;
  safetyCheck?: FoodSafetyCheck;
}

export interface Match {
  id: string;
  foodListingId: string;
  foodName: string;
  quantity: number;
  unit: string;
  receiverId: string;
  receiverOrganizationName: string;
  receiverAddress: string;
  receiverLatitude: number;
  receiverLongitude: number;
  receiverPhone: string;
  matchScore: number;
  locationScore: number;
  quantityScore: number;
  urgencyScore: number;
  foodTypeScore: number;
  capacityScore: number;
  reliabilityScore: number;
  distanceKm: number;
  estimatedPickupMinutes: number;
  status: MatchStatus;
  proposedAt: string;
  respondedAt?: string;
  responseNotes?: string;
}

export interface PickupAssignment {
  id: string;
  matchId: string;
  foodListingId: string;
  foodName: string;
  quantity: number;
  unit: string;
  providerName?: string;
  providerOrganizationName: string;
  providerAddress: string;
  providerLatitude: number;
  providerLongitude: number;
  providerPhone?: string;
  receiverName?: string;
  receiverOrganizationName: string;
  receiverAddress: string;
  receiverLatitude: number;
  receiverLongitude: number;
  receiverPhone?: string;
  volunteerId?: string;
  volunteerName?: string;
  volunteerPhone?: string;
  status: PickupStatus;
  pickupOtp?: string;
  deliveryOtp?: string;
  pickupOtpVerified?: boolean;
  deliveryOtpVerified?: boolean;
  actualQuantity?: number;
  cancellationReason?: string;
  failedReason?: string;
  assignedAt: string;
  enRouteAt?: string;
  arrivedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  proofNotes?: string;
  proofPhotoUrl?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  referenceId?: string;
  createdAt: string;
}

export interface BaselineMetric {
  id?: string;
  metricKey: string;
  metricName: string;
  description: string;
  baselineValue: number;
  unit: string;
  dataSource?: string;
  notes?: string;
  demo: boolean;
  updatedAt?: string;
}

export interface DashboardAnalytics {
  hasData?: boolean;
  totalListings: number;
  activeListings: number;
  reservedListings: number;
  completedRedistributions: number;
  expiredListings: number;
  cancelledListings: number;
  totalQuantityListedMeals: number;
  totalQuantityRedistributedMeals: number;
  totalMealsRedistributed?: number;
  totalWeightSavedKg?: number;
  peopleServed?: number;
  pickupSuccessRate?: number;
  actualVerifiedDeliveredMeals?: number;
  foodWasteAvoidedKg?: number;
  estimatedFoodWasteAvoidedKg?: number;
  estimatedValueSavedInr?: number;
  fieldObservedWasteKg?: number;
  redistributionRatePercentage: number;
  matchSuccessRatePercentage: number;
  averageMatchingTimeSeconds: number | null;
  averageListingToAcceptanceMinutes?: number | null;
  averagePickupTimeMinutes: number | null;
  averageDeliveryTimeMinutes?: number | null;
  dataCompletenessPercentage?: number;
  environmentalFormulaExplanation?: string;
  monetaryFormulaExplanation?: string;
  totalProviders: number;
  totalReceivers: number;
  totalVolunteers: number;
  categoryBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
  urgencyBreakdown: Record<string, number>;
  trendData: Array<{ day: string; listed: number; redistributed: number; wasteAvoidedKg: number }>;
  locationBreakdown: Array<{ area: string; meals: number; savedKg: number }>;
}

export interface DonationTransaction {
  id: string;
  foodListingId: string;
  foodName: string;
  providerId: string;
  providerOrganizationName: string;
  receiverId: string;
  receiverOrganizationName: string;
  volunteerId?: string;
  volunteerName?: string;
  quantityListed: number;
  quantityReserved: number;
  quantityCollected?: number;
  quantityDelivered?: number;
  unit: string;
  status: string;
  verificationStatus: string;
  pickupOtp?: string;
  deliveryOtp?: string;
  pickupOtpVerified: boolean;
  deliveryOtpVerified: boolean;
  reservedAt: string;
  assignedAt?: string;
  collectedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  failedReason?: string;
  notes?: string;
}

export interface FieldWasteRecord {
  id: string;
  venueName: string;
  venueType: string;
  locality: string;
  foodCategory: string;
  quantity: number;
  unit: string;
  observationPeriodStart: string;
  observationPeriodEnd: string;
  observationShift?: string;
  dataSource: string;
  auditorName: string;
  verificationStatus: string;
  verifiedAt?: string;
  verifiedBy?: string;
  demo: boolean;
  notes?: string;
  createdAt: string;
}

export interface BenchmarkRun {
  id: string;
  runId: string;
  executedAt: string;
  totalScenarios: number;
  successfulMatches: number;
  failedMatches: number;
  actualMatchSuccessRate: number;
  actualAverageMatchingTimeSeconds: number;
  actualNotificationSuccessRate: number;
  actualDataStorageIntegrityRate: number;
  actualWorkflowSuccessRate: number;
  validationOutcome: string;
  recommendation: string;
  simulation: boolean;
}

export interface PrototypeValidationScenario {
  id: string;
  benchmarkRunId?: string;
  runId?: string;
  scenarioName: string;
  foodType: string;
  quantity: number;
  availableMinutes: number;
  locationName: string;
  distanceKm: number;
  matchedReceiverName: string;
  matchScore: number;
  executionTimeMs: number;
  matchSuccess: boolean;
  notificationSuccess: boolean;
  storageSuccess: boolean;
  workflowSuccess: boolean;
  failureReason?: string;
  testTimestamp: string;
}

export interface PrototypeValidationReport {
  runId?: string;
  simulation?: boolean;
  criticalAssumption?: string;
  totalTestCases: number;
  successfulMatches: number;
  failedMatches: number;
  actualMatchSuccessRate: number;
  actualAverageMatchingTimeSeconds: number;
  actualNotificationSuccessRate: number;
  actualDataStorageIntegrityRate: number;
  actualWorkflowSuccessRate: number;
  targetMatchSuccessRate?: number;
  targetAverageMatchingTimeSeconds?: number;
  targetNotificationSuccessRate?: number;
  targetDataStorageIntegrityRate?: number;
  targetWorkflowSuccessRate?: number;
  validationOutcome: 'PASS' | 'PARTIAL' | 'FAIL' | string;
  nextInterventionRecommendation?: string;
  benchmarkTimestamp?: string;
  scenarios: PrototypeValidationScenario[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface FoodImageAssessment {
  id: string;
  imageUrl: string;
  imageFormat: string;
  fileSizeBytes: number;
  detectedFoodName: string;
  detectedCategory: string;
  confidenceScore: number;
  visibleCharacteristics: string[];
  visualConcerns: string[];
  recommendedNextSteps: string[];
  storageRecommendation?: string;
  suggestedSafeWindow?: string;
  advisoryDisclaimer: string;
  reviewStatus: string;
  createdAt: string;
  donorConfirmedFoodName?: string;
  donorConfirmedCategory?: string;
  donorConfirmedQuantity?: number;
  donorConfirmedUnit?: string;
  donorConfirmedStorage?: string;
  donorConfirmedAllergens?: string;
  donorConfirmedMinutes?: number;
}

export interface ConfirmImageAssessmentPayload {
  confirmedFoodName?: string;
  confirmedCategory?: string;
  confirmedQuantity?: number;
  confirmedUnit?: string;
  confirmedStorage?: string;
  confirmedAllergens?: string;
  confirmedMinutes?: number;
  applyToListing?: boolean;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  source?: string;
  suggestedFollowUps?: string[];
  timestamp: string;
}

export interface FoodPreparationRecord {
  id: string;
  providerId: string;
  providerName?: string;
  foodItemName: string;
  foodCategory: string;
  dayOfWeek: string;
  mealPeriod: 'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER' | string;
  recordDate: string;
  quantityPrepared: number;
  quantityConsumed: number;
  quantityDonated: number;
  quantityDiscarded: number;
  quantityRemaining: number;
  customersServed?: number;
  unit: string;
  notes?: string;
  safetyMarginPct?: number;
  donationListingId?: string;
  predictedDemand?: number;
  suggestedPrepQuantity?: number;
  predictedSurplus?: number;
  confidenceMin?: number;
  confidenceMax?: number;
  forecastAccuracyPct?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodPreparationEntryPayload {
  foodItemName: string;
  foodCategory: string;
  recordDate: string;
  mealPeriod: string;
  quantityPrepared: number;
  quantityConsumed: number;
  quantityDonated?: number;
  quantityDiscarded?: number;
  customersServed?: number;
  unit: string;
  notes?: string;
  safetyMarginPct?: number;
}

export interface SmartPreparationPrediction {
  providerId: string;
  providerName: string;
  foodItemName: string;
  mealPeriod: string;
  targetDate: string;
  dayOfWeek: string;
  unit: string;
  predictedDemand: number;
  recommendedPreparation: number;
  safetyMarginPct: number;
  previouslyPreparedAvg: number;
  averageQuantityServed: number;
  averageLeftoverQuantity: number;
  estimatedAvoidableSurplus: number;
  confidenceLevel: 'NO_DATA' | 'LOW' | 'MODERATE' | 'HIGH' | string;
  confidenceMin: number;
  confidenceMax: number;
  historicalObservationsCount: number;
  dayOfWeekObservationsCount: number;
  forecastAccuracyPct: number;
  explanation: string;
  wastePreventionRecommendations: string[];
  cautionNotice: string;
  isSufficientData: boolean;
}

export interface RecurringLeftoverItem {
  foodItemName: string;
  foodCategory: string;
  primaryMealPeriod: string;
  averagePrepared: number;
  averageServed: number;
  averageLeftover: number;
  leftoverRatePct: number;
  suggestedTrimQuantity: number;
  recommendation: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface DailyPreparationSummary {
  date: string;
  dayOfWeek: string;
  prepared: number;
  served: number;
  leftover: number;
  donated: number;
  discarded: number;
}

export interface ActualVsPredictedPoint {
  date: string;
  foodItemName: string;
  actualDemand: number;
  predictedDemand: number;
  absoluteError: number;
}

export interface AdvisorEvaluationMetrics {
  meanAbsoluteError: number;
  meanAbsolutePercentageError: number;
  forecastAccuracyPct: number;
  evaluatedRecordsCount: number;
  isSufficientEvaluationData: boolean;
  interpretationMessage: string;
  recentComparisons: ActualVsPredictedPoint[];
}

export interface AdvisorInsight {
  title: string;
  description: string;
  category: string;
  severity: 'WARNING' | 'TIP' | 'SUCCESS' | 'INFO';
}

export interface PreparationAdvisorSummary {
  providerId: string;
  providerName: string;
  totalPrepared: number;
  totalServed: number;
  totalDonated: number;
  totalDiscarded: number;
  totalRemaining: number;
  estimatedAvoidableSurplus: number;
  overallLeftoverRatePct: number;
  totalRecordsLogged: number;
  daysWithDataCount: number;
  recurringLeftoverItems: RecurringLeftoverItem[];
  dailyTrends: DailyPreparationSummary[];
  mealPeriodDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
  evaluationMetrics: AdvisorEvaluationMetrics;
  actionableInsights: AdvisorInsight[];
}

