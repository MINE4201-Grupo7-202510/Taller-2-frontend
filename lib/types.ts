// Tipos para el dataset de Yelp

export interface Business {
  business_id: string
  name: string
  address: string
  city: string
  state: string
  postal_code: string
  latitude: number
  longitude: number
  stars: number
  review_count: number
  is_open: number
  attributes?: Record<string, any>
  categories: string[]
  hours?: Record<string, string>
  photos?: Photo[]
}

export interface Review {
  review_id: string
  user_id: string
  business_id: string
  stars: number
  date: string
  text: string
  useful: number
  funny: number
  cool: number
  user: User
}

export interface User {
  user_id: string
  name: string
  review_count: number
  yelping_since: string
  friends: string[]
  useful: number
  funny: number
  cool: number
  fans: number
  elite: string[]
  average_stars: number
  compliment_hot?: number
  compliment_more?: number
  compliment_profile?: number
  compliment_cute?: number
  compliment_list?: number
  compliment_note?: number
  compliment_plain?: number
  compliment_cool?: number
  compliment_funny?: number
  compliment_writer?: number
  compliment_photos?: number
}

export interface Checkin {
  business_id: string
  date: string
}

export interface Tip {
  text: string
  date: string
  compliment_count: number
  business_id: string
  user_id: string
}

export interface Photo {
  photo_id: string
  business_id: string
  caption?: string
  label?: string
  url: string
}

// Tipos para el sistema de recomendación

export interface Recommendation {
  id: string
  business: Business
  score: number
  explanation: {
    factors: Array<{
      name: string
      weight: number
      description: string
    }>
    text: string
  }
  userFeedback?: boolean | null
}

export interface ExperimentMetrics {
  algorithms: Array<{
    name: string
    precision: number
    recall: number
    f1Score: number
    rmse: number
  }>
  performanceOverTime: Array<{
    epoch: number
    precision: number
    recall: number
    f1Score: number
  }>
  categoryDistribution: Array<{
    category: string
    value: number
  }>
}


// Define the structure for the explanation object from the API
export interface RecommendationExplanation {
  SVD?: string;
  KNN?: string;
  Contextual?: string;
  weights?: {
    w_svd: number;
    w_knn: number;
    w_context: number;
  };
  // Keep the old structure optionally if needed elsewhere, or remove if fully migrating
  factors?: { name: string; weight: number; description: string }[];
  text?: string;
}


// Define the structure for a single recommendation item from the API
export interface ApiRecommendation {
  business_id: string;
  name: string;
  address: string;
  categories: string; // Comma-separated string from API
  overall_stars: number;
  score_svd: number;
  score_knn: number;
  score_contextual: number;
  final_score: number;
  explanation: RecommendationExplanation;
  // Add optional userFeedback if you manage it client-side
  userFeedback?: boolean | null;
}


// Define the structure for the available contexts from the API
export interface ApiContexts {
  cities: string[];
  categories: string[];
  day_periods: string[]; // Assuming the API returns this too
}