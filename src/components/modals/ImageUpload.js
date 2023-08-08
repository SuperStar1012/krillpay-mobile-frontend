import React, { useState } from 'react';
import { Image, Dimensions, Platform } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { compressImage } from 'utility/image';
import { PopUpGeneral } from '../layout/PopUpGeneral';
import { Button } from '../inputs/Button';
import Text from '../outputs/Text';
import { View } from '../layout/View';

const SCREEN_WIDTH = Dimensions.get('window').width;

function ImageUpload(props) {
  const { show, setShow, onSuccess, text } = props;

  const [state, setState] = useState('landing');
  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function launchCamera() {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (Platform.OS === 'android')
      await Permissions.askAsync(Permissions.AUDIO_RECORDING);

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      quality: 0.7,
    });

    handleImagePicker(result);
  }

  async function launchImageLibrary() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    handleImagePicker(result);
  }

  function handleImagePicker(result) {
    if (!result.cancelled) {
      setState('confirm');
      setImage(result);
    }
  }

  async function uploadProfilePhoto(file) {
    try {
      const compressedFile = await compressImage({
        file,
        factor: 0.3,
      });

      file = {
        ...file,
        uri: compressedFile.uri,
      };

      setLoading(false);
      setShow(false);
      onSuccess && onSuccess(file);
    } catch (error) {
      console.log(error);
      setError(
        error.message
          ? error.message
          : error.non_field_errors && error.non_field_errors[0],
      );
      setLoading(false);
    }
  }

  function handleUpload() {
    const parts = image?.uri?.split('/');
    const name = parts[parts.length - 1];
    const file = {
      ...image,
      name,
      type: 'image/jpg',
    };
    setLoading(false);
    uploadProfilePhoto(file);
  }

  const onDismiss = () => setShow(false);

  function renderLanding() {
    return (
      <View>
        {text && (
          <Text p={1} tA={'center'}>
            {text}
          </Text>
        )}
        <Button
          id="camera"
          onPress={launchCamera}
          wide
          containerStyle={{ paddingBottom: 8 }}
        />
        <Button
          color="secondary"
          id="gallery"
          wide
          onPress={launchImageLibrary}
        />

        <Text p={1} tA={'center'} fW={'400'} s={14}></Text>
        <Button type="text" id="cancel" wide onPress={() => onDismiss()} />
      </View>
    );
  }

  function renderConfirm() {
    const {
      viewStyleContent,
      viewStyleButtonContainer,
      viewStyleImageContainer,
    } = styles;
    const width = SCREEN_WIDTH - 64;
    const height = Math.min(image.height * (width / image.width), width);

    return (
      <View style={viewStyleContent}>
        <View style={viewStyleImageContainer}>
          {image.type !== 'image' ? (
            <Text p={1}></Text>
          ) : (
            <Image
              style={{ height, width, borderRadius: 4 }}
              source={{ uri: image.uri }}
              resizeMode={'contain'}
            />
          )}
        </View>
        {error ? (
          <View p={0.5}>
            <Text c={'error'} tA={'center'} id={error}></Text>
          </View>
        ) : null}
        <View style={viewStyleButtonContainer}>
          <Button
            id="confirm_and_upload"
            color="primary"
            wide
            loading={loading}
            disabled={loading}
            onPress={handleUpload}
          />
          <View mv={0.5}>
            <Button
              id="choose_new"
              color="secondary"
              wide
              onPress={() => setState('landing')}
            />
          </View>
          <Button
            id="cancel"
            color="secondary"
            type="text"
            wide
            onPress={onDismiss}
          />
        </View>
      </View>
    );
  }

  return (
    <PopUpGeneral visible={show} onDismiss={onDismiss} error={error}>
      {state === 'confirm' ? renderConfirm() : renderLanding()}
    </PopUpGeneral>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
  },
  viewStyleContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  viewStyleButtonContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
    width: '100%',
  },
  viewStyleImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  textStyleHeader: {
    fontSize: 20,
    padding: 8,
    textAlign: 'center',
  },
  textStyleDescription: {
    fontSize: 14,
    padding: 8,
    textAlign: 'center',
  },
};

export { ImageUpload };
