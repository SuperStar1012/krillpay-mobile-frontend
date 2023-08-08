import React from 'react';
import { Formik } from 'formik';
import { View } from '../layout/View';
import Input from './FormikInput';
import ErrorOutput from '../outputs/ErrorOutput';
import { ButtonList } from './ButtonList';
import { omit } from 'lodash';

export default function FormikForm(props) {
  let { actions, ...otherProps } = props;

  return (
    <Formik {...otherProps}>
      {formikProps => (
        <View>
          <FormikFields {...props} formikProps={formikProps} />
          <ErrorOutput>
            {formikProps.status && formikProps.status.error}
          </ErrorOutput>
          {Boolean(actions) && typeof actions === 'function' && (
            <ButtonList items={actions(formikProps)} layout={'vertical'} />
          )}
        </View>
      )}
    </Formik>
  );
}

export function FormikFields(props) {
  let { fields = [], noPadding, formikProps, required, ...restProps } = props;

  fields = fields?.filter(item => item);

  if (fields && fields?.length > 0) {
    fields[0] = { ...fields[0], autoFocus: true };
  }

  return (
    <View pb={noPadding ? 0 : 2}>
      {fields.map((field, index) => {
        if (field.component) {
          const Component = field?.component;
          return (
            <Component
              key={field.component + '-' + index} // Provide a unique key
              formikProps={formikProps}
              {...omit(field, ['component'])}
              {...restProps}
            />
          );
        }
        return (
          <Input
            field={{ ...field, required }}
            key={field.name + '-' + index} // Provide a unique key
            formikProps={formikProps}
            {...restProps}
          />
        );
      })}
    </View>
  );
}
