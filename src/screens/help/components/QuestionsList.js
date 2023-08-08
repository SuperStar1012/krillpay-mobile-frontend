import React from 'react';
import { View } from 'components';
import Header from 'components/layout/HeaderNew';
import { arrayToObject } from 'utility/general';

export default function QuestionsList(props) {
  const { setSectionId, id, config } = props;
  const configObj = arrayToObject(config?.sections, 'id');
  const questionConfig = configObj?.[id] ?? {};
  const { questions, component: Component } = questionConfig;

  function handleBack() {
    setSectionId('');
  }
  return (
    <View f={1}>
      <Header handleBack={handleBack} title={id} bold />
      <View scrollView pb={3}>
        {Component ? (
          <Component {...props} />
        ) : (
          questions?.map(item => (
            <QuestionListItem {...props} key={item?.id} item={item} />
          ))
        )}
      </View>
    </View>
  );
}

function QuestionListItem(props) {
  const { item, context } = props;
  const { component: Component, condition, description, steps } = item;

  if (typeof Component === 'function') return <Component />;
  return null;
}
