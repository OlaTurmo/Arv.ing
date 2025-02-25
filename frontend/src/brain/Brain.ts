import {
  AcceptInviteData,
  AcceptInviteError,
  AcceptInviteParams,
  AddCommentData,
  AddCommentError,
  AddCommentParams,
  CancelSubscriptionData,
  CancelSubscriptionError,
  CancellationStatusUpdate,
  CheckHealthData,
  Comment,
  CreateEstateData,
  CreatePaymentIntentData,
  CreatePaymentIntentError,
  CreatePaymentIntentRequest,
  DeleteEstateData,
  DeleteEstateError,
  DeleteEstateParams,
  GetCancellationStatusData,
  GetCancellationStatusError,
  GetCancellationStatusParams,
  GetCommentsData,
  GetCommentsError,
  GetCommentsParams,
  GetEstateData,
  GetEstateError,
  GetEstateParams,
  GetPaymentStatusData,
  GetPaymentStatusError,
  GetPaymentStatusParams,
  GetRolesData,
  GetRolesError,
  GetRolesParams,
  GetTransactionsData,
  GetTransactionsError,
  GetTransactionsParams,
  InviteCollaboratorData,
  InviteCollaboratorError,
  InviteRequest,
  ListEstatesData,
  StripeWebhookData,
  SubscriptionCancellation,
  UpdateCancellationStatusData,
  UpdateCancellationStatusError,
  UpdateCancellationStatusParams,
  UpdateEstateData,
  UpdateEstateError,
  UpdateEstateParams,
  UpdateEstateRequest,
  UploadTransactionsData,
  UploadTransactionsError,
  UploadTransactionsParams,
  UploadTransactionsRequest,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:collaboration, dbtn/hasAuth
   * @name accept_invite
   * @summary Accept Invite
   * @request POST:/routes/accept-invite/{estate_id}
   */
  accept_invite = ({ estateId, ...query }: AcceptInviteParams, params: RequestParams = {}) =>
    this.request<AcceptInviteData, AcceptInviteError>({
      path: `/routes/accept-invite/${estateId}`,
      method: "POST",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:collaboration, dbtn/hasAuth
   * @name invite_collaborator
   * @summary Invite Collaborator
   * @request POST:/routes/invite
   */
  invite_collaborator = (data: InviteRequest, params: RequestParams = {}) =>
    this.request<InviteCollaboratorData, InviteCollaboratorError>({
      path: `/routes/invite`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:collaboration, dbtn/hasAuth
   * @name get_roles
   * @summary Get Roles
   * @request GET:/routes/roles/{estate_id}
   */
  get_roles = ({ estateId, ...query }: GetRolesParams, params: RequestParams = {}) =>
    this.request<GetRolesData, GetRolesError>({
      path: `/routes/roles/${estateId}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:collaboration, dbtn/hasAuth
   * @name add_comment
   * @summary Add Comment
   * @request POST:/routes/comments/{estate_id}
   */
  add_comment = ({ estateId, ...query }: AddCommentParams, data: Comment, params: RequestParams = {}) =>
    this.request<AddCommentData, AddCommentError>({
      path: `/routes/comments/${estateId}`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:collaboration, dbtn/hasAuth
   * @name get_comments
   * @summary Get Comments
   * @request GET:/routes/comments/{estate_id}
   */
  get_comments = ({ estateId, ...query }: GetCommentsParams, params: RequestParams = {}) =>
    this.request<GetCommentsData, GetCommentsError>({
      path: `/routes/comments/${estateId}`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:estate, dbtn/hasAuth
   * @name create_estate
   * @summary Create Estate
   * @request POST:/routes/estate
   */
  create_estate = (params: RequestParams = {}) =>
    this.request<CreateEstateData, any>({
      path: `/routes/estate`,
      method: "POST",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:estate, dbtn/hasAuth
   * @name get_estate
   * @summary Get Estate
   * @request GET:/routes/estate/{estate_id}
   */
  get_estate = ({ estateId, ...query }: GetEstateParams, params: RequestParams = {}) =>
    this.request<GetEstateData, GetEstateError>({
      path: `/routes/estate/${estateId}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:estate, dbtn/hasAuth
   * @name update_estate
   * @summary Update Estate
   * @request PUT:/routes/estate/{estate_id}
   */
  update_estate = ({ estateId, ...query }: UpdateEstateParams, data: UpdateEstateRequest, params: RequestParams = {}) =>
    this.request<UpdateEstateData, UpdateEstateError>({
      path: `/routes/estate/${estateId}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:estate, dbtn/hasAuth
   * @name delete_estate
   * @summary Delete Estate
   * @request DELETE:/routes/estate/{estate_id}
   */
  delete_estate = ({ estateId, ...query }: DeleteEstateParams, params: RequestParams = {}) =>
    this.request<DeleteEstateData, DeleteEstateError>({
      path: `/routes/estate/${estateId}`,
      method: "DELETE",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:estate, dbtn/hasAuth
   * @name list_estates
   * @summary List Estates
   * @request GET:/routes/estates
   */
  list_estates = (params: RequestParams = {}) =>
    this.request<ListEstatesData, any>({
      path: `/routes/estates`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:transaction, dbtn/hasAuth
   * @name upload_transactions
   * @summary Upload Transactions
   * @request POST:/routes/upload/{estate_id}
   */
  upload_transactions = (
    { estateId, ...query }: UploadTransactionsParams,
    data: UploadTransactionsRequest,
    params: RequestParams = {},
  ) =>
    this.request<UploadTransactionsData, UploadTransactionsError>({
      path: `/routes/upload/${estateId}`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:transaction, dbtn/hasAuth
   * @name get_transactions
   * @summary Get Transactions
   * @request GET:/routes/transaction/{estate_id}
   */
  get_transactions = ({ estateId, ...query }: GetTransactionsParams, params: RequestParams = {}) =>
    this.request<GetTransactionsData, GetTransactionsError>({
      path: `/routes/transaction/${estateId}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:transaction, dbtn/hasAuth
   * @name get_cancellation_status
   * @summary Get Cancellation Status
   * @request GET:/routes/cancellations/{estate_id}/{transaction_id}
   */
  get_cancellation_status = (
    { estateId, transactionId, ...query }: GetCancellationStatusParams,
    params: RequestParams = {},
  ) =>
    this.request<GetCancellationStatusData, GetCancellationStatusError>({
      path: `/routes/cancellations/${estateId}/${transactionId}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:transaction, dbtn/hasAuth
   * @name update_cancellation_status
   * @summary Update Cancellation Status
   * @request POST:/routes/cancellations/{estate_id}/{transaction_id}/status
   */
  update_cancellation_status = (
    { estateId, transactionId, ...query }: UpdateCancellationStatusParams,
    data: CancellationStatusUpdate,
    params: RequestParams = {},
  ) =>
    this.request<UpdateCancellationStatusData, UpdateCancellationStatusError>({
      path: `/routes/cancellations/${estateId}/${transactionId}/status`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:transaction, dbtn/hasAuth
   * @name cancel_subscription
   * @summary Cancel Subscription
   * @request POST:/routes/transaction/cancel
   */
  cancel_subscription = (data: SubscriptionCancellation, params: RequestParams = {}) =>
    this.request<CancelSubscriptionData, CancelSubscriptionError>({
      path: `/routes/transaction/cancel`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:payment, dbtn/hasAuth
   * @name create_payment_intent
   * @summary Create Payment Intent
   * @request POST:/routes/payment/create-intent
   */
  create_payment_intent = (data: CreatePaymentIntentRequest, params: RequestParams = {}) =>
    this.request<CreatePaymentIntentData, CreatePaymentIntentError>({
      path: `/routes/payment/create-intent`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:payment, dbtn/hasAuth
   * @name get_payment_status
   * @summary Get Payment Status
   * @request GET:/routes/payment/{payment_intent_id}/status
   */
  get_payment_status = ({ paymentIntentId, ...query }: GetPaymentStatusParams, params: RequestParams = {}) =>
    this.request<GetPaymentStatusData, GetPaymentStatusError>({
      path: `/routes/payment/${paymentIntentId}/status`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:payment, dbtn/hasAuth
   * @name stripe_webhook
   * @summary Stripe Webhook
   * @request POST:/routes/payment/webhook
   */
  stripe_webhook = (params: RequestParams = {}) =>
    this.request<StripeWebhookData, any>({
      path: `/routes/payment/webhook`,
      method: "POST",
      ...params,
    });
}
