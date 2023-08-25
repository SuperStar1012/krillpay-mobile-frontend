export function checkWyreService(services) {
  return Boolean(services?.wyre_service);
}

export function checkWyreModeUsers(services, config) {
  return (
    (config?.wyreConfig?.mode ?? config?.mode) === 'users' &&
    checkWyreService(services)
  );
}

export function checkWyreKYC(services, config, user) {
  return checkWyreModeUsers(services, config) && user?.status === 'verified';
}

export function checkWyreServiceArray(services = []) {
  return (
    services?.length &&
    services.findIndex(item => item.slug === 'wyre_service') !== -1
  );
}

export function getWyreAccountTitle(item) {
  return item?.name?.slice(0, -4);
}

export function getWyreAccountSubtitle(item) {
  let { name, institution_name, metadata } = item;
  if (!institution_name && metadata?.service_wyre?.institution_name)
    institution_name = metadata?.service_wyre?.institution_name;
  const account_number = name.slice(-4);

  return [institution_name, account_number].filter(item => item).join(', ');
}
