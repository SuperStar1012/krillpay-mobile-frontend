/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { compressImage } from 'utility/image';
import { View } from '../layout/View';
import { CustomImage } from '../outputs/CustomImage';
import { Button } from './Button';
import { PopUpGeneral } from '../layout/PopUpGeneral';
import * as ImagePicker from 'expo-image-picker';
import Text from 'components/outputs/Text';
import { useToast } from 'contexts/ToastContext';

export default function ProfilePictureUpload(props) {
  const { onFileLoad, existing, initialValues } = props;

  const [file, setFile] = useState(initialValues?.profile ?? existing);
  const [showSelections, setShowSelections] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (file && file.size / 100000 > 50)
      return showToast({
        id: 'file_size_too_big',
        type: 'danger',
      });

    if (onFileLoad) onFileLoad(file);
  }, [file]);

  async function choosePhoto() {
    const response = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: 'Images',
    });

    if (!response.canceled) {
      const compressedFile = await compressImage({
        file: response,
        factor: 0.3,
      });

      setFile({
        ...response,
        uri: compressedFile.uri,
      });
      setShowSelections(false);
    }
  }

  async function takePhoto() {
    const permission = await ImagePicker.getCameraPermissionsAsync();

    if (!permission.granted) {
      const request = await ImagePicker.requestCameraPermissionsAsync();
      if (!request.granted) return;
    }

    const response = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!response.canceled) {
      const compressedFile = await compressImage({
        file: response,
        factor: 0.3,
      });

      setFile({
        ...response,
        uri: compressedFile.uri,
      });
      setShowSelections(false);
    }
  }

  const buttonTextProps = {
    p: 0.5,
    s: 20,
    c: 'primary',
    tA: 'center',
    fW: '500',
  };

  return (
    <React.Fragment>
      <View aI={'center'} pb={1}>
        <View style={{ position: 'relative' }} w={250}>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width={250}
              height={250}
              borderRadius={150}
            />
          </SkeletonPlaceholder>
          <View pos="absolute">
            {file ? (
              <Image
                source={{ uri: file.uri ?? file }}
                //   src={file.type ? URL.createObjectURL(file) : file}
                //   maxWidth={200}
                //   width={200}
                //   height={200}
                //   key={file.id}
                style={{
                  width: 250,
                  height: 250,
                  borderRadius: 1000,
                }}
              />
            ) : (
              <CustomImage
                name={'userDetails'}
                primary={'#E6E6E6'}
                primaryContrast={'#B9B9B9'}
                height={250}
                width={250}
              />
            )}
          </View>
          <Button
            icon={'add'}
            iconSize={40}
            containerStyle={{
              position: 'absolute',
              right: 0,
              bottom: 0,
            }}
            size={'large'}
            buttonStyle={{
              width: 60,
              height: 60,
              minWidth: 60,
              paddingHorizontal: 0,
              borderRadius: 1000,
              padding: 0,
            }}
            onPress={() => setShowSelections(true)}></Button>
        </View>
      </View>

      <PopUpGeneral
        visible={showSelections}
        onDismiss={() => setShowSelections(false)}
        docked>
        <Button onPress={takePhoto}>
          <Text {...buttonTextProps} id="take_photo" />
        </Button>
        <Button onPress={choosePhoto}>
          <Text {...buttonTextProps} p={1} id="choose_photo" />
        </Button>
        <Button onPress={() => setShowSelections(false)}>
          <Text p={0.5} s={20} c="primary" tA="center" id="cancel" />
        </Button>
      </PopUpGeneral>
    </React.Fragment>
  );
}
