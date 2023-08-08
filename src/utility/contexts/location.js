import React, { useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';

const DeviceLocationContext = React.createContext({
  data: { deviceLocation: {} },
  state: {
    fetching: false,
  },
  methods: {
    fetch: () => {},
  },
});

function useDeviceLocation() {
  const context = useContext(DeviceLocationContext);
  if (context === undefined)
    throw new Error(
      'useDeviceLocation must be used within a DeviceLocationProvider',
    );

  return context;
}

function populateLocationProvider() {
  const [deviceLocation, setDeviceLocation] = useState();
  const [fetchingDeviceLocation, setFetchingDeviceLocation] = useState();

  useEffect(() => fetchDeviceLocation(), []);

  function fetchDeviceLocation() {
    setFetchingDeviceLocation(true);

    Location.requestPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') return setFetchingDeviceLocation(false);

      Location.getCurrentPositionAsync({}).then(location => {
        Location.reverseGeocodeAsync({
          latitude: location?.coords?.latitude,
          longitude: location?.coords?.longitude,
        }).then(reverseGeocode => {
          setDeviceLocation({ ...location, ...reverseGeocode?.[0] });
          setFetchingDeviceLocation(false);
        });
      });
    });
  }

  return {
    data: { deviceLocation },
    state: { fetching: fetchingDeviceLocation },
    methods: { fetch: fetchDeviceLocation },
  };
}

export { DeviceLocationContext, useDeviceLocation, populateLocationProvider };
