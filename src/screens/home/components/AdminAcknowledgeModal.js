import React from 'react';
import { get } from 'lodash';
import { PopUpGeneral } from 'components';
import { useSelector, useDispatch } from 'react-redux';
import { userProfileSelector } from '@redux/rehive/reducer';
import { dismissedAdminSelector } from 'screens/auth/redux/selectors';
import { dismissAdmin } from 'screens/auth/redux/actions';

export default function AdminAcknowledgeModal(props) {
  const dispatch = useDispatch();
  const profile = useSelector(userProfileSelector);
  const dismissed = useSelector(dismissedAdminSelector);
  const userGroup = get(profile, ['data', 0, 'groups', 0, 'name'], '');
  const isAdmin = Boolean(userGroup.match(/admin/));

  function onDismiss() {
    dispatch(dismissAdmin);
  }

  if (!isAdmin || dismissed) {
    return null;
  }
  const contentText = 'admin_acknowledge_modal_context';

  return (
    <PopUpGeneral
      title="admin_account"
      visible={!dismissed}
      contentText={contentText}
      textActionOne="acknowledge"
      onPressActionOne={onDismiss}
      onDismiss={onDismiss}
    />
  );
}
