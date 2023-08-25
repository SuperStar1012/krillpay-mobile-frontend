import React from 'react';
import * as yup from 'yup';

import RedeemVoucherForm from './RedeemVoucherForm';
import RedeemVoucherHeader from './RedeemVoucherHeader';
import RedeemVoucherDetails from './RedeemVoucherDetails';
import {
  createManagerRedemption,
  verifyManagerVoucherCode,
} from 'utility/rehive';
import { useRehive } from 'hooks/rehive';
import { redeemVoucher } from 'config/inputs';
import { Formik } from 'formik';
import { useRehiveContext } from 'contexts';

async function fetchVoucher(props) {
  const { formikProps, context, setLoading, code: codeOveride } = props;
  const { seller } = context;
  const { values, setStatus, setFieldValue } = formikProps;
  let { code } = values;
  if (!code && codeOveride) code = codeOveride;
  if (code) {
    try {
      const resp = await verifyManagerVoucherCode(seller?.id, { code });
      if (resp.status === 'purchased') {
        setFieldValue('voucher', resp);
      } else {
        setStatus({
          error: 'unable_to_redeem_voucher_error',
        });
      }
    } catch (error) {
      setStatus({
        error: 'unable_to_redeem_voucher_error',
      });
      console.log('fetchVoucher -> error', error);
    }
  } else {
    setStatus({
      error: 'unable_to_redeem_voucher_error',
    });
  }
  setLoading(false);
}

async function handleConfirm(props) {
  const { formikProps, context } = props;
  const { seller } = context;
  const { values, setStatus } = formikProps; // FormikProps
  let { code, voucher } = values;

  if (voucher && voucher.id) {
    try {
      const resp = await createManagerRedemption(seller?.id, { code });
      if (resp.status === 'Complete') {
        setStatus({ result: resp });
      } else {
        setStatus({
          error: 'unable_to_redeem_voucher_error',
        });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    setStatus({ error: 'unable_to_redeem_voucher_error' });
  }
}
const initialValues = { code: '', voucher: null };

const config = {
  id: 'redeem_voucher',
  onSubmit: handleConfirm,
  onConfirmLoad: fetchVoucher,

  configs: {
    post: {
      header: RedeemVoucherHeader,
      detail: RedeemVoucherDetails,
    },
    // confirm: {

    // }
    form: {
      fields: [redeemVoucher.code],
      initialValues,
      validationSchema: yup.object().shape({
        code: yup.string().required('Voucher code is required'),
      }),
    },
  },
};

function RedeemVoucherScreen(props) {
  const { context } = props;

  return (
    <Formik initialValues={initialValues}>
      {formikProps => (
        <RedeemVoucherForm
          {...props}
          config={config}
          context={context}
          formikProps={formikProps}
        />
      )}
    </Formik>
  );
}

export default RedeemVoucherScreen;
