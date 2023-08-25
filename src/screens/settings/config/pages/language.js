import { setConversionSettings } from 'utility/rehive';
import { fetchData } from 'utility/data/actions';
import Detail from '../../components/inputs/Language';

const formConfig = props => {
  const { reduxContext: context = {} } = props;
  const { displayCurrency } = context;

  return {
    defaultValues: { language: displayCurrency?.code },
    submitLabel: 'update_app_label',
    title: 'select_language',
    image: 'language',
    scrollView: false,
    // inputComponents: Inputs,
    onSubmit,
    fields: ['language'],
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
  title: 'Select language',
  variant: 'form',
  type: 'language',
  renderDetail: Detail,
  configs: {
    form: formConfig,
    // list: {
    //   title: 'displayCurrency',
    //   image: 'displayCurrency',
    // },
  },
};
