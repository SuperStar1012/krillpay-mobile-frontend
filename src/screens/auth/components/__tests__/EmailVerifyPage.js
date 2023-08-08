import React from 'react';
// import { render, fireEvent } from '@testing-library/react-native';

import { render, fireEvent } from 'test/test-utils';

import EmailVerifyPage from '../EmailVerifyPage';
import defaultAuthConfig from 'rehive/config/default/auth.json';
import { SUCCESS, BACK } from '../../config/authMachine';

const EMAIL = 'dummy@email.com';
const USER_VERIFIED = { email: EMAIL, verification: { email: true } };
const USER_NOT_VERIFIED = { email: EMAIL, verification: { email: false } };

test('skips email verify if no config', () => {
  const authConfig = { ...defaultAuthConfig, email: '' };
  const initialUser = USER_NOT_VERIFIED;
  const sendMock = jest.fn();
  const props = { authConfig, initialUser, sendMock };
  const { queryByTestId } = render(<EmailVerifyPage {...props} />);

  expect(sendMock).toHaveBeenCalledWith(SUCCESS);
});

test('shows skip if config optional and allows skip', () => {
  const authConfig = { ...defaultAuthConfig, email: 'optional' };
  const initialUser = USER_NOT_VERIFIED;
  const sendMock = jest.fn();
  const props = { authConfig, initialUser, sendMock };
  const { queryByTestId } = render(<EmailVerifyPage {...props} />);

  const skipButton = queryByTestId('skip');
  expect(skipButton).toExist();

  fireEvent.press(skipButton);
  expect(sendMock).toHaveBeenCalledWith(SUCCESS);
});

test('shows no skip if config required', () => {
  const authConfig = { ...defaultAuthConfig, email: 'required' };
  const initialUser = USER_NOT_VERIFIED;
  const sendMock = jest.fn();
  const props = { authConfig, initialUser, sendMock };
  const { queryByTestId } = render(<EmailVerifyPage {...props} />);

  const skipButton = queryByTestId('skip');
  expect(skipButton).toBeNull();
});

test('shows back / log out and allows back', () => {
  const authConfig = { ...defaultAuthConfig, email: 'required' };
  const initialUser = USER_NOT_VERIFIED;
  const sendMock = jest.fn();
  const props = { authConfig, initialUser, sendMock };
  const { queryByTestId } = render(<EmailVerifyPage {...props} />);

  const backButton = queryByTestId('back');
  expect(backButton).toExist();

  fireEvent.press(backButton);
  expect(sendMock).toHaveBeenCalledWith(BACK);
});

test('skips if user verified', () => {
  const authConfig = { ...defaultAuthConfig, email: 'required' };
  const initialUser = USER_VERIFIED;
  const sendMock = jest.fn();
  const props = { authConfig, initialUser, sendMock };
  const { queryByTestId } = render(<EmailVerifyPage {...props} />);

  expect(sendMock).toHaveBeenCalledWith(SUCCESS);
});

// test('fetches user if no initial user', () => {
//   const authConfig = { ...defaultAuthConfig, email: 'required' };
//   const initialUser = { email: EMAIL, verification: { email: true } };
//   const sendMock = jest.fn();
//   const props = { authConfig, initialUser, sendMock };
//   const { queryByTestId } = render(<EmailVerifyPage {...props} />);

//   expect(sendMock).toHaveBeenCalledWith(SUCCESS);
// });

// fetches user if next pressed and doesn't proceed if still not verified

// fetches user if next pressed and proceeds if verified

// resend email verification to email if resend pressed

/*
TODO: mock api calls: resendVerification, getProfile
*/
