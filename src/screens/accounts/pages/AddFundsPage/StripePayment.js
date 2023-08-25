import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { setupStripeSession, getStripeCompany } from 'utility/rehive';
import { Spinner } from 'components';
import { useTheme } from 'components/context';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { useCompany } from 'contexts/CompanyContext';

const StripePayment = props => {
  const { handleWebBrowser } = props;
  const { company: client } = useCompany();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { colors } = useTheme();
  const { primary } = colors;
  const success_url = client.website + '/publicStripeRedirectPage/success';
  const cancel_url = client.website + '/publicStripeRedirectPage/fail';
  const redirectProps = { success_url, cancel_url };

  useEffect(() => {
    async function handleNewCard() {
      let stripeId = '';
      let sessionId = '';
      const resp = await setupStripeSession(redirectProps);
      const resp2 = await getStripeCompany();

      if (resp2.status === 'success' && resp2.status === 'success') {
        sessionId = get(resp, ['data', 'id']);
        stripeId = get(resp2, ['data', 'stripe_publishable_api_key']);
        if (sessionId && stripeId) {
          let url =
            client.website +
            `/publicStripeRedirectPage/?stripeId=${stripeId}&sessionId=${sessionId}&color=${primary.substring(
              1,
            )}`;

          handleWebBrowser(url);
        } else {
          setError('Unable to connect to Stripe, please try again later');
        }
      } else {
        setError('Unable to connect to Stripe, please try again later');
      }
      setLoading(false);
    }
    handleNewCard();
  }, []);

  return loading && !error ? <Spinner /> : <ErrorOutput>{error}</ErrorOutput>;
};

// const getCurrencyDetails = currency => {
//   const accountRef = get(currency, ['account']);
//   const accountName = get(currency, ['account_name']);
//   const currencyCode = get(currency, ['currency', 'code']);
//   return { accountRef, currencyCode, accountName };
// };

// const StripePayment = props => {
//   const { currency } = props;
//   const { accountName, currencyCode } = getCurrencyDetails(currency);

//   const success_url =
//     client.url +
//     '/accounts/' +
//     accountName +
//     '/' +
//     currencyCode +
//     '/prepaid/success';
//   const cancel_url =
//     client.url +
//     '/accounts/' +
//     accountName +
//     '/' +
//     currencyCode +
//     '/prepaid/fail';
//   const redirectProps = { success_url, cancel_url };
//   const [stripeSession, setStripeSession] = useState(null);
//   const [stripeCompany, setStripeCompany] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { colors } = useTheme();
//   const { primary } = colors;

//   const onSuccessHandler = () => {
//     console.log('success');
//   };
//   const onCanceledHandler = () => {
//     console.log('cancel');
//   };

//   // Called everytime the URL stats to load in the webview
//   function onLoadStart(syntheticEvent) {
//     const { nativeEvent } = syntheticEvent;
//     if (nativeEvent.url.includes('success')) {
//       onSuccessHandler();
//       return;
//     }
//     if (nativeEvent.url.includes('fail')) {
//       onCanceledHandler();
//     }
//   }

//   useEffect(() => {
//     async function handleNewCard() {
//       setLoading(true);
//       const resp = await setupStripeSession(redirectProps);
//       const resp2 = await getStripeCompany();
//       if (resp.status === 'success' && resp.data) {
//         setStripeSession(resp.data);
//       }
//       if (resp2.status === 'success' && resp2.data) {
//         setStripeCompany(resp2.data);
//       }
//       // try {
//       //   let result = await stripe.redirectToCheckout({
//       //     sessionId: get(temp, ['data', 'id']),
//       //   });
//       //   console.log('handleNewCard -> result', result);
//       // } catch (e) {
//       //   setError('Unable to connect to Stripe, please try again later');
//       // }
//       setLoading(false);
//     }
//     // return () => {
//     //   cleanup
//     // }
//     handleNewCard();
//   }, []);

//   const showWebview = Boolean(stripeCompany) && Boolean(stripeSession);

//   const stripeId = get(stripeCompany, 'stripe_publishable_api_key');
//   const sessionId = get(stripeSession, 'id');

//   const injectedJavaScript = `
//       var stripe = window.Stripe('${stripeId}');
//       stripe.redirectToCheckout({${sessionId}})
//       .then(function (result) {
//         window.ReactNativeWebView.postMessage('stripe', "*");
//         if (result.error) {
//         }
//       });
//       window.ReactNativeWebView.postMessage('stripe', "*");
//   `;
//   // window.onload = function () {
//   //   stripe.redirectToCheckout({${sessionId}})
//   //     .then(function (result) {
//   //       console.log(result)
//   //       if (result.error) {
//   //       }
//   //     });
//   // }

//   return loading && !showWebview ? (
//     <Spinner />
//   ) : (
//     <WebView
//       injectedJavaScript={injectedJavaScript}
//       onMessage={event => {
//         const { data } = event.nativeEvent;
//         console.log(data);
//       }}
//       onError={event => console.log('onError', event)}
//       style={{
//         zIndex: 50,
//         height: '100%',
//         minHeight: SCREEN_HEIGHT - 150,
//         width: '100%',
//         // flex: 1,
//         backgroundColor: 'orange',
//       }}
//       // sharedCookiesEnabled
//       originWhitelist={['*']}
//       source={{
//         uri: `http://localhost:3000/publicStripeRedirectPage/
//           ?stripeId=${stripeId}
//           &sessionId=${sessionId}
//           &color=${primary}`,
//       }}
//       // onLoadStart={onLoadStart}
//       // onLoad={event => console.log('onLoad', event.nativeEvent)}
//     />
//   );
//   // stripeCheckoutRedirectHTML(
//   //   get(stripeCompany, 'stripe_publishable_api_key'),
//   //   get(stripeSession, 'id'),
//   // ),
// };

export default StripePayment;

// function stripeCheckoutRedirectHTML(stripeId, sessionId) {
//   // console.log('stripeCheckoutRedirectHTML -> sessionId', sessionId);
//   // console.log('stripeCheckoutRedirectHTML -> stripeId', stripeId);
//   if (!stripeId || !sessionId) {
//     throw new Error('Invalid');
//   }

//   return `
//   <html>
//     <body>
//       <!-- Load Stripe.js on your website. -->
//       <script src="https://js.stripe.com/v3"></script>
//       <h1>Loading...</h1>
//       <div id="error-message"></div>
//       <div >${stripeId}</div>
//       <div >${sessionId}</div>
//     </body>
//   </html>
//   `;
// }
{
  /* <script>
(function () {
  var stripe = Stripe('${stripeId}');
  window.onload = function () {
    stripe.redirectToCheckout({${sessionId},
    })
      .then(function (result) {
        console.log(result)
        if (result.error) {
          var displayError = document.getElementById('error-message');
          displayError.textContent = result.error.message;
        }
      });
  };
})();
</script> */
}

{
  /* <script>
var stripe = window.Stripe('${stripeId}');
window.ReactNativeWebView.postMessage(stripe, "*");
stripe.redirectToCheckout({${sessionId},
})
  .then(function (result) {
    window.ReactNativeWebView.postMessage(result)
    if (result.error) {
      var displayError = document.getElementById('error-message');
      displayError.textContent = result.error.message;
    }
  });
};
</script> */
}
