/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Image } from 'react-native';
import { uuidv4 } from 'utility/general';
import { compressImage } from 'utility/image';
import { View } from 'components/layout/View';
import { createDocumentNew as createDocument } from 'utility/rehive';
import { Icon } from 'components/outputs/Icon';
import { Text } from 'components';
import { Button } from 'components/inputs/Button';
import { CustomImage } from 'components/outputs/CustomImage';
import { useTheme } from 'components/context';

import * as DocumentPicker from 'expo-document-picker';

const defaultItems = [
  {
    document_type: 'utility_bill',
    label: 'Utility bill',
    description: 'Make sure your address is clear',
    capture_description: 'Make sure your address is clear',
    capture_height: 350,
    icon: 'receipt-long',
    set: 'MaterialIcons',
  },
  {
    document_type: 'bank_statement',
    label: 'Bank statement',
    description: 'Make sure your address is clear',
    capture_description: 'Make sure your address is clear',
    capture_height: 350,
    icon: 'account-balance',
    set: 'MaterialIcons',
  },
  {
    document_type: 'lease_or_rental_agreement',
    label: 'Lease or rental agreement',
    description: 'Make sure your address is clear',
    capture_description: 'Make sure your address is clear',
    capture_height: 350,
    icon: 'apartment',
    set: 'MaterialIcons',
  },
  {
    document_type: 'mortgage_statement',
    label: 'Mortgage statement',
    description: 'Make sure your address is clear',
    capture_description: 'Make sure your address is clear',
    capture_height: 300,
    icon: 'house',
    set: 'MaterialIcons',
  },
  {
    document_type: 'municipal_rate_and_taxes',
    label: 'Rates and taxes',
    description: 'Make sure your address is clear',
    capture_description: 'Make sure your address is clear',
    capture_height: 300,
    icon: 'house',
    set: 'MaterialIcons',
  },
  {
    document_type: 'telephone',
    label: 'Telephone',
    description: 'Make sure your address is clear',
    capture_description: 'Make sure your address is clear',
    capture_height: 300,
    icon: 'call',
    set: 'MaterialIcons',
  },
  {
    document_type: 'insurance_policy',
    label: 'Insurance policy',
    description: 'Make sure your address is clear',
    capture_description: 'Make sure your address is clear',
    capture_height: 300,
    icon: 'request_quote',
    set: 'MaterialIcons',
  },
  {
    document_type: 'retail_store',
    label: 'Retail store',
    description: 'Make sure your address is clear',
    capture_description: 'Make sure your address is clear',
    capture_height: 300,
    icon: 'store',
    set: 'MaterialIcons',
  },
];

export default function AddressVerification(props) {
  const {
    formikProps,
    name,
    layout,
    setLayout,
    navigation,
    submitForm,
  } = props;
  const { initialValues } = formikProps;
  const [state, setState] = useState('list');
  const [items, setItems] = useState(defaultItems);
  const [activeItem, setActiveItem] = useState(0);
  const [fetchingDocument, setFetchingDocument] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState();

  // const dispatch = useDispatch();
  const { colors } = useTheme();

  // useEffect(() => {
  //   return () => {
  //     dispatch(fetchData('document'));
  //   };
  // }, []);

  useEffect(() => {
    mergeInitialDocuments();
  }, [initialValues]);

  useEffect(() => {
    setError(null);
    adjustLayout();
  }, [state]);

  useEffect(() => {
    if (layout.displayImage && state === 'upload') adjustLayout();
  }, [layout]);

  const adjustLayout = () =>
    setLayout({
      displayImage: state === 'list',
      displayHeading: state === 'list',
      displayDescription: state === 'list',
      displayButton: state === 'list',
    });

  function mergeInitialDocuments() {
    defaultItems.forEach(item => {
      item.file = initialValues[name]?.[item.document_type]?.[0]?.file;
      item.status = initialValues[name]?.[item.document_type]?.[0]?.status;
    });
    setItems(defaultItems);
  }

  async function handleFileUpload() {
    setSubmitting(true);

    const isFile = items[activeItem].file?.uri?.match(/.pdf/);

    const compressedFile = isFile
      ? items[activeItem].file
      : await compressImage(items[activeItem].file, 0.3);

    let file = {
      uri: compressedFile.uri,
      name:
        items[activeItem].file.name ||
        `${uuidv4()}.${isFile ? '.pdf' : '.jpg'}`,
      type: isFile ? 'application/pdf' : 'image/jpg',
    };

    createDocument(file, items[activeItem].document_type)
      .then(resp => {
        let tempItems = [...items];
        tempItems[activeItem].file = resp.file;
        setItems(tempItems);

        setSubmitting(false);

        submitForm();
      })
      .catch(error => {
        setError(
          error?.file ? `\n${error?.file[0]}` : error.non_field_errors[0],
        );
        setSubmitting(false);
      });
  }

  function renderList() {
    return (
      <FlatList
        data={items}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              setState('upload');
              setActiveItem(index);
            }}>
            <View flex={1} fD={'row'} aI={'center'} w={'100%'} mb={1}>
              <View
                bC={
                  !item.status
                    ? 'primary'
                    : item.status === 'pending'
                    ? '#D3D3D3'
                    : item.status === 'verified'
                    ? '#0DAF2D'
                    : '#cc2538'
                }
                bR={100}
                p={0.5}
                mr={1}>
                <Icon
                  name={
                    !item.status
                      ? item.icon
                      : item.status === 'pending'
                      ? 'hourglass-empty'
                      : item.status === 'verified'
                      ? 'check'
                      : 'close'
                  }
                  set={
                    !item.set || item.status === 'pending'
                      ? 'MaterialIcons'
                      : item.set
                  }
                  size={26}
                  color={
                    item.status === 'pending'
                      ? 'gray'
                      : item.status
                      ? 'white'
                      : 'primaryContrast'
                  }
                />
              </View>
              <Text s={18} fW={'500'}>
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.label}
      />
    );
  }

  function renderSection() {
    const captureImage = () =>
      navigation.navigate('ImageCapture', {
        config: {
          title: items[activeItem].label,
          subtitle: items[activeItem].capture_subtitle,
          description: items[activeItem].capture_description,
          height: items[activeItem].capture_height,
        },
        onCapture: image => {
          let tempItems = [...items];
          tempItems[activeItem].file = image;
          setItems(tempItems);
        },
      });

    const selectDocument = () => {
      setFetchingDocument(true);
      DocumentPicker.getDocumentAsync({ type: 'application/pdf' }).then(
        resp => {
          if (resp?.type === 'cancel') return setFetchingDocument(false);

          let tempItems = [...items];
          tempItems[activeItem].file = resp;
          setItems(tempItems);

          setFetchingDocument(false);
        },
      );
    };

    return (
      <View scrollView>
        <View mb={0.5} style={{ position: 'relative' }}>
          <TouchableOpacity
            onPress={() => setState('list')}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: -10,
              zIndex: 100,
              width: 48,
            }}>
            <Icon
              name={'arrow-back-ios'}
              set={'MaterialIcons'}
              size={18}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                padding: 10,
              }}
            />
          </TouchableOpacity>

          <Text s={20} fW={'700'} lH={38} tA={'center'}>
            {defaultItems[activeItem].label}
          </Text>
        </View>
        {items[activeItem].file ? (
          <View mv={1} mb={1.5}>
            {items[activeItem].file?.uri?.match(/.pdf/) ||
            (typeof items[activeItem].file === 'string' &&
              items[activeItem].file?.match(/.pdf/)) ? (
              <React.Fragment>
                <CustomImage name={'documents'} height={100} width={100} />
                <View mt={0.5}>
                  {items[activeItem].file?.name ? (
                    <Text tA={'center'} s={16} c={'grey4'}>
                      {items[activeItem].file?.name}
                    </Text>
                  ) : (
                    <Text tA={'center'} s={12} c={'grey4'}>
                      (Cannot preview non-images)
                    </Text>
                  )}
                </View>
              </React.Fragment>
            ) : (
              <View
                style={{ position: 'relative', backgroundColor: colors.grey2 }}
                h={items[activeItem].capture_height ?? 480}
                bR={5}
                w={'100%'}>
                <Image
                  source={{
                    uri: items[activeItem].file.uri ?? items[activeItem].file,
                  }}
                  style={{
                    position: 'absolute',
                    zIndex: 100,
                    height: items[activeItem].capture_height ?? '100%',
                    width: '100%',
                    borderRadius: 5,
                  }}
                />
              </View>
            )}
          </View>
        ) : null}
        {defaultItems[activeItem].description && (
          <Text s={15} lH={24} tA={'center'}>
            {defaultItems[activeItem].description}
          </Text>
        )}
        <View mt={2}>
          {error && (
            <View mb={1}>
              <Text c={'red'} tA={'center'}>
                {error}
              </Text>
            </View>
          )}
          <Button
            label={items[activeItem].file ? 'CONTINUE' : 'TAKE A PICTURE'}
            variant={'contained'}
            loading={submitting}
            disabled={typeof items[activeItem].file === 'string' || submitting}
            color={'primary'}
            onPress={items[activeItem].file ? handleFileUpload : captureImage}
            wide
          />
          {!items[activeItem].file && (
            <View mt={0.25}>
              <Button
                label={'SELECT A DOCUMENT'}
                variant={'contained'}
                loading={fetchingDocument}
                disabled={fetchingDocument}
                color={'primary'}
                onPress={selectDocument}
                wide
              />
            </View>
          )}
        </View>
        {items[activeItem].file && (
          <React.Fragment>
            <Button
              type={'text'}
              wide
              tA={'center'}
              label="Take new pic"
              onPress={captureImage}
            />
            {/* <Button
              type={'text'}
              wide
              tA={'center'}
              label="Select new document"
              onPress={selectDocument}
            /> */}
          </React.Fragment>
        )}
      </View>
    );
  }

  return state === 'list' ? renderList() : renderSection();
}
