import React from 'react';
import LottieView from 'lottie-react-native';
import images from './images';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'contexts/ThemeContext';

function useLottieImage(props) {
  const { color, name } = props;
  const { colors } = useTheme();
  const configs = {
    success: {
      colorFilters: [
        {
          keypath: 'CHECK',
          color: 'white',
        },
        {
          keypath: 'MAIN',
          color: colors?.[color ? color : 'success'],
        },
      ],
    },
    // success: {
    //   colorFilters: [
    //     {
    //       keypath: 'Checkmark',
    //       color: colors?.success,
    //     },
    //     {
    //       keypath: 'First Line',
    //       color: colors?.success,
    //     },
    //     {
    //       keypath: 'Circle',
    //       color: colors?.success,
    //     },
    //   ],
    // },

    error: {
      colorFilters: [
        {
          keypath: 'MAIN 3',
          color: colors?.[color ? color : 'fail'],
        },
      ],
    },
    //error: {
    //   colorFilters: [
    //     {
    //       keypath: 'Vector 3',
    //       color: colors?.fail,
    //     },
    //     {
    //       keypath: 'Vector 4',
    //       color: colors?.fail,
    //     },
    //     {
    //       keypath: 'Vector 2',
    //       color: colors?.fail,
    //     },
    //     {
    //       keypath: 'Ellipse 2',
    //       color: colors?.fail,
    //     },
    //     {
    //       keypath: 'Shape Layer 2',
    //       color: colors?.fail,
    //     },
    //     {
    //       keypath: 'Shape Layer 1',
    //       color: colors?.error,
    //     },
    //   ],
    // },
  };
  return configs?.[name] ?? {};
}

export default function LottieImage(props) {
  const imageProps = useLottieImage(props);

  return <_LottieImage {...props} {...imageProps} />;
}

class _LottieImage extends React.Component {
  componentDidMount() {
    this.animation?.play();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.name !== this.props.name) {
      this.animation?.play();
    }
  }
  render() {
    const { size = 400, name, ...restProps } = this.props;
    if (!images[name]) {
      return null;
    }
    return (
      <View style={styles.animationContainer}>
        <LottieView
          ref={animation => {
            this.animation = animation;
          }}
          style={{
            width: size,
            height: size,
            zIndex: 200,
          }}
          {...restProps}
          source={images[name]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  animationContainer: {
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
