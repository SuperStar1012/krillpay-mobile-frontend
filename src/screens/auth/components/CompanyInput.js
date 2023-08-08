import React from 'react';
import WelcomePageSearchInput from 'components/inputs/WelcomePageSearchInput';

export default function CompanyInput(props) {
  const {
    companies,
    formikProps,
    handleSubmit,
    publicCompanies,
    setCompanyID,
    color,
  } = props;

  function createSections(formikProps, companies, publicCompanies) {
    const { values } = formikProps;
    const { company } = values;
    const { recentCompanies } = companies;
    let sections = [];

    const recentData = company
      ? recentCompanies.filter(
          item =>
            (item.id
              ? item.id.toLowerCase().includes(company.toLowerCase())
              : false) ||
            (item.name
              ? item.name.toLowerCase().includes(company.toLowerCase())
              : false),
        )
      : recentCompanies;

    try {
      if (recentData.length > 0) {
        sections.push({
          title: 'recent_wallets',
          data: recentData,
          listItemTitle: item => (item && item.name ? item.name : item.id),
          listItemIcon: item =>
            item && item.icon ? item.icon : item.logo ? item.logo : '',
          listItemOnPress: item => setCompanyID(item.id),
        });
      }
      if (publicCompanies) {
        const publicData = company
          ? publicCompanies.filter(item =>
              item.id
                ? item.id.toLowerCase().includes(company.toLowerCase())
                : false || item.name
                ? item.name.toLowerCase().includes(company.toLowerCase())
                : false,
            )
          : publicCompanies;

        if (publicData.length > 0) {
          sections.push({
            title: 'listed',
            data: publicData,
            listItemTitle: item => (item && item.name ? item.name : ''),
            listItemIcon: item =>
              item && item.icon ? item.icon : item.logo ? item.logo : '',
            listItemOnPress: item => setCompanyID(item.id),
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
    return sections;
  }

  return (
    <WelcomePageSearchInput
      key="editor1"
      label={'app_id'}
      placeholder={'app_id_placeholder'}
      // helper={'Please enter your App ID'}
      onChangeText={value => formikProps.setFieldValue('company', value)}
      // onBlur={() => formikProps.setFieldTouched('company')}
      tintColor={'#5D48F8'}
      onSubmitEditing={() => handleSubmit(formikProps)}
      returnKeyType={'done'}
      autoFocus
      error={formikProps.errors.company}
      autoCapitalize={'none'}
      autoCorrect={false}
      color={color}
      sections={createSections(formikProps, companies, publicCompanies)}
    />
  );
}
