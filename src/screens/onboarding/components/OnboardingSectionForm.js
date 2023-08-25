/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Text, Button, View } from 'components';
import { FormikFields } from 'components/inputs/FormikForm';
import ErrorOutput from 'components/outputs/ErrorOutput';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useToast } from 'contexts';

export default function OnboardingSectionForm(props) {
  const { activeSection, error, formikProps, canSkip } = props;

  const {
    id,
    fields,
    initialLayout = {
      displayImage: true,
      displayHeading: true,
      displayDescription: true,
      displayButton: true,
    },

    description = id + '_description',
    title = id + '_title',
    validate,
    mappedFields,
  } = activeSection;

  const { showToast } = useToast();

  const { isSubmitting, submitForm, values } = formikProps;
  const errors =
    typeof validate === 'function' ? validate(values, mappedFields) : false;
  const [awaiting, setAwaiting] = useState(false);
  const [layout, setLayout] = useState(initialLayout);

  useEffect(() => {
    setLayout(initialLayout);
  }, [activeSection]);

  function handleSubmit() {
    if (canSkip || !errors) submitForm();
    else showToast({ variant: 'error', text: 'error' });
  }

  return (
    <View pb={2}>
      {!fields?.length ? (
        <View mt={1}>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              flexDirection={'column'}
              alignItems="center">
              <SkeletonPlaceholder.Item
                width={170}
                height={25}
                borderRadius={100}
                marginBottom={25}
              />
              <SkeletonPlaceholder.Item
                width={250}
                height={15}
                borderRadius={100}
                marginBottom={10}
              />
              <SkeletonPlaceholder.Item
                width={250}
                height={15}
                borderRadius={100}
                marginBottom={30}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </View>
      ) : (
        <>
          {(layout.displayHeading || layout.displayDescription) && (
            <View mb={1}>
              {layout.displayHeading && (
                <View mb={0.5}>
                  <Text s={20} fW={'700'} lH={38} tA={'center'} id={title} />
                </View>
              )}
              {layout.displayDescription && (
                <Text
                  s={18}
                  lH={24}
                  c="#868686"
                  tA={'center'}
                  id={description}
                />
              )}
            </View>
          )}
          <View>
            <FormikFields
              {...props}
              formErrors={errors}
              required={!canSkip}
              title={title}
              description={description}
              fields={fields}
              setAwaiting={setAwaiting}
              layout={layout}
              setLayout={setLayout}
              submitForm={submitForm}
            />
            {typeof error === 'string' && <ErrorOutput>{error}</ErrorOutput>}
            {layout.displayButton && (
              <Button
                id={'continue'}
                variant={'contained'}
                loading={isSubmitting}
                disabled={awaiting || isSubmitting || !(canSkip || !errors)}
                color={'primary'}
                onPress={handleSubmit}
                wide
              />
            )}
          </View>
        </>
      )}
    </View>
  );
}
