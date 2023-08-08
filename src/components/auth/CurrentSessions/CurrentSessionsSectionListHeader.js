import React, { useState, useEffect } from 'react';
import { ListItem } from 'components';

const CurrentSessionsSectionListHeader = props => {
  const { item = {}, onPress, onBack, appTitleDirection, ...restProps } = props;
  const { company = {} } = item;
  const { name, icon, logo, id, description } = company;
  const [containerStyle, setContainerStyle] = useState({ paddingLeft: 6 });
  const [styleImage, setStyleImage] = useState({});
  const [styleSelected, setStyleSelected] = useState({});

  useEffect(() => {
    if (appTitleDirection) {
      setContainerStyle({
        flexDirection: appTitleDirection,
        alignItems: 'center',
        marginVertical: 10,
      });
      setStyleImage({ marginVertical: 0 });
      setStyleImage({ marginVertical: 0 });
      setStyleSelected({
        top: 0,
        height: 60,
      });
    }
  }, []);

  return (
    <ListItem
      key={id}
      onPress={() => (onBack ? onBack() : onPress(item))}
      title={name}
      subtitle={description}
      image={icon ? icon : logo}
      containerStyle={containerStyle}
      styleImage={styleImage}
      styleSelected={styleSelected}
      width={40}
      height={40}
      {...restProps}
    />
  );
};

export default React.memo(CurrentSessionsSectionListHeader);
