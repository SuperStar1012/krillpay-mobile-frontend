import React, { useState, useRef, useEffect } from 'react';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Picker from 'react-native-picker-select';
import { View } from '../layout/View';
import Text from '../outputs/Text';
import { Output } from '../outputs/Output';
import { Button } from './Button';
import { PopUpGeneral } from '../layout/PopUpGeneral';
import { useTheme } from '../context';
import { useTranslation } from 'react-i18next';
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useRoute } from '@react-navigation/native';

export default function Selector(props) {
  const {
    label,
    placeholder = 'picker_placeholder',
    formatValue = item => item?.label,
    multiline = false,
    bold,
    options,
    items = options,
    value,
    onValueChange,
    children,
    modal,
  } = props;

  const { colors } = useTheme();
  const [ cCode, setCCode] = useState("");
  const [ stateProvinceOptions, setStateProvinceOptions] = useState([]);
  const route = useRoute();

  function showModal() {
    setModalVisible(true);
  }

  function hideModal() {
    setModalVisible(false);
  }

  useEffect(()=>{
    //Get country code in case of onboarding
   getCountryCode();
  });

  const getCountryCode = async ()=>{
    const  countryCodeOnboarding =   await AsyncStorage.getItem('countryCodeOnboarding');
    setCCode(countryCodeOnboarding);   
    
    if(route?.name =="Onboarding"){
    if(countryCodeOnboarding == "US"){
      setStateProvinceOptions([    
        { label: 'Alabama', value: 'alabama', key: 'alabama' },
        { label: 'Alaska', value: 'alaska', key: 'alaska' },
        { label: 'Arizona', value: 'arizona', key: 'arizona' },
        { label: 'Arkansas', value: 'arkansas', key: 'arkansas' },
        { label: 'California', value: 'california', key: 'california' },

        { label: 'Colorado', value: 'colorado', key: 'colorado' },
        { label: 'Connecticut', value: 'connecticut', key: 'connecticut' },
        { label: 'Delaware', value: 'delware', key: 'delware' },
        { label: 'Florida', value: 'florida', key: 'florida' },
        { label: 'Georgia', value: 'georgia', key: 'georgia' },

        { label: 'Hawaii', value: 'hawaii', key: 'hawaii' },
        { label: 'Idaho', value: 'idaho', key: 'idaho' },
        { label: 'Illinois', value: 'illinois', key: 'illinois' },
        { label: 'Indiana', value: 'indiana', key: 'indiana' },
        { label: 'Iowa', value: 'iowa', key: 'iowa' },


        { label: 'Kansas', value: 'kansas', key: 'kansas' },
        { label: 'Kentucky', value: 'kentucky', key: 'kentucky' },
        { label: 'Louisiana', value: 'louisiana', key: 'louisiana' },
        { label: 'Maine', value: 'maine', key: 'maine' },
        { label: 'Maryland', value: 'maryland', key: 'maryland' },

        { label: 'Massachusetts', value: 'massachusetts', key: 'massachusetts' },
        { label: 'Michigan', value: 'michigan', key: 'michigan' },
        { label: 'Minnesota', value: 'Minnesota', key: 'Minnesota' },
        { label: 'Mississippi', value: 'Mississippi', key: 'Mississippi' },
        { label: 'Missouri', value: 'Missouri', key: 'Missouri' },

        { label: 'Montana', value: 'Montana', key: 'Montana' },
        { label: 'Nebraska', value: 'Nebraska', key: 'Nebraska' },
        { label: 'Nevada', value: 'Nevada', key: 'Nevada' },
        { label: 'New Hampshire', value: 'NewHampshire', key: 'NewHampshire' },
        { label: 'New Jersey', value: 'NewJersey', key: 'NewJersey' },

    
        { label: 'New Mexico', value: 'NewMexico', key: 'NewMexico' },
        { label: 'New York', value: 'NewYork', key: 'NewYork' },
        { label: 'North Carolina', value: 'NorthCarolina', key: 'NorthCarolina' },
        { label: 'North Dakota', value: 'NorthDakota', key: 'NorthDakota' },
        { label: 'Ohio', value: 'Ohio', key: 'Ohio' },

        { label: 'Oklahoma', value: 'Oklahoma', key: 'Oklahoma' },
        { label: 'Oregon', value: 'Oregon', key: 'Oregon' },
        { label: 'Pennsylvania', value: 'Pennsylvania', key: 'Pennsylvania' },
        { label: 'Rhode Island', value: 'RhodeIsland', key: 'RhodeIsland' },
        { label: 'South Carolina', value: 'SouthCarolina', key: 'SouthCarolina' },

        { label: 'South Dakota', value: 'SouthDakota', key: 'SouthDakota' },
        { label: 'Tennessee', value: 'Tennessee', key: 'Tennessee' },
        { label: 'Texas', value: 'Texas', key: 'Texas' },
        { label: 'Utah', value: 'Utah', key: 'Utah' },
        { label: 'Vermont', value: 'Vermont', key: 'Vermont' },

        { label: 'Virginia', value: 'Virginia', key: 'Virginia' },
        { label: 'Washington', value: 'Washington', key: 'Washington' },
        { label: 'West Virginia', value: 'WestVirginia', key: 'WestVirginia' },
        { label: 'Wisconsin', value: 'Wisconsin', key: 'Wisconsin' },
        { label: 'Wyoming', value: 'Wyoming', key: 'Wyoming' }


        ])
    }
    else{
      setStateProvinceOptions([    
        { label: 'Abia', value: 'abia', key: 'abia' },
        { label: 'Adamawa', value: 'adamawa', key: 'adamawa' },
        { label: 'Akwa Ibom', value: 'akwaibom', key: 'akwaibom' },
        { label: 'Anambra', value: 'anambra', key: 'anambra' },
        { label: 'Bauchi', value: 'bauchi', key: 'bauchi' },

        { label: 'Bayelsa', value: 'bayelsa', key: 'bayelsa' },
        { label: 'Benue', value: 'benue', key: 'benue' },
        { label: 'Borno', value: 'borno', key: 'borno' },
        { label: 'Cross River', value: 'crossriver', key: 'crossriver' },
        { label: 'Delta', value: 'delta', key: 'delta' },

        { label: 'Ebonyi', value: 'ebonyi', key: 'ebonyi' },
        { label: 'Edo', value: 'edo', key: 'edo' },
        { label: 'Ekiti', value: 'ekiti', key: 'ekiti' },
        { label: 'Enugu', value: 'enugu', key: 'enugu' },
        { label: 'Gombe', value: 'gombe', key: 'gombe' },

        { label: 'Imo', value: 'imo', key: 'imo' },
        { label: 'Jigawa', value: 'jigawa', key: 'jigawa' },
        { label: 'Kaduna', value: 'kaduna', key: 'kaduna' },
        { label: 'Kano', value: 'kano', key: 'kano' },
        { label: 'Katsina', value: 'kastina', key: 'kastina' },

        { label: 'Kebbi', value: 'kebbi', key: 'kebbi' },
        { label: 'Kogi', value: 'kogi', key: 'kogi' },
        { label: 'Kwara', value: 'kwara', key: 'kwara' },
        { label: 'Lagos', value: 'lagos', key: 'lagos' },
        { label: 'Nasarawa', value: 'nasarawa', key: 'nasarawa' },

        { label: 'Niger', value: 'niger', key: 'niger' },
        { label: 'Ogun', value: 'ogun', key: 'ogun' },
        { label: 'Ondo', value: 'ondo', key: 'ondo' },
        { label: 'Osun', value: 'osun', key: 'osun' },
        { label: 'Oyo', value: 'oyo', key: 'oyo' },

        { label: 'Plateau', value: 'plateau', key: 'plateau' },
        { label: 'Rivers', value: 'rivers', key: 'rivers' },
        { label: 'Sokoto', value: 'sokoto', key: 'sokoto' },
        { label: 'Taraba', value: 'taraba', key: 'taraba' },
        { label: 'Yobe', value: 'yobe', key: 'yobe' },
        { label: 'Zamfara', value: 'zamfara', key: 'zamfara' },

        ])
    }
  }

 
    

  }

  const { t } = useTranslation('common');
 

  let translatedItems = items.map(item => ({
    ...item,
    label: t(item?.label ?? item?.id),
  }));

  let translatedItemsStateProvince = stateProvinceOptions.map(item => ({
    ...item,
    label: t(item?.label ?? item?.id),
  }));

  const placeholderLabel = t(placeholder);

  const [modalVisible, setModalVisible] = useState(false);
  let disabled = items?.length < 2;

  function renderValue(item) {
    return (
      <View
        pt={0.25}
        pr={0.25}
        w={'100%'}
        aI={'center'}
        style={{
          borderBottomWidth: 1,
          borderBottomEndRadius: 5,
          borderBottomColor: modalVisible
            ? colors?.primary ?? 'rgba(0, 0, 0, .37)'
            : 'rgba(0, 0, 0, .15)',
          paddingBottom: 1,
          marginBottom: 4,
        }}
        fD={'row'}
        jC={'flex-end'}>
        {bold ? (
          <Text
            tA={'right'}
            s={22}
            style={{
              paddingRight: 8,
            }}
            id={formatValue(item)}
          />
        ) : (
          <View f={1}>
            <Output
              labelColor={modalVisible ? colors.primary : colors.fontLight}
              label={item || placeholder ? label : ''}
              values={multiline ? formatValue(item) : null}
              value={
                !multiline
                  ? item
                    ? item?.label
                    : placeholder
                    ? placeholder
                    : label
                  : ''
              }
            />
          </View>
        )}
        {!disabled && (
          <Icon
            name="chevron-down"
            size={20}
            color={'black'}
            style={{ opacity: 0.8, paddingTop: 4 }}
          />
        )}
      </View>
    );
  }

  if (items.length === 0) {
    items[0] = {
      label: '---',
      value: 'none:none',
      key: 'none',
    };
  }

  if (modal) {
    return (
      <React.Fragment>
        <Button
          disabled={disabled}
          onPress={() => (disabled ? null : showModal())}>
          {children
            ? children
            : renderValue(translatedItems.find(item => item.value === value))}
        </Button>
        <PopUpGeneral
          visible={modalVisible}
          // title={title}
          scrollView
          onDismiss={hideModal}
          docked>
          <View aI={'center'}>
            {translatedItems.map(item =>
              item ? (
                <View pb={0.5} w={'100%'}>
                  <Button
                    key={item.key}
                    id={item.label}
                    wide
                    onPress={() => {
                      onValueChange(item.value);
                      hideModal();
                    }}
                  />
                </View>
              ) : null,
            )}
            <Button label={'close'} type="text" wide onPress={hideModal} />
          </View>
        </PopUpGeneral>
      </React.Fragment>
    );
  }

  return (
    <>
    { cCode == null ?
    <Picker
      value={value}
      // placeholder={'Please select...'}
      disabled={disabled}
      placeholder={{ label: placeholderLabel }}
      onOpen={showModal}
      onClose={hideModal}
      items={translatedItems}
      onValueChange={value => onValueChange(value)}
      useNativeAndroidPickerStyle={false}
      hideIcon>
      {children
        ? children
        : renderValue(translatedItems.find(item => item.value === value))}
    </Picker>
    :

    <Picker
    value={value}
    // placeholder={'Please select...'}
    disabled={disabled}
    placeholder={{ label: placeholderLabel }}
    onOpen={showModal}
    onClose={hideModal}
    items={translatedItemsStateProvince}
    onValueChange={value => onValueChange(value)}
    useNativeAndroidPickerStyle={false}
    hideIcon>
          {children
        ? children
        : renderValue(translatedItemsStateProvince.find(item => item.value === value))}

      </Picker>


      }
    </>
  );
}
