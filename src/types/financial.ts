export interface TimeEntryApproval {
  id: string;
  time_entry_id: string;
  demand_id: string;
  demand_title: string;
  project_id?: string;
  project_name?: string;
  consultant_id: string;
  consultant_name: string;
  consultant_hourly_rate: number;
  hours: number;
  description: string;
  date: string;
  status: ApprovalStatus;
  total_amount: number;
  approved_by?: string;
  approved_at?: string;
  rejected_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  consultant_id: string;
  consultant_name: string;
  period_start: string;
  period_end: string;
  approved_entries: TimeEntryApproval[];
  total_hours: number;
  total_amount: number;
  status: PaymentStatus;
  payment_date?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectFinancialSummary {
  project_id: string;
  project_name: string;
  client_name: string;
  total_estimated_hours: number;
  total_logged_hours: number;
  total_approved_hours: number;
  total_pending_hours: number;
  estimated_revenue: number;
  actual_revenue: number;
  estimated_cost: number;
  actual_cost: number;
  profit_margin: number;
  completion_percentage: number;
  average_hourly_rate: number;
  consultants_involved: ConsultantSummary[];
}

export interface ConsultantSummary {
  consultant_id: string;
  consultant_name: string;
  hourly_rate: number;
  hours_logged: number;
  hours_approved: number;
  hours_pending: number;
  total_earned: number;
  total_pending: number;
}

export interface FinancialOverview {
  total_revenue: number;
  total_costs: number;
  total_profit: number;
  profit_margin_percentage: number;
  pending_approvals_amount: number;
  pending_payments_amount: number;
  monthly_revenue: MonthlyRevenue[];
  top_projects: ProjectFinancialSummary[];
  consultants_summary: ConsultantSummary[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  costs: number;
  profit: number;
}

export interface ConsultantFinancialData {
  consultant_id: string;
  consultant_name: string;
  hourly_rate: number;
  current_month_hours: number;
  current_month_earnings: number;
  pending_approval_hours: number;
  pending_approval_amount: number;
  last_payment_date?: string;
  last_payment_amount?: number;
  next_payment_date?: string;
  next_payment_amount?: number;
  total_year_hours: number;
  total_year_earnings: number;
  monthly_history: MonthlyConsultantData[];
  recent_approvals: TimeEntryApproval[];
  recent_payments: Payment[];
}

export interface MonthlyConsultantData {
  month: string;
  hours: number;
  earnings: number;
  projects_count: number;
}

export interface ApprovalBatch {
  consultant_id: string;
  consultant_name: string;
  period_start: string;
  period_end: string;
  entries: TimeEntryApproval[];
  total_hours: number;
  total_amount: number;
}

export type ApprovalStatus = 
  | "pending"
  | "approved" 
  | "rejected"
  | "paid";

export type PaymentStatus = 
  | "pending"
  | "processing"
  | "paid"
  | "failed";

export type UserRole = "admin" | "consultant";

export interface CreatePaymentData {
  consultant_id: string;
  period_start: string;
  period_end: string;
  entry_ids: string[];
  payment_method?: string;
  notes?: string;
}

export interface ApprovalAction {
  entry_ids: string[];
  action: "approve" | "reject";
  reason?: string;
} 