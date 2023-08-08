import React, { Component, useContext } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { ThemeContext } from 'contexts/ThemeContext';

const context = ComposedComponent => {
  class ContextComponent extends Component {
    render() {
      return (
        <ThemeContext.Consumer>
          {context => (
            <ComposedComponent
              {...this.props}
              colors={context.colors}
              design={context.design}
              profile={context.profile}
              rem={context.rem}
              showToast={context.showToast}
            />
          )}
        </ThemeContext.Consumer>
      );
    }
  }

  hoistNonReactStatics(ContextComponent, ComposedComponent);

  return ContextComponent;
};

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider');
  }
  return context;
}

export default context;

/*
TODO:
1. Create useContext / useTheme
2. Split up contexts for colors / design / profile etc?


*/
export { useTheme };
