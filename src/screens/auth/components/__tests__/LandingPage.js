import React from 'react';
import { render, fireEvent } from 'test/test-utils';
// import {
//   render,
//   renderWithProviders,
//   fireEvent,
// } from '@testing-library/react-native';
import LandingPage from '../../pages/LandingPage';
import defaultAuthConfig from 'rehive/config/default/auth.json';
import { useCompany } from 'contexts/CompanyContext';
import { REGISTER, BACK, LOGIN } from '../../config/authMachine';

test('renders landing page', () => {
  const { company: client } = useCompany();
  const { queryByTestId } = render(
    <LandingPage authConfig={defaultAuthConfig} />,
  );

  // TODO: shows logo
  // const backButton = queryByTestId('back');
  // expect(backButton).toExist();

  const loginButton = queryByTestId('login');
  expect(loginButton).toExist();

  const registerButton = queryByTestId('register');
  expect(registerButton).toExist();

  const backButton = queryByTestId('back');
  if (client.company) {
    expect(backButton).toBeNull();
  } else {
    expect(backButton).toExist();
  }
});

// test('renders landing page - no register', () => {
//   const authConfig = { ...defaultAuthConfig, disableRegister: true };
//   const { queryByTestId } = render(<LandingPage authConfig={authConfig} />);

//   const registerButton = queryByTestId('register');
//   expect(registerButton).toBeNull();
// });

// test('renders landing page - custom logo', () => {
//   // const company = {slides: ,logo:,}
//   const { queryByTestId } = render(<LandingPage authConfig={defaultAuthConfig} />);

//   const registerButton = queryByTestId('register');
//   expect(registerButton).toBeNull();
// });

// test('renders landing page - slides', () => {
//   // const company = {slides: ,logo:,}
//   const { queryByTestId } = render(<LandingPage authConfig={defaultAuthConfig} />);

//   const registerButton = queryByTestId('register');
//   expect(registerButton).toBeNull();
// });

// test('transitions to register', () => {
//   const sendMock = jest.fn();
//   const { queryByTestId } = render(
//     <LandingPage authConfig={defaultAuthConfig} send={sendMock} />,
//   );

//   fireEvent.press(queryByTestId('login'));
//   expect(sendMock).toHaveBeenCalledWith(LOGIN);
// });

// test('transitions to login', () => {
//   const sendMock = jest.fn();
//   const { queryByTestId } = render(
//     <LandingPage authConfig={defaultAuthConfig} send={sendMock} />,
//   );

//   fireEvent.press(queryByTestId('register'));
//   expect(sendMock).toHaveBeenCalledWith(REGISTER);
// });

// test('transitions back to company', () => {
//   const sendMock = jest.fn();
//   const { queryByTestId } = render(
//     <LandingPage authConfig={defaultAuthConfig} send={sendMock} />,
//   );

//   fireEvent.press(queryByTestId('back'));
//   expect(sendMock).toHaveBeenCalledWith(BACK);
// });

/* 
- If back pressed goes to company
- If Login pressed goes to login
- If register pressed goes to register


TODO: 
1. set up providers



*/
