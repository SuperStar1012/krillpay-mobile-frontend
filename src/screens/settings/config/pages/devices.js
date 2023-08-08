import { statusText } from '../../util';
import { getDevices, deleteDevice } from 'utility/rehive';
import Detail from '../../components/Devices';

async function fetchData(cnt, event) {
  try {
    let resp = await getDevices();
    if (resp.status === 'success') {
      return resp?.data;
    }
  } catch (e) {
    console.log('fetchData -> e', e);
  }
}

async function deleteData(props) {
  const { itemId, onSuccess, showToast, setSubmitting } = props;
  if (typeof setSubmitting === 'function') setSubmitting(true);

  try {
    const resp = await deleteDevice(itemId);
    showToast({
      text: 'device_delete_success',
    });
    onSuccess();
  } catch (error) {
    console.log(error);
    showToast({
      text: 'device_delete_failed',
    });
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
}

export default {
  title: 'devices',
  type: 'devices',

  services: {
    fetchData,
    // createData,
    deleteData,
  },
  component: Detail,
  configs: {
    list: {
      value: item => item?.name ?? '',
      label: item => item?.metadata?.osName ?? '',
      status: item => statusText(item),
      emptyListMessage: 'No devices added',
      title: 'devices',
      image: 'devices',
      description: 'devices_description',
    },
    // form: formConfig,
  },
};
