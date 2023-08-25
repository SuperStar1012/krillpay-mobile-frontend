// import React, { useState, useEffect } from 'react';
// import { useMachine } from '@xstate/react';
// import Layout from './Layout';
// import PageLayout from '../Page';
// import Toast, { showToast } from 'components/outputs/Toast';
// import Header from './Header';
// import { parseScreenUrl, calculateInvoiceTotal } from 'utility/general';
// import { useForm } from 'react-hook-form';
// import Modal from 'components/layout/Modal';
// import ReceiptPage from 'screens/checkout/pages/ReceiptPage';
// import InvoiceDetails from 'screens/checkout/pages/InvoiceDetails';
// import { dataMachine } from 'utility/machines/DataMachine';
// import { useRef } from 'react';
// import { useDispatch } from 'react-redux';
// import IndexMenu from './IndexMenu';
// import { LanguageContext } from 'contexts/LanguageContext';

// export default function Screen(props) {
//   const { screenConfig, history, onSubmit, reduxContext  } = props;

//   const { pages, variant, defaultPage } = screenConfig;

//   const { location, push } = history;
//   const { search, pathname } = location;
//   let { pageId } = parseScreenUrl(pathname, variant);
//   if (!pageId) pageId = defaultPage;
//   const pageConfig = pages?.[pageId] ?? pages[''] ?? {};

//   // let { pageId, itemId, isEdit, stateId } = parseScreenUrl(pathname);
//   const [isSubmitting, setSubmitting] = useState(false);
//   const {
//     pages,
//     id: screenId,
//     headerVariant,
//     variant,
//     configs,
//     defaultPage,
//     renderScreen,
//   } = screenConfig;
//   const { locales = {} } = configs ?? {};
//   // // console.log('Page -> screenConfig', screenConfig);

//   let {
//     components = {},
//     id,
//     services,
//     filterConfig: filterConfigOverride,
//     redux,
//     variant: pageVariant,
//   } = pageConfig;

//   // const machine = dataMachine(id).withConfig({
//   //   services,
//   //   // : {
//   //   //   ...services,
//   //   //   fetchData: (context, event) =>
//   //   //     services.fetchData(context, event, reduxContext),
//   //   // },
//   // });
//   // const [machineState, send] = useMachine(machine, { devTools: true });
//   const [data, setData] = useState([]); // update this to bing a store
//   // use effect to fetch data && then move this to a hook

//   // const data = reduxContext?.[redux]?.items ?? localData;
//   const { list, form, detail } = components;

//   // const { context = {}, value } = machineState;
//   // const { results } = context;

//   const [modal, setModal] = useState('');
//   const [loading, setLoading] = useState(false);

//   const [item, setItem] = useState(null);
//   // const detailConfig =
//   //   typeof detail === 'function'
//   //     ? detail({ item, context: { ...reduxContext, ...context } })
//   //     : detail;

//   // async function handleFetchItem(refresh) {
//   //   setLoading(refresh);
//   //   const resp = await fetchItem(itemId, props);
//   //   // console.log('handleFetchItem -> resp', resp);
//   //   if (resp?.status === 'success') {
//   //     setItem(resp?.data);
//   //   }
//   //   setLoading(false);
//   // }

//   // useEffect(() => {
//   //   if (itemId && itemId !== item?.id) {
//   //     const tempItem =
//   //       data?.find(item => (item?.id).toString() === itemId) ?? null;
//   //     // console.log('Page -> data', data);
//   //     // console.log('Page -> tempItem', tempItem);
//   //     if (!item) {
//   //       if (tempItem) setItem(tempItem);
//   //       if (typeof fetchItem === 'function')
//   //         handleFetchItem(!Boolean(tempItem));
//   //     } else if (tempItem && tempItem?.updated !== item?.updated) {
//   //       // console.log('Page -> tempItem', tempItem);
//   //       setItem(tempItem);
//   //     }
//   //   } else if (item && !itemId) {
//   //     setItem(null);
//   //   }
//   // }, [data, item, itemId]);

//   // helper functions
//   // function refreshData() {
//   //   send('FETCH');
//   // }

//   const isLoading = loading;// machineState.matches('loading') ||

//   // const formConfig =
//   //   typeof form === 'function'
//   //     ? form({
//   //         ...props,
//   //         ...data,
//   //         context: { data, ...reduxContext, ...context },
//   //         onSubmit: onSubmit ? onSubmit : form.onSubmit,
//   //         item,
//   //       })
//   //     : form ?? {};
//   // console.log('Page -> formConfig', formConfig);
//   // const { defaultValues, mapDefaultValues } = formConfig;
//   // const formMethods = useForm({
//   //   defaultValues,
//   //   mode: 'onChange',
//   //   reValidateMode: 'onChange',
//   //   shouldUnregister: false,
//   // });
//   // const { handleSubmit, setValue, watch, reset, setError } = formMethods;

//   // function resetForm(defaultValues) {
//   //   const temp = defaultValues
//   //     ? defaultValues
//   //     : typeof mapDefaultValues === 'function'
//   //     ? mapDefaultValues(item)
//   //     : item;

//   //   reset(temp);
//   // }

//   // useEffect(() => {
//   //   if (item && itemId) {
//   //     resetForm();
//   //   } else if (stateId.match(/new|add/)) {
//   //     resetForm(defaultValues);
//   //   }
//   // }, [item, pageId, mapDefaultValues, defaultValues, itemId, stateId]);

//   // const values = watch();
//   // const inputPropsControl = { ...formMethods, values }; // ...inputPropsfor

//   // const contentProps = {
//   //   config: listConfig, //TODO: replace this to listConfig
//   //   pageConfig,
//   //   formConfig,
//   //   detailConfig,
//   //   screenConfig,
//   //   component,

//   //   screenId,
//   //   itemId,
//   //   pageId,
//   //   stateId,

//   //   onSuccess: refreshData,
//   //   refreshData,
//   //   refreshItem: handleFetchItem,
//   //   showToast,
//   //   setModal,
//   //   setItem,

//   //   isEdit,
//   //   loading: isLoading,
//   //   item,
//   //   contentVariant,
//   //   pageVariant,

//   //   formMethods,
//   //   values,
//   //   //remove the below and replace with formMethods
//   //   setSubmitting,
//   //   isSubmitting,
//   //   inputPropsControl,
//   //   setValue,
//   //   handleSubmit,
//   //   setError,

//   //   history,

//   //   data,
//   //   items: data,

//   //   context: { ...reduxContext, ...context },
//   //   dispatch,
//   // };

//   // let headerProps = {
//   //   pageConfig,
//   //   screenConfig,
//   //   formConfig,

//   //   config: listConfig,

//   //   component, // rename to config?

//   //   screenId,
//   //   itemId,
//   //   pageId,
//   //   stateId,

//   //   refreshData,
//   //   setModal,
//   //   setSubmitting,
//   //   values,
//   //   setItem,
//   //   isSubmitting,
//   //   showToast,
//   //   filters: {
//   //     filters: {},
//   //     setFilters: '',
//   //     filterConfig,
//   //     initialFilters,
//   //   },
//   //   variant: headerVariant,
//   //   state: machineState,
//   //   pageVariant,
//   //   send,
//   //   isLoading,
//   //   history,
//   //   inputPropsControl,
//   //   onSuccess: refreshData,
//   //   pages,
//   //   item,
//   //   data,
//   //   actions,
//   //   context: { ...reduxContext, ...context },
//   // };

//   //toremove
//   if (renderScreen) return renderScreen({ ...props, ...contentProps });
//   if (screenConfig?.variant === 'indexMenu') {
//     return <IndexMenu {...contentProps} />;
//   }

//   return (
//     <LanguageContext.Provider value={locales}>
//       <Layout
//         // noHeaderPadding
//         // content={<PageLayout {...contentProps} />}
//         // header={
//         //   !variant?.match(/indexMenu|settings/) ? (
//         //     <Header {...headerProps} />
//         //   ) : null
//         // }
//       />
//       <Toast />
//       {/* <Modal
//         fullScreen
//         close
//         backgroundColor="#B7B7B7"
//         maxWidth={10000}
//         open={Boolean(modal)}
//         onDismiss={() => setModal('')}>
//         <Modals id={modal} data={data} item={item} values={values} />
//       </Modal> */}
//     </LanguageContext.Provider>
//   );
// }

// // function Modals(props) {
// //   const { data, id, item, values } = props;
// //   switch (id) {
// //     case 'receipt':
// //       return (
// //         <ReceiptPage
// //           context={{
// //             ...data,
// //             invoice: item,
// //             items: item?.metadata?.service_business?.items,
// //           }}
// //         />
// //       );
// //     case 'preview':
// //       return (
// //         <InvoiceDetails
// //           context={{
// //             ...data,
// //             invoice: item
// //               ? item
// //               : {
// //                   ...values,
// //                   request_currency: data?.business?.currency,
// //                   request_amount: calculateInvoiceTotal(
// //                     values?.products,
// //                     data?.business?.currency?.divisibility,
// //                   ),
// //                 },
// //             items: item?.metadata?.service_business?.items ?? values?.products,
// //           }}
// //         />
// //       );
// //     default:
// //       return null;
// //   }
// // }
