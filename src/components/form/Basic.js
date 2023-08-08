import React, { useEffect } from 'react';
import FormLayout from 'components/layout/Form';
import PageTitle from 'components/layout/page/PageTitle';
import FormSection from './FormSection';
import { Button } from 'components/inputs/Button';

import { Spinner } from 'components/outputs/Spinner';
import ErrorOutput from 'components/outputs/Error';
import PageButtons from 'components/layout/page/PageButtons';
import Info from 'components/outputs/Info';

export default function Basic(props) {
  const {
    header,
    layoutProps,
    inputPropsControl,
    handleSubmit,
    noLayout,
    formConfig,
    footer,
    padded,
    data,
    screenConfig,
    context,
    reduxContext,
    showToast,
    setItem,
    formError,
    onCancel,
  } = props;

  const {
    fields,
    sections,
    title,
    titleAction,
    submitLabel,
    loading,
    onSubmit = data => console.log('data'),
    inputComponents,
    actions,
    warning,
    isInvalid,
    locales,
  } = formConfig;
  const { formState = {}, errors, reset } = inputPropsControl;
  const { isSubmitting, isValid } = formState;
  const inputs = screenConfig?.configs?.inputs ?? {};

  const error = errors?.form ?? props?.error ?? '';
  const isLoading = typeof loading === 'function' && loading(props);
  if (isLoading) return <Spinner />;

  let buttons = [
    {
      type: 'submit',
      label: submitLabel,
      loading: isSubmitting,
      disabled: isInvalid || !isValid || isSubmitting || formError,
    },
  ];
  if (onCancel && typeof onCancel === 'function') {
    buttons.push({
      label: 'Cancel',
      onClick: onCancel,
      variant: 'text',
    });
  }

  const Content = (
    <div style={{ width: '100%' }}>
      {/* {Boolean(header) && header}
      {Boolean(title) && (
        <PageTitle
          align="center"
          actions={
            Boolean(typeof titleAction?.onPress === 'function') && (
              <Button
                color="primary"
                variant="text"
                {...titleAction}
                onPress={() => titleAction.onPress(inputPropsControl, props)}
                loading={
                  typeof titleAction?.loading === 'function'
                    ? titleAction.loading(props)
                    : false
                }
              />
            )
          }>
          {title}
        </PageTitle>
      )} */}
      <ErrorOutput>{error}</ErrorOutput>
      {/* <form
        onSubmit={handleSubmit(values =>
          onSubmit(values, inputPropsControl, props),
        )}> */}
      {sections && sections.length ? (
        sections.map((section, index) => (
          <FormSection
            key={section?.id ?? section}
            item={section}
            index={index}
            context={{ ...reduxContext, ...context }}
            formState={formState}
            {...inputPropsControl}
            {...data}
            inputs={inputs}
            inputComponents={inputComponents}
            showToast={showToast}
            locales={locales}
            setItem={setItem}
          />
        ))
      ) : fields ? (
        <FormSection
          item={{ fields }}
          formState={formState}
          context={{ ...reduxContext, ...context }}
          {...inputPropsControl}
          {...data}
          inputs={inputs}
          inputComponents={inputComponents}
          showToast={showToast}
          locales={locales}
          setItem={setItem}
        />
      ) : null}
      <ErrorOutput>{formError}</ErrorOutput>

      {Boolean(submitLabel) && (
        <PageButtons
          layout="vertical"
          noPadding={Boolean(footer)}
          items={buttons}
        />
      )}
      {Boolean(footer) && footer}
      {/* </form> */}
    </div>
  );

  if (noLayout) {
    return Content;
  }

  return (
    <FormLayout
      header={Boolean(warning) && <Info>{warning}</Info>}
      noPadding
      maxWidth={600}
      {...layoutProps}>
      {Content}
    </FormLayout>
  );
}
