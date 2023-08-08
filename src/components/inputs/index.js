import React from 'react';
import { TextField } from '..';
import { useTheme } from '../context';

export default function Input(props) {
  const { config, control, ...restProps } = props;
  if (!config) return null;

  const { colors } = useTheme();

  let {
    type,
    id,
    label,
    placeholder,
    helper,
    multiline,
    name,
    disabled,
    validation,
    textContentType = 'none',
  } = config;
  let item = config;
  if (!name && id) name = id;

  const min = item.validation && item.validation.min;
  const max = item.validation && item.validation.max;

  const inputProps = {
    ...config,
    name,
    label,
    placeholder,
    // value,
    type,
    multiline,
    fullWidth: true,
    // onChangeText: value =>
    //   onChange ? onChange(value) : setFieldValue(name, value),
    // onBlur: () => setFieldTouched(id),
    // margin="normal"
    // error: showError ? error : '',
    // helper: showError ? error : helper ? helper : '',
    // disabled: isSubmitting || disabled,
    min,
    max,
    tintColor: colors ? colors.primary : '#5D48F8',
    textContentType,
  };

  switch (type) {
    default:
      // return (
      //   <Controller
      //     control={control}
      //     rules={validation}
      //     render={({ field: { onChange, onBlur, value } }) => (
      //       <TextField
      //         // style={styles.input}
      //         onBlur={onBlur}
      //         onChangeText={onChange}
      //         value={value}
      //       />
      //     )}
      //     {...inputProps}
      //     defaultValue=""
      //   />
      // );
      return <TextField {...inputProps} {...restProps} />;
  }
}

/*
TODO:
1. Link up other types of inputs
2. Rethink mapping

*/

// const [showDatePicker, setShowDatePicker] = useState(false);

// return (
//   <React.Fragment>
//     <View style={{ position: 'relative', paddingBottom: 8 }}>
//       <TouchableOpacity
//         onPress={() => setShowDatePicker(!showDatePicker)}
//         disabled={fieldConfig.disabled}
//         style={{
//           position: 'absolute',
//           width: '100%',
//           height: '100%',
//           zIndex: 100,
//         }}
//       />
//       <TextField
//         {...fieldConfig}
//         {...restProps}
//         value={value && moment(value).format('DD/MM/YYYY')}
//         editable={false}
//       />
//       <Icon
//         name={'date-range'}
//         set={'MaterialIcons'}
//         size={20}
//         color={'grey3'}
//         style={{
//           position: 'absolute',
//           right: 0,
//           margin: 'auto',
//           top: 8,
//           bottom: 0,
//         }}
//       />
//     </View>

//     {Platform.OS === 'android' && showDatePicker && (
//       <DateTimePicker
//         {...fieldConfig}
//         value={
//           (value && moment(value).toDate()) || new Date('1990-01-01')
//         }
//         mode="date"
//         display={'spinner'}
//         onChange={(event, date) => {
//           setShowDatePicker(false);
//           if (date)
//             setFieldValue(name, moment(date).format('YYYY-MM-DD'));
//         }}
//       />
//     )}
//     {Platform.OS === 'ios' && (
//       <PopUpGeneral
//         visible={showDatePicker}
//         onDismiss={() => {
//           Keyboard.dismiss();
//           setShowDatePicker(false);
//         }}
//         docked>
//         <DateTimePicker
//           {...fieldConfig}
//           value={
//             (value && moment(value).toDate()) || new Date('1990-01-01')
//           }
//           mode="date"
//           display={'inline'}
//           onChange={(event, date) =>
//             setFieldValue(name, moment(date).format('YYYY-MM-DD'))
//           }
//         />
//         <Button
//           label={'Done'}
//           type="text"
//           wide
//           onPress={() => {
//             Keyboard.dismiss();
//             setShowDatePicker(false);
//           }}
//         />
//       </PopUpGeneral>
//     )}
//   </React.Fragment>
// );

// case 'country':
//   return (
//     <CountryInput
//       label={item.label}
//       setValue={value => setFieldValue(name, value)}
//       value={value}
//       error={touch && error}
//       key={item.id}
//       disabled={fieldConfig.disabled}
//       input
//     />
//   );
// case 'switch':
//   return (
//     <Switch
//       {...item}
//       label={item.description}
//       onValueChange={() => setFieldValue(id, !value)}
//       value={value}
//       error={touch && error}
//       color={'primary'}
//       key={item.id}
//     />
//   );
// case 'checkbox':
//   return (
//     <CheckboxSimple
//       {...item}
//       onPress={() => setFieldValue(id, !value)}
//       value={value}
//       error={touch && error}
//       key={item.id}
//     />
//   );
// case 'terms':
//   return (
//     <Checkbox
//       {...item}
//       toggleValue={() => {
//         Keyboard.dismiss();
//         setFieldValue(id, !value);
//       }}
//       value={value}
//       error={touch && error}
//       key={item.id}
//       containerStyle={{ paddingVertical: 12 }}
//     />
//   );
// case 'date':
//   return (
//     <DateInput
//       {...restProps}
//       field={fieldConfig}
//       setFieldValue={setFieldValue}
//     />
//   );
// case 'dropdown':
//   return (
//     <SearchModal
//       {...fieldConfig}
//       {...restProps}
//       setValue={value => setFieldValue(name, value)}
//     />
//   );
// case 'profile_picture':
// case 'image':
//   return (
//     <ProfilePictureUpload
//       {...fieldConfig}
//       {...restProps}
//       onFileLoad={value => setFieldValue(name, value)}
//     />
//   );
// case 'location':
//   return (
//     <LocationInput
//       {...fieldConfig}
//       {...restProps}
//       onChange={value => setFieldValue(name, value)}
//     />
//   );
// case 'multiselect':
//   return (
//     <DropdownMultiSelect
//       {...fieldConfig}
//       {...restProps}
//       setValue={value => setFieldValue(name, value)}
//     />
//   );
// case 'mobile':
//   return (
//     <MobileInput
//       {...fieldConfig}
//       {...restProps}
//       onChange={value => setFieldValue(name, value)}
//     />
//   );
// case 'timezone':
//   return (
//     <TimezoneInput
//       label={item.label}
//       setValue={value => setFieldValue(item.id, value)}
//       value={value}
//       error={touch && error}
//       key={item.id}
//     />
//   );
// case 'doc_dates':
//   const issuance_date = values?.issuance_date ?? '';

//   const expiry_date = values?.expiry_date ?? '';
//   function handleDateUpdate(name, value) {
//     setFieldValue(name, value);
//     if (
//       (name === 'issuance_date' && values?.expiry_date) ||
//       (name === 'expiry_date' && values?.issuance_date)
//     )
//       setFieldValue('doc_dates', true);
//   }
//   return (
//     <View fD="row" f={1}>
//       <View fD="column" f={1} mr={0.5}>
//         <DateInput
//           {...restProps}
//           field={{
//             ...fieldConfig,
//             value: issuance_date,
//             label: 'Issuance date',
//             name: 'issuance_date',
//             maximumDate: new Date(),
//           }}
//           initialDate=""
//           setFieldValue={handleDateUpdate}
//         />
//       </View>
//       <View f={1} ml={0.5}>
//         <DateInput
//           {...restProps}
//           field={{
//             ...fieldConfig,
//             value: expiry_date,
//             label: 'Expiry date',
//             name: 'expiry_date',
//             minimumDate: new Date(),
//           }}
//           initialDate=""
//           setFieldValue={handleDateUpdate}
//         />
//       </View>
//     </View>
//   );
// case 'select':
//   return (
//     <Selector
//       {...fieldConfig}
//       {...restProps}
//       value={value}
//       onValueChange={value => setFieldValue(name, value)}
//     />
//   );
// case 'password':
//   return <Password {...fieldConfig} />;
// case 'country':
//   return <Country {...fieldConfig} />;
// case 'clearable':
//   return <Clearable {...fieldConfig} setFieldValue={setFieldValue} />;
// case 'checkbox':
//   return <MyCheckbox {...fieldConfig} setFieldValue={setFieldValue} />;
// case 'switch':
//   return <MySwitch {...fieldConfig} setFieldValue={setFieldValue} />;
