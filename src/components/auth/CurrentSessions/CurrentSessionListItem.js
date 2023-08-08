import React, { useState, useEffect } from 'react';

import { ListItem } from 'components';

const CurrentSessionsListItem = props => {
  const {
    item = {},
    navigateAuth,
    companyID,
    selected,
    appTitleDirection,
    containerStyles = {},
    emailTitle,
    ...restProps
  } = props;
  const { user } = item;
  const [containerStyle, setContainerStyle] = useState({
    paddingLeft: 6,
    ...containerStyles,
  });
  const [styleImage, setStyleImage] = useState({});
  const [styleSelected, setStyleSelected] = useState({});

  useEffect(() => {
    if (appTitleDirection) {
      setContainerStyle({
        flexDirection: appTitleDirection,
        alignItems: 'center',
        marginVertical: 10,
        ...containerStyles,
      });
      setStyleImage({ marginVertical: 0 });
      setStyleSelected({
        top: 0,
        height: 60,
      });
    }
  }, []);

  if (user) {
    const { first_name, last_name, email, mobile, profile } = user;

    const title = first_name ? first_name + ' ' + last_name : '';
    const subtitle = email;

    return (
      <ListItem
        key={item.id}
        onPress={() => navigateAuth({ ...item, companyID, switching: true })}
        title={emailTitle ? email : title}
        subtitle={subtitle}
        image={profile}
        containerStyle={containerStyle}
        styleImage={styleImage}
        styleSelected={styleSelected}
        width={40}
        selected={selected}
        height={40}
        {...restProps}
      />
    );
  }
  return null;
};

export default CurrentSessionsListItem;
