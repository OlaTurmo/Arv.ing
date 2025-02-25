import {
  AcceptInviteData,
  AddCommentData,
  CancelSubscriptionData,
  CancellationStatusUpdate,
  CheckHealthData,
  Comment,
  CreateEstateData,
  CreatePaymentIntentData,
  CreatePaymentIntentRequest,
  DeleteEstateData,
  GetCancellationStatusData,
  GetCommentsData,
  GetEstateData,
  GetPaymentStatusData,
  GetRolesData,
  GetTransactionsData,
  InviteCollaboratorData,
  InviteRequest,
  ListEstatesData,
  StripeWebhookData,
  SubscriptionCancellation,
  UpdateCancellationStatusData,
  UpdateEstateData,
  UpdateEstateRequest,
  UploadTransactionsData,
  UploadTransactionsRequest,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * No description
   * @tags dbtn/module:collaboration, dbtn/hasAuth
   * @name accept_invite
   * @summary Accept Invite
   * @request POST:/routes/accept-invite/{estate_id}
   */
  export namespace accept_invite {
    export type RequestParams = {
      /** Estate Id */
      estateId: string;
    };
    export type RequestQuery = {
      /** Email */
      email: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AcceptInviteData;
  }

  /**
   * No description
   * @tags dbtn/module:collaboration, dbtn/hasAuth
   * @name invite_collaborator
   * @summary Invite Collaborator
   * @request POST:/routes/invite
   */
  export namespace invite_collaborator {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = InviteRequest;
    export type RequestHeaders = {};
    export type ResponseBody = InviteCollaboratorData;
  }

  /**
   * No description
   * @tags dbtn/module:collaboration, dbtn/hasAuth
   * @name get_roles
   * @summary Get Roles
   * @request GET:/routes/roles/{estate_id}
   */
  export namespace get_roles {
    export type RequestParams = {
      /** Estate Id */
      estateId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetRolesData;
  }

  /**
   * No description
   * @tags dbtn/module:collaboration, dbtn/hasAuth
   * @name add_comment
   * @summary Add Comment
   * @request POST:/routes/comments/{estate_id}
   */
  export namespace add_comment {
    export type RequestParams = {
      /** Estate Id */
      estateId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = Comment;
    export type RequestHeaders = {};
    export type ResponseBody = AddCommentData;
  }

  /**
   * No description
   * @tags dbtn/module:collaboration, dbtn/hasAuth
   * @name get_comments
   * @summary Get Comments
   * @request GET:/routes/comments/{estate_id}
   */
  export namespace get_comments {
    export type RequestParams = {
      /** Estate Id */
      estateId: string;
    };
    export type RequestQuery = {
      /** Task Id */
      task_id?: string | null;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCommentsData;
  }

  /**
   * No description
   * @tags dbtn/module:estate, dbtn/hasAuth
   * @name create_estate
   * @summary Create Estate
   * @request POST:/routes/estate
   */
  export namespace create_estate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CreateEstateData;
  }

  /**
   * No description
   * @tags dbtn/module:estate, dbtn/hasAuth
   * @name get_estate
   * @summary Get Estate
   * @request GET:/routes/estate/{estate_id}
   */
  export namespace get_estate {
    export type RequestParams = {
      /** Estate Id */
      estateId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetEstateData;
  }

  /**
   * No description
   * @tags dbtn/module:estate, dbtn/hasAuth
   * @name update_estate
   * @summary Update Estate
   * @request PUT:/routes/estate/{estate_id}
   */
  export namespace update_estate {
    export type RequestParams = {
      /** Estate Id */
      estateId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateEstateRequest;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateEstateData;
  }

  /**
   * No description
   * @tags dbtn/module:estate, dbtn/hasAuth
   * @name delete_estate
   * @summary Delete Estate
   * @request DELETE:/routes/estate/{estate_id}
   */
  export namespace delete_estate {
    export type RequestParams = {
      /** Estate Id */
      estateId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteEstateData;
  }

  /**
   * No description
   * @tags dbtn/module:estate, dbtn/hasAuth
   * @name list_estates
   * @summary List Estates
   * @request GET:/routes/estates
   */
  export namespace list_estates {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListEstatesData;
  }

  /**
   * No description
   * @tags dbtn/module:transaction, dbtn/hasAuth
   * @name upload_transactions
   * @summary Upload Transactions
   * @request POST:/routes/upload/{estate_id}
   */
  export namespace upload_transactions {
    export type RequestParams = {
      /** Estate Id */
      estateId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UploadTransactionsRequest;
    export type RequestHeaders = {};
    export type ResponseBody = UploadTransactionsData;
  }

  /**
   * No description
   * @tags dbtn/module:transaction, dbtn/hasAuth
   * @name get_transactions
   * @summary Get Transactions
   * @request GET:/routes/transaction/{estate_id}
   */
  export namespace get_transactions {
    export type RequestParams = {
      /** Estate Id */
      estateId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetTransactionsData;
  }

  /**
   * No description
   * @tags dbtn/module:transaction, dbtn/hasAuth
   * @name get_cancellation_status
   * @summary Get Cancellation Status
   * @request GET:/routes/cancellations/{estate_id}/{transaction_id}
   */
  export namespace get_cancellation_status {
    export type RequestParams = {
      /** Estate Id */
      estateId: string;
      /** Transaction Id */
      transactionId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCancellationStatusData;
  }

  /**
   * No description
   * @tags dbtn/module:transaction, dbtn/hasAuth
   * @name update_cancellation_status
   * @summary Update Cancellation Status
   * @request POST:/routes/cancellations/{estate_id}/{transaction_id}/status
   */
  export namespace update_cancellation_status {
    export type RequestParams = {
      /** Estate Id */
      estateId: string;
      /** Transaction Id */
      transactionId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CancellationStatusUpdate;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateCancellationStatusData;
  }

  /**
   * No description
   * @tags dbtn/module:transaction, dbtn/hasAuth
   * @name cancel_subscription
   * @summary Cancel Subscription
   * @request POST:/routes/transaction/cancel
   */
  export namespace cancel_subscription {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SubscriptionCancellation;
    export type RequestHeaders = {};
    export type ResponseBody = CancelSubscriptionData;
  }

  /**
   * No description
   * @tags dbtn/module:payment, dbtn/hasAuth
   * @name create_payment_intent
   * @summary Create Payment Intent
   * @request POST:/routes/payment/create-intent
   */
  export namespace create_payment_intent {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreatePaymentIntentRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreatePaymentIntentData;
  }

  /**
   * No description
   * @tags dbtn/module:payment, dbtn/hasAuth
   * @name get_payment_status
   * @summary Get Payment Status
   * @request GET:/routes/payment/{payment_intent_id}/status
   */
  export namespace get_payment_status {
    export type RequestParams = {
      /** Payment Intent Id */
      paymentIntentId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPaymentStatusData;
  }

  /**
   * No description
   * @tags dbtn/module:payment, dbtn/hasAuth
   * @name stripe_webhook
   * @summary Stripe Webhook
   * @request POST:/routes/payment/webhook
   */
  export namespace stripe_webhook {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = StripeWebhookData;
  }
}
