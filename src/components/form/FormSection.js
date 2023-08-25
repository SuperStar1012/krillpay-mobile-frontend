import React from 'react';
import PageContent from 'components/layout/page/PageContent';
import Text from 'components/outputs/Text';
import BaseInputs from 'components/inputs';
import Group from './Group';
import Box from '@material-ui/core/Box';

import InfoIcon from '@material-ui/icons/Info';
import Tooltip from 'components/outputs/Tooltip';
import { Button } from 'components/inputs/Button';

export default function FormSection(props) {
  const {
    item,
    index,
    values = {},
    formState,
    altStyle,
    history,
    hide,
    noStyle,
    ...restProps
  } = props;

  const {
    id,
    title,
    fields = [],
    fields2,
    props: inputProps,
    condition,
    info,
    actions,
  } = item;

  const hideCondition =
    typeof condition === 'function' && values && !condition(values);

  const Content = (
    <>
      {title && (
        <Box pb={1} pt={altStyle ? 2 : 0} display="flex" flexDirection="row">
          <Text variant="h6" width="auto" id={title} />
          {Boolean(info) && (
            <Tooltip id={info}>
              <InfoIcon
                color="primary"
                style={{ marginLeft: 4, paddingLeft: 4 }}
              />
            </Tooltip>
          )}
          {/* {actions?.length &&
            actions.map(action => (
              <Button
                noPadding
                size="small"
                variant="text"
                color="primary"
                label={action}
                onPress={() => history.push('edit/')}
                // {...action}
              />
            ))} */}
        </Box>
      )}
      <Box flexDirection="row" display="flex" pt={!title && !noStyle ? 2.5 : 0}>
        <Box flexDirection="column" display="flex" flex={1}>
          <InputLayout {...props} fields={fields} inputProps={inputProps} />
        </Box>
        {Boolean(fields2) && (
          <Box flexDirection="column" display="flex" flex={1} ml={2}>
            <InputLayout {...props} fields={fields2} inputProps={inputProps} />
          </Box>
        )}
      </Box>
    </>
  );

  return noStyle ? (
    Content
  ) : (
    <PageContent
      style={{
        backgroundColor: altStyle ? '#FAFAFA' : '#FFFFFF',
        borderRadius: altStyle ? 15 : 0,
        marginBottom: altStyle ? 32 : 0,
        display: hide || hideCondition ? 'none' : 'inherit',
      }}
      border={index > 0}
      horizontal={4}>
      {Content}
    </PageContent>
  );
}

export function InputLayout(props) {
  const { fields = [], inputProps, values = {} } = props;

  return fields.map(field => {
    if (typeof field === 'function') {
      field = field(props);
    }
    if (
      (field.condition &&
        typeof field.condition === 'function' &&
        values &&
        field.condition(values)) ||
      typeof field.condition === 'undefined'
    ) {
      return field?.variant === 'group' ? (
        <Group>
          {field?.fields.map((field, index) =>
            (field.condition &&
              typeof field.condition === 'function' &&
              field.condition(values)) ||
            typeof field.condition === 'undefined' ? (
              <InputComponent
                key={field?.name ?? field?.id ?? field ?? index}
                {...props}
                field={field}
                {...inputProps}
              />
            ) : null,
          )}
        </Group>
      ) : (
        <InputComponent {...props} field={field} {...inputProps} />
      );
    }
    return null;
  });
}

function InputComponent(props) {
  const {
    formState,
    field,
    altStyle,
    inputComponents: Inputs = BaseInputs,
    ...restProps
  } = props;

  return (
    <Inputs
      {...formState}
      field={field}
      // key={field?.name ?? field?.id ?? field}
      variant={field?.variant ?? field?.id ?? field} //
      name={field?.name ?? field?.id ?? field}
      backgroundColor={altStyle ? '#FAFAFA' : '#FFFFFF'}
      {...restProps}
    />
  );
}
