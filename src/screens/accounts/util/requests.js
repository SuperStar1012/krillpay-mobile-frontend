import { get } from 'lodash';
import { cleanMobile } from 'utility/general';

export function contactMatch({ email, mobile, contacts }) {
  if (!contacts) return;
  return contacts.phone.find?.(
    x =>
      (email && x.contact === email) ||
      (mobile && cleanMobile(x.contact) === cleanMobile(mobile)),
  );
}

export const userLabel = (
  request,
  userObject = 'user',
  contactOnly = false,
) => {
  // const user = outgoing ? 'payer_user' : 'user';
  if (!request) return;
  if (!request[userObject]) return request.payer_email || request.payer_mobile;

  return !contactOnly &&
    get(request, [userObject, 'first_name']) &&
    get(request, [userObject, 'last_name'])
    ? `${request[userObject].first_name} ${request[userObject].last_name}`
    : request[userObject].email || request[userObject].mobile;
};
