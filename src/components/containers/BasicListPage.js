import React, { useState } from 'react';

import { View, Text, Button } from 'components';
import FormLayout from 'components/layout/Form';
import { Icon } from 'components/outputs/Icon';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import { useRehive } from 'hooks/rehive';
import Output from 'components/outputs/OutputNew';
import Form from 'components/form';
import SwipeToDelete from 'components/layout/SwipeToDelete';
import { deleteItem, resendVerification, primaryItem } from 'utility/rehive';
import { useToast } from 'contexts/ToastContext';
import VerifyLayout from 'components/layout/VerifyLayout';
import { Spinner } from 'components/outputs/Spinner';
import { useRehiveContext } from 'contexts/RehiveContext';
import DetailLayout from 'components/layout/DetailLayout';

import TypeSelectorPage from 'components/layout/TypeSelectorPage';
import { useDispatch } from 'react-redux';
import { updateReduxUser } from '../../redux/actions';
import { useData } from 'contexts/DataContext';

export default function BasicListPage(props) {
  const { id: pageId, navigation, config = {} } = props;

  const {
    configs,
    id = pageId,
    renderDetail: RenderDetail,
    component: Component,
  } = config;
  const type = config?.type ?? id ?? '';
  const data = useData();

  const { showToast } = useToast();
  const { context: appContext, config: companyConfig } = useRehiveContext();
  const dispatch = useDispatch();
  const updateUser = user => dispatch(updateReduxUser(user));

  const { user } = appContext;
  const [listType, setType] = useState('');
  const { context: rehiveContext, refresh } = useRehive([type], true, {
    user,
    listType,
  });
  const context = {
    ...(data?.context ?? {}),
    config: companyConfig,
    ...appContext,
    ...rehiveContext,
  };
  const viewOnly =
    typeof config?.viewOnly === 'function' ? config?.viewOnly(context) : false;

  const { profileConfig } = companyConfig;

  const [state, setState] = useState(
    configs?.type ? 'type' : configs?.list ? 'list' : 'form',
  );
  let { items, loading } = context?.[type] ?? {};
  if (configs?.[state]?.filter && listType)
    items = items.filter(x => x?.[configs?.[state]?.filter] === listType);

  const [index, setIndex] = useState(null);
  const [tempItem, setTempItem] = useState(null);

  const item = type.match(/user|profile|central_bank/) ? user : items?.[index];

  const pageConfigTemp = configs?.[state ? state : 'list'];
  let pageConfig =
    typeof pageConfigTemp === 'function'
      ? pageConfigTemp({ item, context })
      : pageConfigTemp
      ? pageConfigTemp
      : config;

  const { value = config?.value, filter } = pageConfig ?? {};

  const canVerify = Boolean(configs?.verify ?? false);

  function handleBack() {
    setTempItem(null);
    if (state === 'list' && configs?.type) {
      setType('');
      setState('type');
    } else if (state === 'list' || !configs?.list || state === 'type') {
      setType('');
      navigation.goBack();
    } else if (state === 'form') {
      if (tempItem) setState('view');
      else setState('list');
    } else {
      setIndex(null);
      setState('list');
    }
  }

  const pageProps = {
    id,
    type,
    item,
    config: pageConfig,
    config2: pageConfig,
    configs,
    context,
    state,
    setState,
    handleBack,
    showToast,
    index,
    listType,
    setTempItem,
    tempItem,
    refresh,
  };

  function handleAction(index) {
    if (state === 'list' && (index || index === 0)) {
      setIndex(index);
      setState('view');
    }
    if (state === 'view' || typeof index !== 'number') {
      setIndex(index);
      setState('form');
    } else {
      console.log('third');
      // onSubmit?
    }
  }

  const hasItems = items?.length > 0;

  function onSuccess(item, isUpdate = true) {
    if (type.match(/user|profile|central_bank/)) {
      showToast({ variant: 'success', id: 'profile_updated' });
      updateUser(item);
      handleBack();
      setTempItem(null);
      setIndex(null);
    } else if (configs?.verify && state === 'form') {
      refresh(id);
      setState('verify');
      setTempItem(item);
    } else {
      showToast({
        id: type + '_' + (isUpdate ? 'updated' : 'added'),
        variant: 'success',
        duration: 10000,
      });
      refresh(type ?? id, item);
      setTempItem(item);
      handleBack();
      // setIndex(null);
    }
  }

  const formProps = {
    type,
    item,
    state,
    index,
    setState,
    listType,
    config: pageConfig,
    onClose: handleBack,
    onCancel: handleBack,
    onSuccess,
    showToast,
    context,
  };
  const FormComponent = (
    <Form
      variant={type}
      {...formProps}
      edit
      initial={item}
      initialCurrency={
        (user && user.condition) != undefined && user.currency.code
      }
      type={id}
      profileConfig={profileConfig}
      // profileConfig={profileConfig}
    />
  );

  const [indexLoading, setIndexLoading] = useState(false);

  async function handleDelete(temp) {
    if (!temp?.id) temp = item;
    setIndexLoading('delete');
    const resp = await deleteItem(type, temp?.id);
    if (resp?.status === 'error') {
      showToast({
        id: 'unable_to_delete' + type,
        text: resp?.message ? ': ' + resp?.message : '',
        variant: 'error',
      });
    } else {
      refresh(type, resp);
      setState('list');
      showToast({
        id: type + '_deleted',
        variant: 'success',
      });
    }
    setIndexLoading(false);
  }

  function handleType(type) {
    setType(type);
    setState('list');
  }

  //TODO: add config for verification / primary
  async function handleVerify(temp) {
    if (!temp?.id) temp = item;
    try {
      setIndexLoading('verify');
      setIndex(index);
      const value = temp?.[type] ?? temp?.number;
      await resendVerification(type, value, context?.company);
      setState('verify');
    } catch (e) {
      console.log(e);
      // setError(e.message);
      // refPinInput.current.clear();
    }
    setIndexLoading(false);
  }

  async function handlePrimary(temp) {
    if (!temp?.id) temp = item;

    try {
      setIndexLoading('primary');
      setIndex(index);
      const resp = await primaryItem(type, { id: temp?.id }, context?.company);
      if (resp?.status !== 'error') {
        showToast({
          id: type + '_primary',
          variant: 'success',
        });
      }
      setTempItem(resp);
      refresh(type);
      setIndexLoading(false);
    } catch (e) {
      showToast({
        variant: 'error',
        text: e?.message ? ': ' + e?.message : '',
        id: type + '_primary_error',
      });
      console.log(e);
      // setError(e.message);
      // refPinInput.current.clear();
    }
    setIndexLoading(false);
  }
  const methods = {
    handleDelete,
    handleVerify,
    handlePrimary,
    loading: indexLoading,
  };

  return (
    <View screen>
      {Component ? (
        <Component {...props} {...pageProps} />
      ) : (
        <FormLayout {...props} {...pageProps}>
          {RenderDetail ? (
            <RenderDetail {...props} context={context} />
          ) : state === 'type' ? (
            <TypeSelectorPage
              {...props}
              {...pageProps}
              context={context}
              handleType={handleType}
            />
          ) : state === 'form' ? (
            <View pb={1}>{FormComponent}</View>
          ) : state === 'verify' ? (
            <VerifyLayout {...formProps} item={tempItem ?? item} />
          ) : state === 'view' ? (
            <DetailLayout
              // {...formProps}
              {...pageProps}
              item={tempItem ?? item}
              methods={methods}
            />
          ) : (
            <>
              {hasItems ? (
                <View mb={1}>
                  {items?.map((item, i) => (
                    <ListItem
                      key={item?.id}
                      {...pageProps}
                      item={item}
                      index={i}
                      disabled={viewOnly}
                      handleAction={handleAction}
                      {...pageConfig}
                      value={value}
                      type={type}
                      id={id}
                      pageIndex={index}
                      canVerify={canVerify}
                      methods={methods}
                    />
                  ))}
                </View>
              ) : loading ? (
                <ListItemSkeleton type={type} />
              ) : (
                <View pb={2} pt={0.4}>
                  {/* <EmptyListPlaceholderImage id={type} /> */}
                  <Text
                    tA="center"
                    id={id || listType ? (listType || id) + '_empty' : ''}
                  />
                </View>
              )}
              {/* <EmptyListPlaceholderImage name={id} text="empty" /> */}

              {/* {!viewOnly && ( */}
              <Button
                id="button.add_new"
                wide
                onPress={() => handleAction(null)}
              />
              {/* )} */}
            </>
          )}
        </FormLayout>
      )}
    </View>
  );
}

function ListItemSkeleton({ type }) {
  return (
    <View fD="row" jC="space-between" w="100%">
      <View pb={1.375} pt={0.125}>
        <View pb={0.25}>
          <Text id={type} s={12} c="fontLight" />
        </View>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item
              width={150}
              height={16}
              borderRadius={50}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
      {/* <SkeletonPlaceholder>
    <SkeletonPlaceholder.Item
      flexDirection="row"
      alignItems="center">
      <SkeletonPlaceholder.Item
        width={24}
        height={24}
        borderRadius={50}
      />
      <SkeletonPlaceholder.Item
        width={24}
        height={24}
        borderRadius={50}
      />
    </SkeletonPlaceholder.Item>
  </SkeletonPlaceholder> */}
    </View>
  );
}

function ListItem(props) {
  const {
    item,
    index,
    handleAction,
    value,
    label,
    type,
    id,
    canDelete,
    count,
    pageIndex,
    methods,
    canVerify,
    disabled,
    context,
  } = props;

  const { handleDelete, handlePrimary, handleVerify, loading } = methods;

  const Content = (
    <Button disabled={disabled} onPress={() => handleAction(index, type)}>
      <View
        fD="row"
        pb={0.375}
        pt={0.125}
        key={item?.id}
        bC="white"
        aI="center">
        <View f={1}>
          <Output
            value={
              typeof value === 'function'
                ? value(item, index, context)
                : item?.[value ?? id]
            }
            label={
              typeof label === 'function' ? label(item, index, context) : type
            }
            count={
              typeof count === 'function'
                ? count(item, index, context)
                : index + 1
            }
          />
        </View>
        {canVerify && (
          <View fD="row" pr={0} pt={1}>
            {item?.verified ? (
              <Icon
                style={{ paddingLeft: 8 }}
                name="done"
                color="positive"
                size={20}
                set={'MaterialIcons'}
              />
            ) : loading === 'verify' && pageIndex === index ? (
              <Spinner size="small" containerStyle={{ padding: 0 }} />
            ) : (
              <Button onPress={() => handleVerify(item)}>
                <Icon
                  style={{ paddingLeft: 8 }}
                  name="close"
                  color="negative"
                  size={20}
                  set={'MaterialIcons'}
                />
              </Button>
            )}
            {item?.primary ? (
              <Icon
                style={{ paddingLeft: 8 }}
                name="star"
                color="primary"
                size={20}
                set={'MaterialIcons'}
              />
            ) : loading === 'primary' && pageIndex === index ? (
              <Spinner size="small" containerStyle={{ padding: 0 }} />
            ) : (
              <Button onPress={() => handlePrimary(item)} disabled>
                <Icon
                  style={{ paddingLeft: 8 }}
                  name="star-border"
                  color="font"
                  size={20}
                  set={'MaterialIcons'}
                />
              </Button>
            )}
          </View>
        )}
      </View>
    </Button>
  );

  if (typeof canDelete === 'function' ? canDelete(item) : canDelete) {
    return (
      <SwipeToDelete
        onDelete={() => handleDelete(item)}
        loading={loading === 'delete'}>
        {Content}
      </SwipeToDelete>
    );
  }
  return Content;
}
