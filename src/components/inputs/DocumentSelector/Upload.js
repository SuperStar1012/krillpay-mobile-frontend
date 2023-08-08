import React, { useState, useEffect } from 'react';
import Image from 'components/outputs/Image';
import { View, Button, Text } from 'components';
import { CustomImage } from 'components/outputs/CustomImage';
import { createDocumentNew as createDocument } from 'utility/rehive';
import { uuidv4 } from 'utility/general';
import { compressImage } from 'utility/image';
import { uniq, isEmpty } from 'lodash';
import { FormikFields } from 'components/inputs/FormikForm';
import * as inputs from 'config/inputs/inputs';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import en from 'screens/profile/config/locales/profile.en';
import { useRehiveContext } from 'contexts';
import { isSSN } from 'utility/validation';
import { checkWyreService } from 'extensions/wyre/util';

export default function Upload(props) {
  const {
    onDismiss,
    type,
    navigation,
    uploadIndex,
    setUploadIndex,
    uploaded = [],
    formikProps,
    hideFields,
    setHasTempDoc,
    category,
  } = props;

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reSelect, setReSelect] = useState(false);

  const {
    context: { services },
  } = useRehiveContext();

  useEffect(() => {
    if (!uploaded?.length || files.length) return;
    let display = [];

    if (type?.requireBack) {
      let frontDisplays = uploaded?.filter(x => x.metadata?.side === 'front');
      let backDisplays = uploaded?.filter(x => x.metadata?.side === 'back');

      display = [
        frontDisplays?.find(x => x.status === 'verified') ?? frontDisplays?.[0],
        backDisplays?.find(x => x.status === 'verified') ?? backDisplays?.[0],
      ].filter(x => x);
    }

    if (!display?.length)
      display = [
        uploaded?.find(x => x.status === 'verified') ?? uploaded?.[0],
      ].filter(x => x);

    setFiles(
      display?.map((x, index) => {
        return {
          uploadPath: x.file,
          index,
          metadata: x.metadata,
        };
      }),
    );

    setErrors(display?.map(x => x.note)?.filter(x => x));
  }, [uploaded]);

  let config = [
    {
      title: en?.[type?.id],
      description: '',
      ...type,
    },
  ];

  if (type?.requireBack && !uploaded.length) {
    config.push({ ...config[0], subtitle: 'Back of document' });
    config[0].subtitle = 'Front of document';
    delete config[0].fields;
  }

  const activeFiles =
    uploaded?.length && !reSelect
      ? files
      : files?.filter(x => x.index === uploadIndex);

  useEffect(() => {
    setHasTempDoc(!!activeFiles?.length);
  }, [activeFiles?.length]);

  const hasWyreService = checkWyreService(services);

  const isValid =
    hasWyreService &&
    category?.id === 'proof_of_identity' &&
    (type?.requireBack ? files.length > 1 : true)
      ? isSSN(formikProps?.values?.id_number)
      : true;

  const buttons = [
    {
      label: 'CONTINUE',
      color: 'primary',
      onPress: () => {
        if ((reSelect || !uploaded.length) && uploadIndex < config.length - 1) {
          setReSelect(false);
          setUploadIndex(uploadIndex + 1);
        } else handleFileUpload();
      },
      wide: true,
      loading,
      hidden: !Boolean(activeFiles?.length),
      disabled: hideFields
        ? false
        : !!(
            config[uploadIndex]?.fields?.find(
              x => !formikProps?.values?.[x.name],
            ) || !isValid
          ),
    },
    {
      label: 'TAKE A PICTURE',
      color: 'primary',
      type: activeFiles?.length ? 'outlined' : 'contained',
      onPress: () => captureImage(),
      wide: true,
      hidden: Boolean(activeFiles?.length) && !reSelect,
    },
    {
      label: 'UPLOAD PICTURE',
      onPress: () => selectImage(),
      wide: true,
      type: 'outlined',
      hidden: Boolean(activeFiles?.length) && !reSelect,
    },
    {
      label: 'UPLOAD DOCUMENT',
      onPress: () => selectDocument(),
      wide: true,
      type: 'outlined',
      hidden: Boolean(activeFiles?.length) && !reSelect,
    },
    {
      label: 'Select new picture',
      onPress: () => setReSelect(true),
      wide: true,
      type: 'text',
      hidden:
        (!activeFiles?.length && !reSelect) ||
        (activeFiles?.length && reSelect),
    },
  ];

  async function onSelect(file) {
    if (reSelect) {
      const toReplace = files?.find(x => x.index === uploadIndex);
      setFiles([
        ...files?.filter(x => x.index != uploadIndex),
        { ...file, index: uploadIndex, metadata: toReplace?.metadata },
      ]);
    } else setFiles([...(files ?? []), { ...file, index: uploadIndex }]);

    setReSelect(false);
  }

  const captureImage = () =>
    navigation.navigate('ImageCapture', {
      config: [config[uploadIndex]],
      navigation,
      onComplete: images => onSelect(images?.[0]),
    });

  const selectImage = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    // if (status !== 'granted')
    //   alert('Sorry, we need camera roll permissions to make this work!');

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result?.cancelled) onSelect(result);
  };

  const selectDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync();

    if (result?.type !== 'cancel') onSelect(result);
  };

  async function handleFileUpload() {
    setLoading(true);
    setErrors([]);

    let uploadErrors = [];

    await Promise.all(
      files
        ?.filter(x => !x.uploadPath)
        ?.map(file => {
          return new Promise(async resolve => {
            const isFile = file?.uri?.match(/.pdf/);

            const compressedFile = isFile
              ? file
              : await compressImage({ file, factor: 0.3 });

            let _file = {
              uri: compressedFile.uri,
              name: file.name || `${uuidv4()}.${isFile ? '.pdf' : '.jpg'}`,
              type: isFile ? 'application/pdf' : 'image/jpg',
            };

            let metadata = file?.metadata ?? {};

            if (isEmpty(metadata) && type?.requireBack)
              metadata.side = file.index === 0 ? 'front' : 'back';

            if (formikProps?.values?.issuance_date)
              metadata.issuance_date = formikProps?.values?.issuance_date;
            if (formikProps?.values?.expiry_date)
              metadata.expiry_date = formikProps?.values?.expiry_date;

            createDocument(_file, type?.id, JSON.stringify(metadata))
              // .then(resp => refresh('document'))
              .catch(error => {
                uploadErrors.push(error?.non_field_errors?.[0]);
              })
              .finally(() => resolve());
          });
        }),
    );

    setErrors(uniq(uploadErrors));

    if (uploadErrors?.length) setLoading(false);
    else onDismiss && onDismiss();
  }

  const { fields } = config[uploadIndex] ?? {};

  return (
    <View pt={uploadIndex > 0 ? 0.5 : 0}>
      {!hideFields && fields?.length && Boolean(activeFiles?.length) && (
        <View mb={1}>
          <FormikFields
            formErrors={isValid ? null : { id_number: 'ssn_required' }}
            fields={fields.map(x => inputs?.[x?.name])}
            formikProps={formikProps}
            // setAwaiting={setAwaiting}
            // layout={layout}
            // setLayout={setLayout}
            navigation={navigation}
            submitForm={() => {}}
            noPadding
          />
        </View>
      )}
      {activeFiles?.map((file, index) => (
        <View key={index} mb={1}>
          {file?.uri?.match(/.pdf/) ||
          (file?.uploadPath && file?.uploadPath?.match(/.pdf/)) ? (
            <>
              <CustomImage name={'documents'} height={100} width={100} />
              <View mt={0.5}>
                {file?.name ? (
                  <Text tA={'center'} s={16} c={'grey4'}>
                    {file?.name}
                  </Text>
                ) : (
                  <Text tA={'center'} s={12} c={'grey4'}>
                    (Cannot preview non-images)
                  </Text>
                )}
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  position: 'relative',
                }}
                h={type?.capture_height ?? 230}
                bR={5}
                w={'100%'}>
                <Image
                  src={file.uri ?? file.uploadPath}
                  style={{
                    position: 'absolute',
                    zIndex: 100,
                    height: type?.capture_height ?? 230,
                    width: '100%',
                    borderRadius: 5,
                  }}
                />
              </View>
            </>
          )}
          {type?.requireBack && (
            <View mt={1}>
              <Text
                tA={'center'}
                s={18}
                id={
                  file?.metadata?.side === 'front'
                    ? 'front_doc_helper'
                    : file?.metadata?.side === 'back'
                    ? 'back_doc_helper'
                    : uploadIndex === 0
                    ? 'front_doc_helper'
                    : 'back_doc_helper'
                }
              />
            </View>
          )}
        </View>
      ))}
      {errors?.length ? (
        <View mb={1}>
          {errors?.map((error, index) => (
            <Text c={'red'} tA={'center'} key={index}>
              {error}
            </Text>
          ))}
        </View>
      ) : null}
      {buttons
        ?.filter(x => !x.hidden)
        ?.map((x, index) => (
          <View key={index} mb={0.25}>
            <Button {...x} />
          </View>
        ))}
    </View>
  );
}
