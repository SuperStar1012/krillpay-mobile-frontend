import React, { useEffect } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';

import { HeaderButton } from 'components/inputs/HeaderButton';
import { View } from 'components/layout/View';
import Logo from 'components/outputs/Logo';
import { Text, Button } from 'components';
import client from 'config/client';
import ErrorOutput from 'components/outputs/ErrorOutput';
import FormikInput from 'components/inputs/FormikInput';
import { useIsRTL } from 'hooks/general';
import { checkWyreServiceArray } from 'extensions/wyre/util';

export default function DisclaimerPage(props) {
  const { company, onBack, onSuccess, setLoading, onAbout } = props;
  const isRTL = useIsRTL();
  if (!company) {
    onBack();
  }

  const { name, settings } = company;
  const { privacy_policy_url, terms_and_conditions_url } = settings;

  useEffect(() => {
    if (client.company || checkWyreServiceArray(company?.services)) {
      onSuccess();
    } else {
      setLoading(false);
    }
  }, []);

  const fields = [
    {
      id: 'check1',
      type: 'terms',
      description: 'disclaimer_checkbox_1',
      context: { name },
    },
    {
      id: 'check2',
      type: 'terms',
      description: 'disclaimer_checkbox_2',
      context: { name },
    },
  ];

  const formSchema = yup.object().shape({
    check1: yup.bool().oneOf([true], 'Please accept terms of service'),
    check2: yup
      .bool()
      .oneOf([true], 'Please accept wallet privacy policy and terms of use'),
  });

  // let buttons = [
  //   {
  //     label: 'About ' + name,
  //     onPress: () => onAbout(),
  //     type: 'text',
  //     color: 'primary',
  //   },
  //   // {
  //   //   label: 'Privacy policy',
  //   //   link: privacy_policy_url ? privacy_policy_url : client.privacy_policy_url,
  //   //   type: 'text',
  //   //   color: 'primary',
  //   // },
  //   // {
  //   //   label: 'Terms of use',
  //   //   link: terms_and_conditions_url
  //   //     ? terms_and_conditions_url
  //   //     : client.terms_and_conditions_url,
  //   //   type: 'text',
  //   //   color: 'primary',
  //   // },
  // ];

  return (
    <View f={1}>
      <HeaderButton
        test-id={'back'}
        icon={isRTL ? 'chevron-right' : 'chevron-left'}
        size={25}
        onPress={onBack}
        color={'authScreenContrast'}
      />
      <View scrollView w={'100%'}>
        <View ph={1} pb={1} w={'100%'}>
          <View aI={'center'} jC={'center'} w={'100%'} pb={0.25} pt={0.125}>
            <Logo company={company} height={80} />
          </View>
          <View pv={1} s={14}>
            <Text tA={'center'} id="disclaimer_text" />
          </View>
          <Formik
            initialValues={{
              check1: false,
              check2: false,
            }}
            validationSchema={formSchema}
            onSubmit={() => {}}>
            {formikProps => (
              <React.Fragment>
                {fields.map((field, index) => (
                  <View mv={-0.5} key={field.id}>
                    <FormikInput
                      formikProps={formikProps}
                      field={field}
                      onChange={value =>
                        formikProps.setFieldValue(field.id, value)
                      }
                    />
                  </View>
                ))}

                <ErrorOutput>
                  {formikProps.status && formikProps.status.error}
                </ErrorOutput>

                {/* <View w={'100%'} ph={1.125}>
                  <Text
                    t="s1"
                    c="primary"
                    o={0.8}
                    p={0.25}
                    onPress={() => buttons[0].onPress()}>
                    {buttons[0].label}
                  </Text>
                </View> */}

                <View mt={1}>
                  <Button
                    id={'continue'}
                    color="primary"
                    onPress={() => onSuccess(formikProps)}
                    wide
                    disabled={!formikProps.isValid || formikProps.isSubmitting}
                    loading={formikProps.isSubmitting}
                  />
                </View>
              </React.Fragment>
            )}
          </Formik>
        </View>
      </View>
    </View>
  );
}
