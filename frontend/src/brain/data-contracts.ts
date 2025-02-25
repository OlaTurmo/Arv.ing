/** AcceptInviteResponse */
export interface AcceptInviteResponse {
  /** Message */
  message: string;
  role: Role;
}

/** Address */
export interface Address {
  /** Street */
  street: string;
  /** Postalcode */
  postalCode: string;
  /** City */
  city: string;
  /**
   * Country
   * @default "Norge"
   */
  country?: string;
}

/** Asset */
export interface Asset {
  /** Id */
  id: string;
  /** Type */
  type: string;
  /** Description */
  description: string;
  /** Estimatedvalue */
  estimatedValue: number;
}

/** CancellationResponse */
export interface CancellationResponse {
  /** Transaction Id */
  transaction_id: string;
  /** Cancellation Letter */
  cancellation_letter?: string | null;
  /** Cancellation Email */
  cancellation_email?: string | null;
  /** Contact Info */
  contact_info: object;
}

/** CancellationStatus */
export interface CancellationStatus {
  /** Status */
  status: string;
  /** History */
  history: object[];
}

/** CancellationStatusUpdate */
export interface CancellationStatusUpdate {
  /** Status */
  status: string;
  /** Comment */
  comment: string;
}

/** Comment */
export interface Comment {
  /** Id */
  id: string;
  /** Estate Id */
  estate_id: string;
  /** Task Id */
  task_id?: string | null;
  /** User Id */
  user_id: string;
  /** Content */
  content: string;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /** Updated At */
  updated_at?: string | null;
}

/** CreateEstateResponse */
export interface CreateEstateResponse {
  /** Id */
  id: string;
  /** Userid */
  userId: string;
  /** Status */
  status: string;
  /** Currentstep */
  currentStep: number;
  /**
   * Createdat
   * @format date-time
   */
  createdAt: string;
  /**
   * Updatedat
   * @format date-time
   */
  updatedAt: string;
  /** Estatename */
  estateName?: string | null;
  /** Deceasedname */
  deceasedName?: string | null;
  /**
   * Progress
   * @default 0
   */
  progress?: number | null;
  /**
   * Tasks
   * @default []
   */
  tasks?: Task[];
}

/** CreatePaymentIntentRequest */
export interface CreatePaymentIntentRequest {
  /** Estate Id */
  estate_id: string;
}

/** CreatePaymentIntentResponse */
export interface CreatePaymentIntentResponse {
  /** Client Secret */
  client_secret: string;
  /** Amount */
  amount: number;
}

/** Debt */
export interface Debt {
  /** Id */
  id: string;
  /** Type */
  type: string;
  /** Creditor */
  creditor: string;
  /** Amount */
  amount: number;
  /** Duedate */
  dueDate?: string | null;
}

/** Estate */
export interface Estate {
  /** Id */
  id: string;
  /** Userid */
  userId: string;
  deceased?: Person | null;
  /**
   * Heirs
   * @default []
   */
  heirs?: Person[];
  /**
   * Assets
   * @default []
   */
  assets?: Asset[];
  /**
   * Debts
   * @default []
   */
  debts?: Debt[];
  /**
   * Status
   * @default "draft"
   */
  status?: string;
  /**
   * Currentstep
   * @default 0
   */
  currentStep?: number;
  /**
   * Createdat
   * @format date-time
   */
  createdAt: string;
  /**
   * Updatedat
   * @format date-time
   */
  updatedAt: string;
  /** Estatename */
  estateName?: string | null;
  /** Deceasedname */
  deceasedName?: string | null;
  /**
   * Progress
   * @default 0
   */
  progress?: number | null;
  /**
   * Tasks
   * @default []
   */
  tasks?: Task[];
  /**
   * Collaborators
   * @default {}
   */
  collaborators?: Record<string, string>;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** InviteRequest */
export interface InviteRequest {
  /** Estate Id */
  estate_id: string;
  /**
   * Email
   * @format email
   */
  email: string;
  /** Role */
  role: string;
}

/** InviteResponse */
export interface InviteResponse {
  /** Message */
  message: string;
  invitation: Role;
}

/** PaymentStatusResponse */
export interface PaymentStatusResponse {
  /** Status */
  status: string;
  /** Amount */
  amount: number;
  /** Receipt Url */
  receipt_url?: string | null;
}

/** Person */
export interface Person {
  /** Name */
  name: string;
  address: Address;
}

/** Role */
export interface Role {
  /** Estate Id */
  estate_id: string;
  /** User Id */
  user_id: string;
  /** Role */
  role: string;
  /**
   * Email
   * @format email
   */
  email: string;
  /** Status */
  status: string;
  /** Invited By */
  invited_by: string;
  /**
   * Invited At
   * @format date-time
   */
  invited_at: string;
  /** Accepted At */
  accepted_at?: string | null;
}

/** SubscriptionCancellation */
export interface SubscriptionCancellation {
  /** Transaction Id */
  transaction_id: string;
  /** Estate Id */
  estate_id: string;
  /** Cancellation Method */
  cancellation_method: string;
  /** Contact Info */
  contact_info: object;
  /** Cancellation Letter */
  cancellation_letter?: string | null;
  /** Cancellation Email */
  cancellation_email?: string | null;
}

/** Task */
export interface Task {
  /** Id */
  id: string;
  /** Title */
  title: string;
  /** Completed */
  completed: boolean;
  /** Duedate */
  dueDate?: string | null;
}

/** Transaction */
export interface Transaction {
  /** Id */
  id: string;
  /** Date */
  date: string;
  /** Recipient */
  recipient: string;
  /** Amount */
  amount: number;
  /** Category */
  category: string;
  /**
   * Is Subscription
   * @default false
   */
  is_subscription?: boolean;
  /** Subscription Frequency */
  subscription_frequency?: string | null;
  /** Contact Info */
  contact_info?: object | null;
}

/** TransactionList */
export interface TransactionList {
  /** Transactions */
  transactions: Transaction[];
  /** Estate Id */
  estate_id: string;
}

/** UpdateEstateRequest */
export interface UpdateEstateRequest {
  deceased?: Person | null;
  /** Heirs */
  heirs?: Person[] | null;
  /** Assets */
  assets?: Asset[] | null;
  /** Debts */
  debts?: Debt[] | null;
  /** Status */
  status?: string | null;
  /** Currentstep */
  currentStep?: number | null;
  /** Estatename */
  estateName?: string | null;
  /** Deceasedname */
  deceasedName?: string | null;
  /** Progress */
  progress?: number | null;
  /** Tasks */
  tasks?: Task[] | null;
}

/** UploadTransactionsRequest */
export interface UploadTransactionsRequest {
  /** File */
  file: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export interface AcceptInviteParams {
  /** Email */
  email: string;
  /** Estate Id */
  estateId: string;
}

export type AcceptInviteData = AcceptInviteResponse;

export type AcceptInviteError = HTTPValidationError;

export type InviteCollaboratorData = InviteResponse;

export type InviteCollaboratorError = HTTPValidationError;

export interface GetRolesParams {
  /** Estate Id */
  estateId: string;
}

/** Response Get Roles */
export type GetRolesData = Role[];

export type GetRolesError = HTTPValidationError;

export interface AddCommentParams {
  /** Estate Id */
  estateId: string;
}

export type AddCommentData = Comment;

export type AddCommentError = HTTPValidationError;

export interface GetCommentsParams {
  /** Task Id */
  task_id?: string | null;
  /** Estate Id */
  estateId: string;
}

/** Response Get Comments */
export type GetCommentsData = Comment[];

export type GetCommentsError = HTTPValidationError;

export type CreateEstateData = CreateEstateResponse;

export interface GetEstateParams {
  /** Estate Id */
  estateId: string;
}

export type GetEstateData = Estate;

export type GetEstateError = HTTPValidationError;

export interface UpdateEstateParams {
  /** Estate Id */
  estateId: string;
}

export type UpdateEstateData = Estate;

export type UpdateEstateError = HTTPValidationError;

export interface DeleteEstateParams {
  /** Estate Id */
  estateId: string;
}

export type DeleteEstateData = any;

export type DeleteEstateError = HTTPValidationError;

/** Response List Estates */
export type ListEstatesData = Estate[];

export interface UploadTransactionsParams {
  /** Estate Id */
  estateId: string;
}

export type UploadTransactionsData = TransactionList;

export type UploadTransactionsError = HTTPValidationError;

export interface GetTransactionsParams {
  /** Estate Id */
  estateId: string;
}

export type GetTransactionsData = TransactionList;

export type GetTransactionsError = HTTPValidationError;

export interface GetCancellationStatusParams {
  /** Estate Id */
  estateId: string;
  /** Transaction Id */
  transactionId: string;
}

export type GetCancellationStatusData = CancellationStatus;

export type GetCancellationStatusError = HTTPValidationError;

export interface UpdateCancellationStatusParams {
  /** Estate Id */
  estateId: string;
  /** Transaction Id */
  transactionId: string;
}

export type UpdateCancellationStatusData = CancellationStatus;

export type UpdateCancellationStatusError = HTTPValidationError;

export type CancelSubscriptionData = CancellationResponse;

export type CancelSubscriptionError = HTTPValidationError;

export type CreatePaymentIntentData = CreatePaymentIntentResponse;

export type CreatePaymentIntentError = HTTPValidationError;

export interface GetPaymentStatusParams {
  /** Payment Intent Id */
  paymentIntentId: string;
}

export type GetPaymentStatusData = PaymentStatusResponse;

export type GetPaymentStatusError = HTTPValidationError;

export type StripeWebhookData = any;
