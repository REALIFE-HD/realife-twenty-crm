import { currentUserState } from '@/auth/states/currentUserState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useIsMobile } from 'twenty-ui/utilities';
import { useMemo } from 'react';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

export const useDefaultHomePagePath = () => {
  const currentUser = useAtomStateValue(currentUserState);
  const isMobile = useIsMobile();

  const defaultHomePagePath = useMemo(() => {
    if (!isDefined(currentUser)) {
      return AppPath.SignInUp;
    }

    // The phone keeps its dedicated home page; the desktop lands on the
    // business dashboard instead of the alphabetically-first object.
    if (isMobile) {
      return AppPath.Home;
    }

    return AppPath.BusinessDashboard;
  }, [currentUser, isMobile]);

  return { defaultHomePagePath };
};
