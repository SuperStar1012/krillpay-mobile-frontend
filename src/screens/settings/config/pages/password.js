import { EMPTY_PASSWORD } from 'config/empty';
import { changePassword } from 'utility/rehive';
import { PasswordForm } from '../../components/PasswordForm';

const formConfig = props => {
  const { authConfig = {} } = props?.reduxContext ?? {};
  let fields = ['old_password', 'new_password'];

  if (authConfig.confirm_password) {
    fields.push('new_password2');
  }

  return {
    defaultValues: EMPTY_PASSWORD,
    submitLabel: 'SAVE',
    title: 'password',
    image: 'password',
    onSubmit,
    fields,
  };
};

async function onSubmit(values, control, props) {
  const { reduxData, showToast, history } = props;
  const { setSubmitting, reset, setError } = control;
  const { old_password, new_password1, new_password2 } = values;

  try {
    const data = {
      old_password,
      new_password1,
      new_password2: reduxData?.authConfig?.confirm_password
        ? new_password2
        : new_password1,
    };
    await changePassword(data);
    showToast({ id: `password_update_success` });
    history.push('/settings/');
  } catch ({ message }) {
    reset();
    // setError('old_password', { type: 'custom', message });

    showToast({ id: `password_update_fail` });
  }

  if (typeof setSubmitting === 'function') setSubmitting(false);
}

export default {
  title: 'Change password',
  variant: 'form',
  title: 'password',
  image: 'password',
  renderDetail: PasswordForm,
  // configs: {
  //   form: formConfig,
  //   // form: {
  //   //   title: 'password',
  //   //   image: 'password',
  //   // },
  // },
};
