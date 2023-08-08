import React, { useState } from 'react';

import document_categories from 'config/rehive/document_types.json';
import DocumentDetailModal from './DocumentDetailModal';
import Upload from './Upload';
import Detail from './Detail';
import { View } from 'components';
import { useRehive } from 'hooks/rehive';
import { useModal } from 'utility/hooks';
import { objectToArray } from 'utility/general';
import FullPageSelector from 'components/inputs/FullPageSelector';
import { useRehiveContext } from 'contexts/RehiveContext';
import DocumentsLayout from './DocumentsLayout';

const configs = ({ category, type, uploadIndex, title, description }) => ({
  category: {
    title: 'document_type_header',
    description: '',
  },
  type: {
    title: title ?? 'choose_your_document',
    description:
      description ??
      (category?.id === 'proof_of_identity'
        ? ''
        : category?.id === 'proof_of_address'
        ? 'It must contain your address for verification'
        : ''),
  },
  upload: {
    title: type?.id ?? '',
    description:
      category?.id === 'proof_of_identity'
        ? uploadIndex > 0
          ? 'This document requires an image of the back'
          : ''
        : category?.id === 'proof_of_address'
        ? 'It must contain your address for verification'
        : '',
  },
  detail: {
    title: type?.id ?? '',
    description:
      category?.id === 'proof_of_identity'
        ? ''
        : category?.id === 'proof_of_address'
        ? 'It must contain your address for verification'
        : '',
  },
});

export default function DocumentsSelector(props) {
  const {
    route,
    navigation,
    previewDoc,
    initialState,
    initialCategory,
    initialType,
    submitForm,
    noPadding,
    onBack,
    hideCompletionState,
    formikProps,
    hideFields,
    title,
    description,
    page,
    canSkip = true,
  } = props;

  const [state, setState] = useState(initialState);
  const [type, setType] = useState(
    initialType
      ? objectToArray(document_categories, 'id')
          ?.find(x => x.id === initialCategory)
          ?.options?.find(x => x.id === initialType)
      : '',
  );
  const [category, setCategory] = useState(
    route?.params?.name ?? initialCategory
      ? objectToArray(document_categories, 'id')?.find(
          x => x.id === initialCategory,
        )
      : '',
  );
  const [uploadIndex, setUploadIndex] = useState(0);
  const [hasTempDoc, setHasTempDoc] = useState(false);

  const {
    context: { user, init },
  } = useRehiveContext();
  const {
    context: { document: documents },
    loading: { document: documentsLoading },
    refresh,
  } = useRehive(['document'], init, { user });

  function resetState() {
    setState(initialState);
    setType('');
    setCategory(
      route?.params?.name ?? initialCategory
        ? objectToArray(document_categories, 'id')?.find(
            x => x.id === initialCategory,
          )
        : '',
    );
    setUploadIndex(0);
  }

  function handleCategorySelect(value) {
    setCategory(value);
    setState('type');
  }

  function handleTypeSelect(value) {
    setType(value);
    setState('upload');
  }

  function mapTypes() {
    if (hideCompletionState)
      return document_categories[category?.id]?.options ?? [];

    return (document_categories[category?.id]?.options ?? [])?.map(x => {
      const docs = documents?.items?.filter(y => y.document_type === x?.id);

      const completeState = docs?.find(y => y.status === 'verified')
        ? 'verified'
        : docs?.find(y => ['incomplete', 'declined'].includes(y.status))
        ? 'error'
        : docs?.find(y => ['pending'].includes(y.status))
        ? 'pending'
        : null;

      return {
        ...x,
        icon:
          completeState === 'verified'
            ? 'check'
            : completeState === 'error'
            ? 'close'
            : completeState === 'pending'
            ? 'hourglass-empty'
            : x.icon,
        set: completeState === 'pending' ? 'MaterialIcons' : x.set,
        color:
          completeState === 'verified'
            ? '#0DAF2D'
            : completeState === 'error'
            ? '#cc2538'
            : completeState === 'pending'
            ? '#D3D3D3'
            : 'primary',
        disabled: Boolean(completeState),
      };
    });
  }
  function renderContent() {
    switch (state) {
      case 'detail':
        return <Detail onDismiss={() => resetState()} />;
      case 'upload':
        return (
          <Upload
            {...{
              type,
              category,
              canSkip,
              navigation,
              uploaded: previewDoc ? [previewDoc] : [],
              uploadIndex,
              setUploadIndex,
              formikProps,
              hideFields,
              hasTempDoc,
              setHasTempDoc,
              onDismiss: () => {
                setHasTempDoc(false);
                submitForm && submitForm();
                refresh('document');
                canSkip && resetState();
              },
            }}
          />
        );

      case 'type':
        return (
          <FullPageSelector
            loading={!hideCompletionState && documentsLoading}
            onValueSelect={handleTypeSelect}
            // onValueSelect={value => selectType(value)}
            options={mapTypes()}
          />
        );

      case 'category':
      default:
        return (
          <FullPageSelector
            onValueSelect={handleCategorySelect}
            options={objectToArray(document_categories, 'id').filter(
              item => item.type !== 'finances',
            )}
          />
        );
    }
  }

  const { modalVisible, hideModal, showModal } = useModal();

  const modalProps = {
    documents,
    modalVisible,
    index: modalVisible,
    category,
    onDismiss: hideModal,
  };
  const config =
    (typeof configs === 'function'
      ? configs({ category, type, uploadIndex, title, description })
      : configs)?.[state] ??
    props?.config ??
    route?.params?.item ??
    {};

  function handleBack() {
    if (!state || (state === initialState && onBack)) {
      resetState();
      onBack();
    } else if (state === 'category' || previewDoc) {
      resetState();
    } else if (state === 'type') {
      setState('category');
    } else if (state === 'upload') {
      if (uploadIndex > 0) setUploadIndex(uploadIndex - 1);
      else setState('type');
    } else if (state === 'detail') {
      resetState();
    }
  }

  return (
    <DocumentsLayout
      page={page}
      config={config}
      hideDescription={hasTempDoc}
      handleBack={handleBack}
      noBack={!onBack && state === initialState}
      noPadding={noPadding}>
      <View f={1}>{renderContent()}</View>
      <DocumentDetailModal {...modalProps} />
    </DocumentsLayout>
  );
}
