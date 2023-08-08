import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, Platform, Dimensions } from 'react-native';
import { View, Text } from 'components';
import { Icon } from 'components/outputs/Icon';
import { Button } from 'components/inputs/Button';
import Header from 'components/layout/header';
import { Camera } from 'expo-camera';
import { omitBy, isNil } from 'lodash';
import { standardizeString } from 'utility/general';

/**
 *
 * @param {*} props [config: Array[]]
 *
 */
export default function ImageCapture(props) {
  const { navigation, route } = props;

  const routeParams = route?.params ?? {};
  const { onComplete, title, config } = routeParams;

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [activeConfigIndex, setActiveConfigIndex] = useState(0);
  const [images, setImages] = useState([]);

  const cameraRef = useRef('camera');

  const SCREEN_HEIGHT = Dimensions.get('window').height;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (images?.length === configs?.length) {
      onComplete && onComplete(images);
      navigation?.goBack();
    }
  }, [images?.length]);

  const configs = config?.map((x, index) => {
    return {
      title: x?.id ? standardizeString(x.id) : 'Capture image',
      ...omitBy(x, isNil),
    };
  });

  async function capture() {
    if (cameraRef) {
      setCapturing(true);

      cameraRef.current.takePictureAsync().then(image => {
        setImages([...images, image]);

        setActiveConfigIndex(activeConfigIndex + 1);
        setCapturing(false);
      });
    }
  }

  if (hasPermission === null) return <View />;

  if (hasPermission === false)
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );

  return (
    <View screen header style={{ backgroundColor: '#404040' }} f={1}>
      <Header
        navigation={navigation}
        back
        transparent
        title={title}
        color="#FFF"
      />
      <View ph={1.5} fG={1}>
        <View pb={1} fG={1} jC={'space-between'}>
          <View fG={1}>
            <View mb={2}>
              <Text s={20} fW={'500'} lH={38} tA={'center'} c={'white'}>
                {configs?.[activeConfigIndex]?.title ?? ''}
              </Text>
            </View>
            <Camera
              ref={cameraRef}
              type={type}
              style={
                configs?.[activeConfigIndex]?.capture_height
                  ? {
                      height:
                        configs?.[activeConfigIndex]?.capture_height >
                        SCREEN_HEIGHT / 2
                          ? SCREEN_HEIGHT / 2
                          : configs?.[activeConfigIndex]?.capture_height,
                    }
                  : { display: 'flex', flexGrow: 1 }
              }
              onCameraReady={() => setReady(true)}>
              <View style={{ position: 'absolute', left: 0, padding: 5 }}>
                <TouchableOpacity
                  onPress={() => {
                    setType(
                      type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                    );
                  }}>
                  <Icon
                    name={`flip-camera-${Platform.OS}`}
                    set={'MaterialIcons'}
                    size={30}
                    color={'#404040'}
                  />
                </TouchableOpacity>
              </View>
            </Camera>
            <View mv={2}>
              {configs?.[activeConfigIndex]?.subtitle ? (
                <View mb={0.5}>
                  <Text s={18} fW={'500'} tA={'center'} c={'white'}>
                    {configs?.[activeConfigIndex]?.subtitle}
                  </Text>
                </View>
              ) : null}
              {configs?.[activeConfigIndex]?.description ? (
                <Text tA={'center'} c={'white'}>
                  {configs?.[activeConfigIndex]?.description}
                </Text>
              ) : null}
            </View>
          </View>

          <Button
            label={'CAPTURE'}
            variant={'contained'}
            loading={capturing}
            disabled={!ready || capturing}
            color={'primary'}
            onPress={() => capture()}
            wide
          />
        </View>
      </View>
    </View>
  );
}
