/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Image } from 'react-native';
import { uuidv4 } from 'utility/general';
import { compressImage } from 'utility/image';
import { View } from 'components/layout/View';
import {
  createDocumentNew as createDocument,
  updateProfile,
} from 'utility/rehive';
import { Icon } from 'components/outputs/Icon';
import { Text } from 'components';
import { Button } from 'components/inputs/Button';
import { CustomImage } from 'components/outputs/CustomImage';
import { useTheme } from 'components/context';
import * as DocumentPicker from 'expo-document-picker';
import { TextField } from 'components/inputs/TextField';

const defaultItems = [
  {
    document_type: 'passport',
    label: 'Passport',
    description: 'Make sure your details are clear',
    capture_description: 'Make sure your details are clear',
    capture_height: 230,
    icon: 'passport',
    set: 'MaterialCommunityIcons',
  },
  {
    document_type: 'drivers_license',
    label: "Driver's license",
    description: 'Make sure your details are clear',
    capture_description: 'Make sure your details are clear',
    capture_height: 230,
    icon: 'card-account-details',
    set: 'MaterialCommunityIcons',
  },
  {
    document_type: 'government_id',
    label: 'National identity card',
    description: 'Make sure your details are clear',
    icon: 'card-account-details-outline',
    capture_height: 230,
    capture_description: 'Make sure your details are clear',
    set: 'MaterialCommunityIcons',
  },
];

export default function IdentityVerification(props) {
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
  const [idNumber, setIdNumber] = useState();
  const [activeItem, setActiveItem] = useState(0);
  const [fetchingDocument, setFetchingDocument] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState();

  // const dispatch = useDispatch();
  const { colors } = useTheme();

  // useEffect(() => {
  //   return () => {
  //     dispatch(fetchData('profile'));
  //     dispatch(fetchData('document'));
  //   };
  // }, []);

  useEffect(() => {
    mergeInitialDocuments();
    setIdNumber(initialValues?.id_number);
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
    if (!initialValues) return;
    defaultItems.forEach(item => {
      item.file = initialValues[name]?.[item.document_type]?.[0]?.file;
      item.status = initialValues[name]?.[item.document_type]?.[0]?.status;
    });
    setItems(defaultItems);
  }

  async function handleSubmit(uploadFile) {
    setError(null);
    setSubmitting(true);

    if (defaultItems[activeItem]?.document_type === 'government_id')
      await updateProfile({ id_number: idNumber });

    if (typeof items[activeItem]?.file !== 'string') return handleFileUpload();

    if (!uploadFile) submitForm();
  }

  async function handleFileUpload() {
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
          <View mv={1} mb={1}>
            {defaultItems[activeItem].document_type === 'government_id' && (
              <View mb={1.5}>
                <TextField
                  {...{
                    tintColor: colors.primary,
                    label: 'ID number*',
                    value: idNumber,
                    error: Boolean(idNumber)
                      ? ''
                      : 'Please enter your ID number',
                    onChangeText: value => setIdNumber(value),
                  }}
                />
              </View>
            )}
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
              <React.Fragment>
                <View
                  style={{
                    position: 'relative',
                    backgroundColor: colors.grey2,
                  }}
                  h={items[activeItem].capture_height ?? 230}
                  bR={5}
                  w={'100%'}>
                  <Image
                    source={{
                      uri: items[activeItem].file.uri ?? items[activeItem].file,
                    }}
                    style={{
                      position: 'absolute',
                      zIndex: 100,
                      height: items[activeItem].capture_height ?? 230,
                      width: '100%',
                      borderRadius: 5,
                    }}
                  />
                </View>
              </React.Fragment>
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
            disabled={
              (typeof items[activeItem].file === 'string' &&
                defaultItems[activeItem].document_type !== 'government_id') ||
              (defaultItems[activeItem].document_type === 'government_id' &&
                items[activeItem].file &&
                !idNumber) ||
              submitting
            }
            color={'primary'}
            onPress={
              items[activeItem].file ? () => handleSubmit() : captureImage
            }
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
