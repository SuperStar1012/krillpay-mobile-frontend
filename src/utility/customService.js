const token = {
  onfido: 'api_sandbox_us.IyYTliNp-lL.exBLYvoU1MqwVr2VitOvc2t9UXmtTLo8',
  rehive_admin:
    'bffd917432a58ced316c143980d75607917c636a2de08e6858b538f4a436eb8e',
};
const api = {
  // http://124.29.217.168:8060 local url
  upload_document: 'https://hive.txend.com/onfido-download', //live
  alpha3Code: 'https://hive.txend.com/alpha3Code', //live
  custom_extension: 'https://www.app.ext.krillpay.com/mapkrillpay', //live
  //onfido apis
  create_onfido_applicant: 'https://api.us.onfido.com/v3.6/applicants',
  onfido_workflow_run: 'https://api.us.onfido.com/v3.6/workflow_runs',
  create_onfido_sdkToken: 'https://api.us.onfido.com/v3.6/sdk_token',
  onfido_applicant_document_status:
    'https://api.us.onfido.com/v3.6/workflow_runs',
  //rehive user apis
  update_user_metadata: 'https://api.rehive.com/3/admin/users',
  upload_user_document: 'https://api.rehive.com/3/admin/users/documents',
  get_user_document:
    'https://api.rehive.com/3/admin/users/documents/?orderby=created&user',
  update_rehive_user: 'https://api.rehive.com/3/admin/users',
};
export const krillPayContacts = async (token, data) => {
  try {
    const response = await fetch(api.custom_extension, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, contact_list: data }),
    });
    const content = await response.json();
    return content;
  } catch (error) {
    console.log(`Error Uploading - ${error}`);
  }
};
