import { useEffect, useState } from 'react';
import { useGetProfile } from 'hooks/rehive';

export function useMfaSuccess({ tempAuth, setTempAuth, onSuccess }) {
  const [mfaStepCompleted, setMfaStepCompleted] = useState(false);

  const { data: userProfile } = useGetProfile(
    tempAuth?.token,
    mfaStepCompleted,
  );

  useEffect(() => {
    if (userProfile && typeof setTempAuth === 'function') {
      setTempAuth({ ...tempAuth, user: userProfile });
      onSuccess();
    }
  }, [userProfile]);

  return { setMfaStepCompleted };
}
