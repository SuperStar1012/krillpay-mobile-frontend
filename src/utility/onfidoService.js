import { getUser, listAddress } from 'utility/rehive';
import {
  createOnfidoApplicant,
  bindOnfidoApplicant,
  patch_rehive_metadata,
  getAlpha3Code,
} from 'utility/customService';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const OnfidoService = async () => {
  try {
    
    const info = await getUser();
    const address = await listAddress();
    const { alpha3 } = await getAlpha3Code(address[0].country);
    if (
      info &&
      info.data &&
      (!info.data.metadata || Object.keys(info.data.metadata).length == 0)
    ) {
      const { first_name, last_name, birth_date, id } = info.data;

      if (alpha3) {
        const applicant_info = {
          first_name: first_name,
          last_name: last_name,
          dob: birth_date,
          address: {
            postcode: address[0].postal_code ? address[0].postal_code : '99950',
            country: alpha3,
            state: alpha3 == 'USA' ? 'TX' : '',
          },
        };
        const applicant = await createOnfidoApplicant(applicant_info);

        const workflow_run = await bindOnfidoApplicant({
          workflow_id: 'd7c4c141-68e5-4a4e-ad78-8272a9b10e4c',
          applicant_id: applicant.id,
        });

        const metadata = {
          applicant_id: workflow_run.applicant_id,
          workflowRunId: workflow_run.id,
          onfido_document: 'not-verified',
          id: id,
        };
        const update = await patch_rehive_metadata(id, metadata);
        if (update) {
          await AsyncStorage.setItem('onfido_info', JSON.stringify(metadata));
        }
      }
    } else if (
      info &&
      info.data &&
      Object.keys(info.data.metadata).length != 0
    ) {
      console.log('meta data exist !!!', info.data.metadata);
      await AsyncStorage.setItem(
        'onfido_info',
        JSON.stringify(info.data.metadata),
      );
    }
  } catch (e) {
    throw new Error(e);
  }
};
