import { setConversionSettings } from 'utility/rehive';
import { fetchData } from 'utility/data/actions';
import Detail from '../../components/inputs/DisplayCurrency';

const formConfig = props => {
  const { reduxContext: context = {} } = props;
  const { displayCurrency } = context;

  return {
    defaultValues: { displayCurrency: displayCurrency?.code },
    submitLabel: 'SAVE',
    title: 'displayCurrency',
    image: 'displayCurrency',
    // inputComponents: Inputs,
    onSubmit,
    fields: ['displayCurrency'],
  };
};

async function onSubmit(values, control, props) {
  const { dispatch, showToast, history } = props;
  const { setSubmitting, reset, setError } = control;
  const { displayCurrency = {} } = values;
  const display_currency = displayCurrency?.code ?? displayCurrency;

  const resp = await setConversionSettings({ display_currency });
  if (resp.status === 'success') {
    showToast({ id: `display_currency_update_success` });
    dispatch(fetchData('displayCurrency'));
    history.push('/settings/');
  } else {
    reset();
    setError('displayCurrency', {
      type: 'custom',
      message: resp?.message ?? 'Unable to update display currency',
    });

    showToast({ id: `display_currency_update_fail` });
  }

  if (typeof setSubmitting === 'function') setSubmitting(false);
}

export default {
  title: 'Display currency',
  variant: 'form',
  type: 'displayCurrency',
  renderDetail: Detail,
  configs: {
    form: formConfig,
    // list: {
    //   title: 'displayCurrency',
    //   image: 'displayCurrency',
    // },
  },
};
