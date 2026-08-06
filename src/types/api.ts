/** Normalized shape every API failure is coerced into before reaching the UI. */
export interface ApiError {
  message: string;
  status?: number;
  isNetworkError: boolean;
  isTimeout: boolean;
  fieldErrors?: Record<string, string[]>;
}
