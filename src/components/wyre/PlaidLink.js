import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import queryString from 'query-string';
import { PopUpGeneral } from 'components/layout/PopUpGeneral';
import { View } from 'components/layout/View';
import { Dimensions } from 'react-native';
import Constants from 'expo-constants';
import { useKeyboard } from 'hooks/keyboard';
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function PlaidLink(props) {
  const {
    linkToken,
    onEvent,
    onExit,
    onSuccess,
    visible,
    setDisplayPlaidPopup,
  } = props;
  let webviewRef = useRef();
  const { keyboardHeight } = useKeyboard();
  const [reloadOnce, setReloadOnce] = useState(0);
  const [initializationCompleted, setInitializationCompleted] = useState(false);
  const [webviewURL, setWebviewURL] = useState(0);

  // console.log(
  //   `https://cdn.plaid.com/link/v2/stable/link.html?isWebview=true&token=${linkToken}`,
  // );

  const script = `
  window.localStorage.setItem("link_token_value", '${linkToken}');
  `;

  const INJECTED_JAVASCRIPT = `(function() {
    window.postMessage({link_token : "${linkToken}"});
})();`;

  const handleNavigationStateChange = event => {
    // console.log(`eventURL::: ${event.url}`);
    if (
      event.url.indexOf(
        'http://ec2-54-245-202-115.us-west-2.compute.amazonaws.com',
      ) !== -1
    ) {
      // console.log('handleNavigationStateChange==== ');
      setWebviewURL(event.url);
      setInitializationCompleted(true);
    }

    if (event.url.startsWith('plaidlink://')) {
      const eventParams = queryString.parse(event.url.replace(/.*\?/, ''));

      const linkSessionId = eventParams.link_session_id;
      const mfaType = eventParams.mfa_type;
      const requestId = eventParams.request_id;
      const viewName = eventParams.view_name;
      const errorCode = eventParams.error_code;
      const errorMessage = eventParams.error_message;
      const errorType = eventParams.error_type;
      const exitStatus = eventParams.exist_status;
      const institutionId = eventParams.institution_id;
      const institutionName = eventParams.institution_name;
      const institutionSearchQuery = eventParams.institution_search_query;
      const timestamp = eventParams.timestamp;

      if (event.url.startsWith('plaidlink://event') && onEvent) {
        onEvent({
          eventName: eventParams.event_name,
          metadata: {
            linkSessionId,
            mfaType,
            requestId,
            viewName,
            errorCode,
            errorMessage,
            errorType,
            exitStatus,
            institutionId,
            institutionName,
            institutionSearchQuery,
            timestamp,
          },
        });
      } else if (event.url.startsWith('plaidlink://exit') && onExit) {
        onExit({
          error: {
            errorCode: LinkErrorCode[errorCode],
            errorMessage: eventParams.error_message,
            errorType: LinkErrorType[errorType],
          },
          metadata: {
            status: LinkExitMetadataStatus[exitStatus],
            institution: {
              id: institutionId,
              name: institutionName,
            },
            linkSessionId,
            requestId,
          },
        });
      } else if (event.url.startsWith('plaidlink://connected') && onSuccess) {
        // console.log('Success Fully linked plaid account');

        const publicToken = eventParams.public_token;
        const accounts = JSON.parse(eventParams.accounts);
        onSuccess({
          publicToken,
          metadata: {
            institution: {
              id: institutionId,
              name: institutionName,
            },
            accounts,
            linkSessionId,
          },
        });
      }
      return false;
    }
    return true;
  };

  return (
    <PopUpGeneral
      onDismiss={onExit}
      visible={visible}
      contentExtra={
        <View
          h={SCREEN_HEIGHT - (80 + Constants.statusBarHeight + keyboardHeight)}>
          <TouchableOpacity
            onPress={() => {
              setDisplayPlaidPopup(false);
            }}>
            <Text
              style={{
                textAlign: 'right',
                color: '#7c7c7c',
                marginRight: '5%',
                fontSize: 25,
              }}>
              x
            </Text>
          </TouchableOpacity>

          {
            <WebView
              source={{
                uri: `https://cdn.plaid.com/link/v2/stable/link.html?isWebview=true&token=${linkToken}`,
              }}
              javaScriptEnabled={true}
              style={{ zIndex: 100000 }}
              ref={ref => (webviewRef = ref)}
              startInLoadingState={true}
              onMessage={event => {
                const data = event.nativeEvent.data;
                // console.log(data);
              }}
              injectedJavaScript={INJECTED_JAVASCRIPT}
              onError={() => webviewRef.reload()}
              originWhitelist={['https://*', 'plaidlink://*']}
              onShouldStartLoadWithRequest={handleNavigationStateChange}
            />
          }
        </View>
      }
    />
  );
}

export const LinkEventName = {
  CLOSE_OAUTH: 'close_oauth',
  ERROR: 'error',
  EXIT: 'exit',
  FAIL_OAUTH: 'fail_oauth',
  HANDOFF: 'handoff',
  MATCHED_CONSENT: 'matched_consent',
  MATCHED_SELECT_INSTITUTION: 'matched_select_institution',
  OPEN: 'open',
  OPEN_MY_PLAID: 'open_my_plaid',
  OPEN_OAUTH: 'open_oauth',
  SEARCH_INSTITUTION: 'search_institution',
  SELECT_INSTITUTION: 'select_institution',
  SUBMIT_CREDENTIALS: 'submit_credentials',
  SUBMIT_MFA: 'submit_mfa',
  TRANSITION_VIEW: 'transition_view',
};

export const LinkExitMetadataStatus = {
  CONNECTED: 'connected',
  CHOOSE_DEVICE: 'choose_device',
  REQUIRES_CODE: 'requires_code',
  REQUIRES_CREDENTIALS: 'requires_credentials',
  REQUIRES_EXTERNAL_ACTION: 'requires_external_action',
  REQUIRES_OAUTH: 'requires_oauth',
  REQUIRES_QUESTIONS: 'requires_questions',
  REQUIRES_RECAPTCHA: 'requires_recaptcha',
  REQUIRES_SELECTIONS: 'requires_selections',
  REQUIRES_DEPOSIT_SWITCH_ALLOCATION_CONFIGURATION:
    'requires_deposit_switch_allocation_configuration',
  REQUIRES_DEPOSIT_SWITCH_ALLOCATION_SELECTION:
    'requires_deposit_switch_allocation_selection',
};

export const LinkErrorCode = {
  // ITEM_ERROR
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_MFA: 'INVALID_MFA',
  ITEM_LOGIN_REQUIRED: 'ITEM_LOGIN_REQUIRED',
  INSUFFICIENT_CREDENTIALS: 'INSUFFICIENT_CREDENTIALS',
  ITEM_LOCKED: 'ITEM_LOCKED',
  USER_SETUP_REQUIRED: 'USER_SETUP_REQUIRED',
  MFA_NOT_SUPPORTED: 'MFA_NOT_SUPPORTED',
  INVALID_SEND_METHOD: 'INVALID_SEND_METHOD',
  NO_ACCOUNTS: 'NO_ACCOUNTS',
  ITEM_NOT_SUPPORTED: 'ITEM_NOT_SUPPORTED',
  INVALD_UPDATED_USERNAME: 'INVALD_UPDATED_USERNAME',
  ITEM_NO_ERROR: 'ITEM_NO_ERROR',
  NO_AUTH_ACCOUNTS: 'NO_AUTH_ACCOUNTS',
  NO_INVESTMENT_ACCOUNTS: 'NO_INVESTMENT_ACCOUNTS',
  NO_INVESTMENT_AUTH_ACCOUNTS: 'NO_INVESTMENT_AUTH_ACCOUNTS',
  NO_LIABILITY_ACCOUNTS: 'NO_LIABILITY_ACCOUNTS',
  PRODUCTS_NOT_SUPPORTED: 'PRODUCTS_NOT_SUPPORTED',
  ITEM_NOT_FOUND: 'ITEM_NOT_FOUND',
  ITEM_PRODUCT_NOT_READY: 'ITEM_PRODUCT_NOT_READY',

  // INSTITUTION_ERROR
  INSTITUTION_DOWN: 'INSTITUTION_DOWN',
  INSTITUTION_NOT_RESPONDING: 'INSTITUTION_NOT_RESPONDING',
  INSTITUTION_NOT_AVAILABLE: 'INSTITUTION_NOT_AVAILABLE',
  INSTITUTION_NO_LONGER_SUPPORTED: 'INSTITUTION_NO_LONGER_SUPPORTED',

  // API_ERROR
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  PLANNED_MAINTENANCE: 'PLANNED_MAINTENANCE',

  // ASSET_REPORT_ERROR
  PRODUCT_NOT_ENABLED: 'PRODUCT_NOT_ENABLED',
  DATA_UNAVAILABLE: 'DATA_UNAVAILABLE',
  ASSET_PRODUCT_NOT_READY: 'ASSET_PRODUCT_NOT_READY',
  ASSET_REPORT_GENERATION_FAILED: 'ASSET_REPORT_GENERATION_FAILED',
  INVALID_PARENT: 'INVALID_PARENT',
  INSIGHTS_NOT_ENABLED: 'INSIGHTS_NOT_ENABLED',
  INSIGHTS_PREVIOUSLY_NOT_ENABLED: 'INSIGHTS_PREVIOUSLY_NOT_ENABLED',

  // BANK_TRANSFER_ERROR
  BANK_TRANSFER_LIMIT_EXCEEDED: 'BANK_TRANSFER_LIMIT_EXCEEDED',
  BANK_TRANSFER_MISSING_ORIGINATION_ACCOUNT:
    'BANK_TRANSFER_MISSING_ORIGINATION_ACCOUNT',
  BANK_TRANSFER_INVALID_ORIGINATION_ACCOUNT:
    'BANK_TRANSFER_INVALID_ORIGINATION_ACCOUNT',
  BANK_TRANSFER_ACCOUNT_BLOCKED: 'BANK_TRANSFER_ACCOUNT_BLOCKED',
  BANK_TRANSFER_INSUFFICIENT_FUNDS: 'BANK_TRANSFER_INSUFFICIENT_FUNDS',
  BANK_TRANSFER_NOT_CANCELLABLE: 'BANK_TRANSFER_NOT_CANCELLABLE',
  BANK_TRANSFER_UNSUPPORTED_ACCOUNT_TYPE:
    'BANK_TRANSFER_UNSUPPORTED_ACCOUNT_TYPE',
  BANK_TRANSFER_UNSUPPORTED_ENVIRONMENT:
    'BANK_TRANSFER_UNSUPPORTED_ENVIRONMENT',

  // SANDBOX_ERROR
  SANDBOX_PRODUCT_NOT_ENABLED: 'SANDBOX_PRODUCT_NOT_ENABLED',
  SANDBOX_WEBHOOK_INVALID: 'SANDBOX_WEBHOOK_INVALID',
  SANDBOX_BANK_TRANSFER_EVENT_TRANSITION_INVALID:
    'SANDBOX_BANK_TRANSFER_EVENT_TRANSITION_INVALID',

  // INVALID_REQUEST
  MISSING_FIELDS: 'MISSING_FIELDS',
  UNKNOWN_FIELDS: 'UNKNOWN_FIELDS',
  INVALID_FIELD: 'INVALID_FIELD',
  INCOMPATIBLE_API_VERSION: 'INCOMPATIBLE_API_VERSION',
  INVALID_BODY: 'INVALID_BODY',
  INVALID_HEADERS: 'INVALID_HEADERS',
  NOT_FOUND: 'NOT_FOUND',
  NO_LONGER_AVAILABLE: 'NO_LONGER_AVAILABLE',
  SANDBOX_ONLY: 'SANDBOX_ONLY',
  INVALID_ACCOUNT_NUMBER: 'INVALID_ACCOUNT_NUMBER',

  // INVALID_INPUT
  // From above ITEM_LOGIN_REQUIRED:  "INVALID_CREDENTIALS",
  INCORRECT_DEPOSIT_AMOUNTS: 'INCORRECT_DEPOSIT_AMOUNTS',
  UNAUTHORIZED_ENVIRONMENT: 'UNAUTHORIZED_ENVIRONMENT',
  INVALID_PRODUCT: 'INVALID_PRODUCT',
  UNAUTHORIZED_ROUTE_ACCESS: 'UNAUTHORIZED_ROUTE_ACCESS',
  DIRECT_INTEGRATION_NOT_ENABLED: 'DIRECT_INTEGRATION_NOT_ENABLED',
  INVALID_API_KEYS: 'INVALID_API_KEYS',
  INVALID_ACCESS_TOKEN: 'INVALID_ACCESS_TOKEN',
  INVALID_PUBLIC_TOKEN: 'INVALID_PUBLIC_TOKEN',
  INVALID_LINK_TOKEN: 'INVALID_LINK_TOKEN',
  INVALID_PROCESSOR_TOKEN: 'INVALID_PROCESSOR_TOKEN',
  INVALID_AUDIT_COPY_TOKEN: 'INVALID_AUDIT_COPY_TOKEN',
  INVALID_ACCOUNT_ID: 'INVALID_ACCOUNT_ID',

  // INVALID_RESULT
  PLAID_DIRECT_ITEM_IMPORT_RETURNED_INVALID_MFA:
    'PLAID_DIRECT_ITEM_IMPORT_RETURNED_INVALID_MFA',

  // RATE_LIMIT_EXCEEDED
  ACCOUNTS_LIMIT: 'ACCOUNTS_LIMIT',
  ADDITION_LIMIT: 'ADDITION_LIMIT',
  AUTH_LIMIT: 'AUTH_LIMIT',
  BALANCE_LIMIT: 'BALANCE_LIMIT',
  IDENTITY_LIMIT: 'IDENTITY_LIMIT',
  ITEM_GET_LIMIT: 'ITEM_GET_LIMIT',
  RATE_LIMIT: 'RATE_LIMIT',
  TRANSACTIONS_LIMIT: 'TRANSACTIONS_LIMIT',

  // RECAPTCHA_ERROR
  RECAPTCHA_REQUIRED: 'RECAPTCHA_REQUIRED',
  RECAPTCHA_BAD: 'RECAPTCHA_BAD',

  // OAUTH_ERROR
  INCORRECT_OAUTH_NONCE: 'INCORRECT_OAUTH_NONCE',
  OAUTH_STATE_ID_ALREADY_PROCESSED: 'OAUTH_STATE_ID_ALREADY_PROCESSED',
};

export const LinkErrorType = {
  BANK_TRANSFER: 'BANK_TRANSFER_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  INVALID_RESULT: 'INVALID_RESULT',
  INVALID_INPUT: 'INVALID_INPUT',
  INSTITUTION_ERROR: 'INSTITUTION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  API_ERROR: 'API_ERROR',
  ITEM_ERROR: 'ITEM_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  ASSET_REPORT_ERROR: 'ASSET_REPORT_ERROR',
  SANDBOX_ERROR: 'SANDBOX_ERROR',
  RECAPTCHA_ERROR: 'RECAPTCHA_ERROR',
  OAUTH_ERROR: 'OAUTH_ERROR',
};

const LinkAccountType = {
  CREDIT: 'credit',
  DEPOSITORY: 'depository',
  INVESTMENT: 'investment',
  LOAN: 'loan',
  OTHER: 'other',
};

const LinkAccountSubtypes = {
  ALL: 'all',
  CREDIT_CARD: 'credit card',
  PAYPAL: 'paypal',
  AUTO: 'auto',
  BUSINESS: 'business',
  COMMERCIAL: 'commercial',
  CONSTRUCTION: 'construction',
  CONSUMER: 'consumer',
  HOME_EQUITY: 'home equity',
  LINE_OF_CREDIT: 'line of credit',
  LOAN: 'loan',
  MORTGAGE: 'mortgage',
  OVERDRAFT: 'overdraft',
  STUDENT: 'student',
  CASH_MANAGEMENT: 'cash management',
  CD: 'cd',
  CHECKING: 'checking',
  EBT: 'ebt',
  HSA: 'hsa',
  MONEY_MARKET: 'money market',
  PREPAID: 'prepaid',
  SAVINGS: 'savings',
  FOUR_0_1_A: '401a',
  FOUR_0_1_K: '401k',
  FOUR_0_3_B: '403B',
  FOUR_5_7_B: '457b',
  FIVE_2_9: '529',
  BROKERAGE: 'brokerage',
  CASH_ISA: 'cash isa',
  EDUCATION_SAVINGS_ACCOUNT: 'education savings account',
  FIXED_ANNUNITY: 'fixed annuity',
  GIC: 'gic',
  HEALTH_REIMBURSEMENT_ARRANGEMENT: 'health reimbursement arrangement',
  IRA: 'ira',
  ISA: 'isa',
  KEOGH: 'keogh',
  LIF: 'lif',
  LIRA: 'lira',
  LRIF: 'lrif',
  LRSP: 'lrsp',
  MUTUAL_FUND: 'mutual fund',
  NON_TAXABLE_BROKERAGE_ACCOUNT: 'non-taxable brokerage account',
  PENSION: 'pension',
  PLAN: 'plan',
  PRIF: 'prif',
  PROFIT_SHARING_PLAN: 'profit sharing plan',
  RDSP: 'rdsp',
  RESP: 'resp',
  RETIREMENT: 'retirement',
  RLIF: 'rlif',
  ROTH_401K: 'roth 401k',
  ROTH: 'roth',
  RRIF: 'rrif',
  RRSP: 'rrsp',
  SARSEP: 'sarsep',
  SEP_IRA: 'sep ira',
  SIMPLE_IRA: 'simple ira',
  SIPP: 'sipp',
  STOCK_PLAN: 'stock plan',
  TFSA: 'tfsa',
  THRIFT_SAVINGS_PLAN: 'thrift savings plan',
  TRUST: 'trust',
  UGMA: 'ugma',
  UTMA: 'utma',
  VARIABLE_ANNUITY: 'variable annuity',
};

export const LinkAccountVerificationStatus = {
  PENDING_AUTOMATIC_VERIFICATION: 'pending_automatic_verification',
  PENDING_MANUAL_VERIFICATION: 'pending_manual_verification',
  MANUALLY_VERIFIED: 'manually_verified',
};
