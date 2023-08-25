import React, { useState } from 'react';
import document_categories from 'config/rehive/document_types.json';
import DocumentList from './DocumentList';
import { View } from 'components';
import FormLayout from 'components/layout/Form';
import { useRehive } from 'hooks/rehive';
import DocumentSelector from 'components/inputs/DocumentSelector';
import { useRehiveContext } from 'contexts/RehiveContext';

export default function Finances(props) {
  const {
    route,
    config = route?.params?.config?.config?.finances ?? {},
    state,
    setState,
    navigation,
  } = props;
  const {
    context: { user, init },
  } = useRehiveContext();
  const {
    context: { document: documents },
    loading: { document: documentsLoading },
    refresh,
  } = useRehive(['document'], init, { user });

  const [type, setType] = useState('');
  const [previewDoc, setPreviewDoc] = useState(false);
  // const [category, setCategory] = useState(route?.params?.name ?? '');
  const category = 'proof_of_income';

  // const config = configs?.config?.finances;

  switch (state) {
    case 'detail':
    case 'upload':
    case 'category':
    case 'type':
      return (
        <DocumentSelector
          page
          allowPreview={Boolean(previewDoc)}
          previewDoc={previewDoc}
          initialCategory={category}
          initialType={type}
          initialState={state}
          navigation={navigation}
          onBack={() => setState('')}
          submitForm={() => setState('')}
          hideCompletionState
          hideFields
        />
      );
    default:
    case '':
      return (
        <FormLayout
          id="finances"
          scrollView={false}
          config={config}
          handleBack={() => navigation.goBack()}>
          <DocumentList
            data={documents?.items ?? []}
            onNewUpload={() => setState('type')}
            loading={documentsLoading}
            refresh={() => refresh('document')}
            setPreviewDoc={setPreviewDoc}
            onDetail={item => {
              // setCategory(document_categories[item?.document_category]?.id);
              setType(
                document_categories[item?.document_category]?.options?.find(
                  x => x.id === item?.document_type,
                )?.id,
              );
              setPreviewDoc(item);
              setState('upload');
            }}
          />
        </FormLayout>
      );
  }
}
