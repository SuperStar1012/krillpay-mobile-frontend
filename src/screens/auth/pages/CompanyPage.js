import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Dimensions, Animated, Platform } from 'react-native';

import { Formik } from 'formik';
import * as yup from 'yup';

import { View, Button, HeaderButton, CustomIcon, Text } from 'components';
import {
  getPublicCompanies,
  getPublicCompany,
  getCompanyAppConfig,
} from 'utility/rehive';
import client from 'config/client';
import { setTempCompany } from '../redux/actions';
import CompanyInput from '../components/CompanyInput';
import colors from 'config/default/colors.json';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { useQuery } from 'react-query';
import WelcomeImage from '../components/images/welcome.svg';
import { useKeyboard } from 'hooks/keyboard';
const SCREEN_WIDTH = Dimensions.get('window').width;

const animationTime = 900;

export default function CompanyPage(props) {
  const { companies, onSuccess, loading, setLoading } = props;
  const { primary } = colors;

  const dispatch = useDispatch();
  const [companyID, setCompanyID] = useState(client.company);

  const [error, setError] = useState('');

  const queryPublicCompanies = useQuery(
    ['publicCompanies'],
    getPublicCompanies,
  );
  const publicCompanies = queryPublicCompanies?.data?.results ?? [];

  useEffect(() => {
    if (companyID) {
      verifyCompany(companyID);
    } else {
      setLoading(false);
    }
  }, [companyID]);

  async function verifyCompany(company, formikProps) {
    setLoading(true);
    if (!company) {
    } else {
      company = company.toLowerCase();
      try {
        //TODO: if from listed company obj skip this
        const response = await getPublicCompany(company);
        const config = await getCompanyAppConfig(company, false);
        if (response.status === 'success' && config?.status === 'success') {
          dispatch(
            setTempCompany({ ...response.data, ...(config?.data ?? {}) }),
          );
          onSuccess();
        } else {
          if (formikProps) {
            setError(
              'The App ID you have entered does not exist or public access has been disabled',
            );
          }
        }
      } catch (error) {
        console.log('TCL: verifyCompany -> error', error);
      }
    }
    setLoading(false);
  }

  function handleSubmit(formikProps) {
    setLoading(true);
    verifyCompany(formikProps.values.company, formikProps);
  }

  const formSchema = yup.object().shape({
    company: yup.string().required('Please enter a valid wallet ID'),
  });

  const { keyboardHeight } = useKeyboard();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const heightAnim = useRef(new Animated.Value(SCREEN_WIDTH - 60)).current;
  const topAnim = useRef(new Animated.Value(-15)).current;

  useEffect(() => {
    if (keyboardHeight) {
      // ref?.current?.scrollTo(0);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: animationTime,
        useNativeDriver: false,
      }).start();
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: animationTime,
        useNativeDriver: false,
      }).start();
      Animated.timing(topAnim, {
        toValue: -SCREEN_WIDTH,
        duration: animationTime,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animationTime,
        useNativeDriver: false,
      }).start();
      Animated.timing(heightAnim, {
        toValue: SCREEN_WIDTH - 60,
        duration: animationTime,
        useNativeDriver: false,
      }).start();
      Animated.timing(topAnim, {
        toValue: -15,
        duration: animationTime,
        useNativeDriver: false,
      }).start();
    }
  }, [!!keyboardHeight]);

  if (loading) {
    return <View />;
  }

  const logoHeight = 100;
  return (
    <Formik
      initialValues={{
        company: '',
      }}
      validationSchema={formSchema}>
      {formikProps => (
        <>
          <View f={1} w="100%" behaviour="position">
            <View f={1} pb={1}>
              <Animated.View
                style={{
                  ...props.style,
                  height: heightAnim,
                  top: topAnim,
                  opacity: fadeAnim,
                }}>
                <WelcomeImage width={SCREEN_WIDTH ?? 0} />
              </Animated.View>
              <View jC={'space-between'} pt={1} ph={1.5}>
                <View mb={1}>
                  <Text s={25} fW="bold" id="app_id_title" />
                  <Text s={20} style={{ marginTop: 6 }} id="app_id_subtitle" />
                </View>
                <CompanyInput
                  handleSubmit={handleSubmit}
                  publicCompanies={publicCompanies}
                  setCompanyID={setCompanyID}
                  companies={companies}
                  formikProps={formikProps}
                  color={primary}
                />
                <ErrorOutput>{error}</ErrorOutput>
              </View>
            </View>
          </View>
          {!!keyboardHeight && (
            <View
              ph={1.5}
              style={{
                position: 'absolute',
                bottom: 4 + (Platform.OS === 'ios' ? keyboardHeight : 0),
                left: 0,
                width: '100%',
              }}>
              <Button
                id="app_id_button"
                color={primary}
                size="medium"
                onPress={() => handleSubmit(formikProps)}
                animation="fadeInUp"
                wide
                disabled={
                  !formikProps.isValid || formikProps.isSubmitting || loading
                }
                loading={formikProps.isSubmitting || loading}
              />
            </View>
          )}
        </>
      )}
    </Formik>
  );
}
