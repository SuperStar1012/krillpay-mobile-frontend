import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Button } from '../inputs/Button';
import Modal from 'react-native-modal';

DocumentStatusModal = React.forwardRef((props, ref) => {
	const [modalVisible, setModalVisible] = useState(false);
	const { modalStyle } = styles;

	React.useImperativeHandle(ref, () => ({
		openModal() {
			setModalVisible(true);
		},
		closeModal() {
			setModalVisible(false);
		},
	}));

	return (
		<Modal
			animationInTiming={1}
			animationType={"fade"}
			animationOutTiming={1}
			isVisible={modalVisible}
			useNativeDriver
			transparent={true}
			style={{
				flex: 1,
				height: Dimensions.get("window").height,
				width: Dimensions.get("window").width,
			}}
			presentationStyle={"overFullScreen"}
			hideModalContentWhileAnimating>
			<View style={modalStyle}>
				<Text style={styles.heading}>Document Verification Status</Text>

				<Text style={styles.text}>Your document is currently in the verification process.</Text>
				<Button
					onPress={() => {
						setModalVisible(false);
					}}
					label="OK"
					style={styles.heading}
				/>
			</View>
		</Modal>
	);
});

const styles = StyleSheet.create({
  modalStyle: {
    position: 'absolute',
    top: '50%',
    left: '45%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#ffffff',
    width: '80%',
    height: 220,
    borderRadius: 10,

    transform: [
      { translateX: (-Dimensions.get('window').width * 2) / 5 },
      { translateY: -100 },
    ],
  },
  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  heading: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#044c8d',
    fontWeight: '700',
    fontSize: 17,
  },
});

export default DocumentStatusModal;
