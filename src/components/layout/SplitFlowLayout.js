import React from 'react';
import { View } from './View';
import ButtonList from 'components/inputs/ButtonList';

export default function SplitFlowLayout(props) {
  let {
    buttons,
    pageHeader: PageHeader,
    contentHeader: ContentHeader,
    contentDetail: ContentDetail,
    color = 'primary',
    backgroundColor = 'background',
  } = props;
  const hasDetail = Boolean(ContentDetail);

  return (
    <View f={1} bC={backgroundColor}>
      <View f={1} scrollView>
        {PageHeader}
        <View
          mh={1.5}
          mt={1}
          p={1.5}
          bC={color}
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            ...(!hasDetail
              ? { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }
              : {}),
          }}>
          {ContentHeader}
        </View>
        {hasDetail && (
          <View
            mh={1.5}
            p={1.5}
            bC="white"
            style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
            {ContentDetail}
          </View>
        )}
      </View>
      <ButtonList p={1.5} items={buttons} />
    </View>
  );
}
