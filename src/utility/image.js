import * as ImageManipulator from 'expo-image-manipulator';

export async function compressImage({ file, factor = 0.5, width }) {
  return await ImageManipulator.manipulateAsync(
    file.uri,
    [
      {
        resize: {
          width: width ?? file.width * factor,
        },
      },
    ],
    {
      compress: factor,
      format: ImageManipulator.SaveFormat.PNG,
    },
  );
}
