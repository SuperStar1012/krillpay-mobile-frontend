import React, { useState, useEffect } from 'react';
import { Text, View, Button } from 'components';
import Image from 'components/images/plaid.svg';
import {
  createWyrePaymentMethod,
  exchangeWyrePublicToken,
  exchangePlaidPublicToken,
  getAccountInformation,
  createWyreLinkToken,
  updateItem,
  getWyreUser,
} from 'utility/rehive';
import { useToast, useRehiveContext } from 'contexts';
import { useQuery } from 'react-query';
import PlaidLink from './PlaidLink';
import ErrorPage from 'components/page/SuccessPage';
import { plaid_client_id, plaid_client_secret, plaid_base_url_sandbox } from '../../../env';

export default function WyreAddBankAccount(props) {
  const {
    context = {},
    onSuccess,
    onBack,
    isOnboardingComplete = true, 
    reducedHeight,
  } = props;

  const { data: wyreUserData, isLoading: loadingWyreAccounts } = useQuery(
    [user?.id, 'wyre-user'],
    getWyreUser,
    {
      enabled: !context?.wyreUser,
    },
  );
  const { wyreUser = wyreUserData?.data } = context;

  const id = wyreUser?.item?.id ?? wyreUser?.id ?? '';

  const { showToast } = useToast();
  const {
    context: { user },
    methods: { refreshUser, refreshTier },
  } = useRehiveContext();

  useEffect(() => {
    refreshUser();
    generateTokenLink();
  }, []);
  const [state, setState] = useState('');
  const [linkTokenValue, setLinkTokenValue] = useState('');
  const [displayPlaidPopUp, setDisplayPlaidPopup] = useState(true);

  const [bankAccountInfoPlaid, setBankAccountInfoPlaid] = useState('');

  const [visibility, setVisibility] = useState(true);

  const {
    data: linkTokenData,
    isLoading: loadingLinkToken,
    error,
  } = useQuery(['wyre-link-token', id], createWyreLinkToken, {
    enabled: !!id,
    retry: 1,
  });
  const linkToken = linkTokenData?.link_token;

  function handleError(text) {
    showToast({
      variant: 'error',
      id: 'wyre_add_bank_account_error',
      text,
    });
    typeof onBack === 'function' && onBack();
  }

  async function handlePaymentMethodCreate(public_token, account, institution) {
   //  account_id: account?.id ?? account?._id,
    const data = {
      "client_id":plaid_client_id,
      "secret":plaid_client_secret,
      "public_token":public_token
    }; 
  
   
     const exchangeTokenResp = await exchangePlaidPublicToken({
      id,
      data,
    });
    
    console.log(`exchangeTokenResp==== ${JSON.stringify(exchangeTokenResp)}`);
    if (exchangeTokenResp?.access_token !=="" && exchangeTokenResp?.access_token !== null ) {
      const data = {
        type: 'LOCAL_TRANSFER',
        processor_token: exchangeTokenResp?.access_token, //exchangeTokenResp?.data?.processor_token,
        institution_id: institution?.id,
        institution_name: institution?.name,
      };

       /*const paymentMethodResp = await createWyrePaymentMethod({
        id,
        data,
      });
      console.log("creating payment method for::: ",id, "and ",data)
      */

     const plaidResponseData =  {
        "client_id": plaid_client_id,
        "secret": plaid_client_secret,
        "access_token": exchangeTokenResp?.access_token
      }

      
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      let raw = JSON.stringify(plaidResponseData);
      let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      fetch(`${plaid_base_url_sandbox}/auth/get`, requestOptions)
        .then(response => response.text())
        .then(result => {
          let parseResult = JSON.parse(result);
          console.log(`result******:::::`, JSON.stringify(result));
          //onSuccess();
          setBankAccountInfoPlaid(result)

          //store in database 
          
          
          //Store account details in database 
          let dataBank =  {
            "name": parseResult.accounts[0].name,
            "number": parseResult.numbers.ach[0].account,
            "type":  parseResult.accounts[0].type,
            "bank_name": parseResult.accounts[0].name,
            "bank_code": "",
            "branch_code": "",
            "swift": parseResult.numbers.ach[0].routing,
            "iban": "",
            "line_1": "",
            "line_2": "",
            "city": "",
            "state_province": "",
            "country": "",
            "postal_code": "",
            "branch_address": {
              "name": "",
              "number": parseResult.numbers.ach[0].account,
              "type": parseResult.accounts[0].type,
              "bank_name":  parseResult.accounts[0].name,
              "bank_code": "",
              "branch_code": "",
              "swift": parseResult.numbers.ach[0].routing,
              "iban": "",
              "currencies": [],
              "line_1": exchangeTokenResp?.access_token,
              "line_2": parseResult.accounts[0].account_id,
              "city": "",
              "state_province": "",
              "country": "",
              "postal_code": ""
            }
          }
         const resp =  updateItem('bank_account', dataBank);
         console.log(`Bank account added`, JSON.stringify(resp));
         onSuccess();
         refreshTier();
          
        })
        .catch(error => console.log('error', error));

       


     
      
      
      if (paymentMethodResp?.status === 'success') {
        refreshTier();
        setState('');
        typeof onSuccess === 'function'
          ? onSuccess()
          : typeof onBack === 'function' && onBack();
      } else handleError(paymentMethodResp?.message);
    } else handleError(exchangeTokenResp?.message);
  } 

  function generateTokenLink() {

    //console.log(`user.id`);
    //TODO:: Edit once gotten prod.
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    let raw = JSON.stringify({
      client_id: plaid_client_id,
      secret: plaid_client_secret, 
      user: { client_user_id: user.id },
      client_name: 'KrillPay',
      products: ['auth','transactions','identity'],
      country_codes: ['US'],
      language: 'en',
      webhook: 'https://ec2-54-245-202-115.us-west-2.compute.amazonaws.com/', //change this later
      redirect_uri: 'https://ec2-54-245-202-115.us-west-2.compute.amazonaws.com/',
    });
    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow', 
    };
    fetch(`${plaid_base_url_sandbox}/link/token/create`, requestOptions)
      .then(response => response.text())
      .then(result => setLinkTokenValue(JSON.parse(result).link_token))
      .catch(error => console.log('error', error));
  }

  function handlePlaidRedirect() {
    if (!linkToken) {
      const error = user?.metadata?.service_wyre?.account_create_error ?? '';
      showToast({ variant: 'error', text: error });
    } else if (isOnboardingComplete) setState('plaid');
    else showToast({ variant: 'error', id: 'unable_to_skip_onboarding' });
  }

  function handleEvent(event) {
    console.log(`handleEvent ${JSON.stringify(event)}`);

    if (event?.eventName === 'EXIT') handleExit(event);
    else if (event?.publicToken) handleSuccess(event);
    // else console.log('handleEvent -> event', event);
  }
  function handleExit(event) {
    setState('');
  }

  function handleSuccess(event) {
     handlePaymentMethodCreate(
      event?.publicToken,
      event?.metadata?.accounts?.[0],
      event?.metadata?.institution,
    );
  }

  const isLoading = loadingLinkToken || !linkToken || loadingWyreAccounts;

  return (
    <View
      aI="center"
      w="100%"
      pb={1}
      ph={reducedHeight || error ? 0 : 0.5}
      f={1}>
      <React.Fragment>
        {/*error ? (
          <View w="100%">
            <ErrorPage
              state="fail"
              bC="white"
              hasResultConfig
              result={{ status: 'error', message: 'could_not_connect_to_wyre' }}
              header={ErrorHeader}
              noButtons
              title="something_went_wrong"
            />
          </View>
        ) : (
          <View pv={1} aI="center">
            <Image {...{ width: 80, height: 80 }} />
            <View pv={2}>
              <Text
                options={{ boldColor: 'primary' }}
                tA="center"
                id="plaid_link_bank_account_text"
              />
            </View>
            <Button
              id="continue_to_plaid"
              wide
              onPress={handlePlaidRedirect}
              loading={isLoading}
            />
          </View> 
        )*/}
        <PlaidLink
          linkToken={linkTokenValue}
          onEvent={handleEvent}
          onExit={handleExit}
          onSuccess={handleSuccess}
          visible={displayPlaidPopUp}
          setDisplayPlaidPopup={setDisplayPlaidPopup}
        />
      </React.Fragment>
    </View>
  );
}

function ErrorHeader() {
  return (
    <View w="100%">
      <Text c="white" id="unable_to_connect_to_wyre" tA="center" />
    </View>
  );
}
