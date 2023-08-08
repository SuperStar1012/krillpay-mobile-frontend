import React from 'react';
import { Keyboard } from 'react-native';
import { TextField } from '..';
import CountryInput from '../modals/CountryInput';
import LocationInput from '../inputs/LocationInput';
import MobileInput from '../inputs/MobileInput';
import DropdownMultiSelect from '../inputs/DropdownMultiSelect';
import { Switch } from './Switch';
import CheckboxSimple from './CheckboxSimple';
import { Checkbox } from './Checkbox';
import { useTheme } from '../context';
import ProfilePictureUpload from './ProfilePictureUpload';
import { View } from '../layout/View';
import SearchModal from '../modals/SearchModal';
import TimezoneInput from 'components/modals/TimezoneInput';
import Selector from './Selector';
import DateInput from './DateInput';
import IDNumberInput from './IDNumberInput';
import EmailInput from './EmailInput';

const FormikInput = props => {
  return <FormikInputBase {...props} />;
};

const FormikInputBase = ({
  field,
  formikProps,
  formErrors,
  onChange,
  hideHelper,
  ...restProps
}) => {
  if (!field) return null;

  const {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
  } = formikProps;

  const { colors } = useTheme();

  let {
    type,
    placeholder,
    helper,
    multiline,
    name,
    id = name,
    label = id,
    disabled,
    textContentType = 'none',
    required,
  } = field;

  let item = field;
  if (!name && id) name = id;

  const min = item.validation && item.validation.min;
  const max = item.validation && item.validation.max;

  const error = errors?.[name] ?? formErrors?.[name];
  const value = values[name];
  const touch = touched[name];
  const showError = error && touch;

  const fieldConfig = {
    ...field,
    required: name === 'line_2' ? false : required,
    name,
    label,
    placeholder,
    value,
    type,
    multiline,
    fullWidth: true,
    onChangeText: value =>
      onChange ? onChange(value) : setFieldValue(name, value),
    onBlur: () => setFieldTouched(id),
    // margin="normal"
    error: showError ? error : '',
    helper: showError ? error : helper ? helper : '',
    disabled: isSubmitting || disabled,
    min,
    max,
    tintColor: colors ? colors.primary : '#5D48F8',
    textContentType,
  };

  switch (type) {
    case 'country':
      return (
        <CountryInput
          {...fieldConfig}
          setValue={value => setFieldValue(name, value)}
          key={item.id}
          input
        />
      );
    case 'switch':
      return (
        <Switch
          {...item}
          label={item.description}
          onValueChange={() => setFieldValue(id, !value)}
          value={value}
          error={touch && error}
          color={'primary'}
          key={item.id}
        />
      );
    case 'checkbox':
      return (
        <CheckboxSimple
          {...item}
          onPress={() => setFieldValue(id, !value)}
          value={value}
          error={touch && error}
          key={item.id}
        />
      );
    case 'terms':
      return (
        <Checkbox
          {...item}
          toggleValue={() => {
            Keyboard.dismiss();
            setFieldValue(id, !value);
          }}
          value={value}
          error={touch && error}
          key={item.id}
          containerStyle={{ paddingVertical: 12 }}
        />
      );
    case 'date':
      return (
        <DateInput
          {...restProps}
          field={fieldConfig}
          setFieldValue={setFieldValue}
        />
      );
    case 'dropdown':
      return (
        <SearchModal
          {...fieldConfig}
          {...restProps}
          setValue={value => setFieldValue(name, value)}
        />
      );
    case 'profile_picture':
    case 'image':
      return (
        <ProfilePictureUpload
          {...fieldConfig}
          {...restProps}
          onFileLoad={value => setFieldValue(name, value)}
        />
      );
    case 'location':
      return (
        <LocationInput
          {...fieldConfig}
          {...restProps}
          onChange={value => setFieldValue(name, value)}
        />
      );
    case 'multiselect':
      return (
        <DropdownMultiSelect
          {...fieldConfig}
          {...restProps}
          setValue={value => setFieldValue(name, value)}
        />
      );
    case 'mobile':
      return (
        <MobileInput
          {...fieldConfig}
          {...restProps}
          onChange={value => setFieldValue(name, value)}
        />
      );
    case 'email':
      return (
        <EmailInput
          {...fieldConfig}
          {...restProps}
          onChange={value => setFieldValue(name, value)}
        />
      );
    case 'timezone':
      return (
        <TimezoneInput
          label={item.label}
          setValue={value => setFieldValue(item.id, value)}
          value={value}
          error={touch && error}
          key={item.id}
        />
      );
    case 'doc_dates':
      const issuance_date = values?.issuance_date ?? '';

      const expiry_date = values?.expiry_date ?? '';
      function handleDateUpdate(name, value) {
        setFieldValue(name, value);
        if (
          (name === 'issuance_date' && values?.expiry_date) ||
          (name === 'expiry_date' && values?.issuance_date)
        )
          setFieldValue('doc_dates', true);
      }
      return (
        <View fD="row" f={1}>
          <View fD="column" f={1} mr={0.5}>
            <DateInput
              {...restProps}
              field={{
                ...fieldConfig,
                value: issuance_date,
                label: 'Issuance date',
                name: 'issuance_date',
                maximumDate: new Date(),
              }}
              initialDate=""
              setFieldValue={handleDateUpdate}
            />
          </View>
          <View f={1} ml={0.5}>
            <DateInput
              {...restProps}
              field={{
                ...fieldConfig,
                value: expiry_date,
                label: 'Expiry date',
                name: 'expiry_date',
                minimumDate: new Date(),
              }}
              initialDate=""
              setFieldValue={handleDateUpdate}
            />
          </View>
        </View>
      );
    case 'select':
      return (
        <Selector
          {...fieldConfig}
          {...restProps}
          value={value}
          onValueChange={value => setFieldValue(name, value)}
        />
      );
    case 'id_number':
      return (
        <IDNumberInput
          {...fieldConfig}
          {...restProps}
          formikProps={formikProps}
        />
      );
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
    default:
      return (
        <TextField
          hideHelper={hideHelper ? true : false}
          {...fieldConfig}
          {...restProps}
        />
      );
  }
};

export default FormikInput;

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
