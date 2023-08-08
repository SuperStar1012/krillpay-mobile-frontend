import { setActiveCurrency } from 'utility/rehive';
// import { fetchAccounts } from 'screens/accounts/redux/actions';
import Detail from '../../components/inputs/PrimaryCurrency';

const formConfig = props => {
  const { reduxContext: context = {} } = props;
  const { primaryCurrency } = context;

  return {
    defaultValues: { primaryCurrency: primaryCurrency?.primary?.code },
    submitLabel: 'SAVE',
    title: 'primaryCurrency',
    image: 'primaryCurrency',
    // inputComponents: Inputs,
    onSubmit,
    fields: ['primaryCurrency'],
  };
};

async function onSubmit(values, control, props) {
  const { dispatch, showToast, history, context = {} } = props;
  const { setSubmitting, reset, setError } = control;
  const { primaryCurrency = {} } = values;
  const currency = primaryCurrency?.code ?? primaryCurrency;

  try {
    const resp = await setActiveCurrency(
      context?.primaryCurrency?.primary?.account,
      currency,
    );
    showToast({ id: `primary_currency_update_success` });
    // dispatch(fetchAccounts());
    history.push('/settings/');
  } catch (e) {
    reset();
    setError('primaryCurrency', {
      type: 'custom',
      message: e?.message ?? 'Unable to update primary currency',
    });

    showToast({ id: `primary_currency_update_fail` });
  }

  if (typeof setSubmitting === 'function') setSubmitting(false);
}

export default {
  title: 'primaryCurrency',
  variant: 'form',
  redux: 'primaryCurrency',
  renderDetail: Detail,
  image: 'primaryCurrency',
  // configs: {
  //   form: formConfig,
  // },
};
