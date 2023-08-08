import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Button } from '../inputs/Button';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  generateOnfidoSdkToken,
  bindOnfidoApplicant,
  patch_rehive_metadata,
} from '../../utility/customService';
import ErrorOutput from '../../components/outputs/ErrorOutput';
import { Onfido } from '@onfido/react-native-sdk';

DocumentDeclineModal = React.forwardRef((props, ref) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [errorMessage, setErrorMessage] = useState(false);
	const { modalStyle } = styles;

	React.useImperativeHandle(ref, () => ({
		openModal() {
			setModalVisible(true);
		},
		closeModal() {
			setModalVisible(false);
		},
	}));

	const OnfidoVerification = async () => {
		try {
			setErrorMessage(false);
			const info = await AsyncStorage.getItem("onfido_info");
			const parse_info = JSON.parse(info);
			const workflow_run = await bindOnfidoApplicant({
				workflow_id: "d7c4c141-68e5-4a4e-ad78-8272a9b10e4c",
				applicant_id: parse_info.applicant_id,
			});

			const metadata = {
				applicant_id: workflow_run.applicant_id,
				workflowRunId: workflow_run.id,
				onfido_document: "not-verified",
				id: parse_info.id,
			};
			const update = await patch_rehive_metadata(parse_info.id, metadata);
			if (update.status == "success") {
				await AsyncStorage.setItem("onfido_info", JSON.stringify(metadata));
			}
			const { token } = await generateOnfidoSdkToken({
				applicant_id: workflow_run.applicant_id,
				application_id: "com.app.krillpay",
			});
			if (token) {
				const config = {
					sdkToken: token,
					workflowRunId: workflow_run.id,
				};
				Onfido.start(config)
					.then(async (res) => {
						console.log("OnfidoSDK: Success:", JSON.stringify(res));
						alert("Your document has been successfully uploaded for processing");
						const info = await AsyncStorage.getItem("onfido_info");
						const parseInfo = JSON.parse(info);
						const metadata = {
							applicant_id: parseInfo.applicant_id,
							workflowRunId: parseInfo.workflowRunId,
							onfido_document: "processing",
							id: parseInfo.id,
						};
						const update = await patch_rehive_metadata(parseInfo.id, metadata);
						if (update.status == "success") {
							console.log("uploaded succesfully######!!!!!!!!!!");
							await AsyncStorage.setItem("onfido_info", JSON.stringify(metadata));
						}
					})
					.catch((err) => {
						setErrorMessage(JSON.stringify(err.message));
						console.log("OnfidoSDK: Error:", err.code, err.message);
					});
			} else {
				setErrorMessage("Unable to generate onfido token");
				console.log("else block goes here");
			}
		} catch (e) {
			setErrorMessage(e.message);
			console.log("Error in OnfidoVerification --", e.message);
		}
	};

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
				<View
					style={{
						flexDirection: "row",
						position: "absolute",
						width: "100%",
						top: 12,
						right: 10,
						justifyContent: "flex-end",
					}}>
					<Button
						size="small"
						label="Skip"
						onPress={() => {
							setModalVisible(false);
						}}
					/>
				</View>
				<Text style={styles.heading}>Document Verification Failed</Text>

				<Text style={styles.text}>
					We apologize for the inconvenience. The document verification process has failed. Kindly reupload your document for verification.
				</Text>
				<Button
					onPress={() => {
						OnfidoVerification();
						setModalVisible(false);
					}}
					label="START NOW"
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
    height: 240,
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
    color: 'red',
    fontWeight: '700',
    fontSize: 17,
    marginTop: 23,
  },
});

export default DocumentDeclineModal;
