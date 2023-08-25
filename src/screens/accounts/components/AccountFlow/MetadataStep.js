import React from 'react';
import { Text, TextField, Button, View } from 'components';
import { useTheme } from 'contexts/ThemeContext';
import { Controller } from 'react-hook-form';
import PageContent from 'components/layout/PageContent';

export default function MetadataStep(props) {
  const { colors } = useTheme();
  const { form, config, onNext } = props;
  const { getValues, control, setValue } = form;
  const metadata = (getValues()?.metadata ?? {}) || {};

  function handleValueChange(fieldId, fieldLabel, value, onChange) {
    onChange(value);
    let _metadata = metadata || {};
    _metadata[fieldId] = { label: fieldLabel, value };
    setValue('metadata', { ..._metadata });
  }

  const isDisabled = () => {
    let disableStatus = false;
    const requiredFields = config?.fields?.filter(field => field?.required);
    for (const field of requiredFields) {
      if (disableStatus) break;
      switch (field?.inputType) {
        case 'text':
          disableStatus = !(metadata && metadata?.[field?.id]?.value);
          break;
        case 'number':
          disableStatus = !(
            metadata &&
            !isNaN(metadata?.[field?.id]?.value) &&
            !isNaN(parseFloat(metadata?.[field?.id]?.value))
          );
          break;

        default:
          disableStatus = !(metadata && metadata?.[field?.id]?.value);
          break;
      }
    }
    return disableStatus;
  };

  return (
    <View f={1} scrollView>
      <Text s={20} tA="center" p={0.25} id={'add_metadata'} ns="accounts" />
      <PageContent>
        {config?.fields?.map(field => {
          return (
            <Controller
              key={field?.id}
              name={field?.id}
              control={control}
              rules={{ required: field?.required }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label={field?.label}
                  multiline={field?.multiline}
                  tintColor={colors?.primary}
                  onBlur={onBlur}
                  onChangeText={value =>
                    handleValueChange(field?.id, field?.label, value, onChange)
                  }
                  value={value}
                  placeholder={field?.placeholder}
                  type={field?.inputType === 'number' ? 'number' : 'text'}
                />
              )}
              defaultValue=""
            />
          );
        })}
      </PageContent>
      <PageContent pb={1.5}>
        <Button disabled={isDisabled()} id="NEXT" wide onPress={onNext} />
      </PageContent>
    </View>
  );
}
