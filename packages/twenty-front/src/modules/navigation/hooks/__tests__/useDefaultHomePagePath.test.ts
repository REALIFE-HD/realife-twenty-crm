import { currentUserState } from '@/auth/states/currentUserState';
import { useDefaultHomePagePath } from '@/navigation/hooks/useDefaultHomePagePath';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider as JotaiProvider } from 'jotai';
import { createElement, useEffect, type ReactNode } from 'react';
import { AppPath } from 'twenty-shared/types';
import { mockedUserData } from '~/testing/mock-data/users';

let mockIsMobile = false;

jest.mock('twenty-ui/utilities', () => ({
  ...jest.requireActual('twenty-ui/utilities'),
  useIsMobile: () => mockIsMobile,
}));

const Wrapper = ({ children }: { children: ReactNode }) =>
  createElement(JotaiProvider, { store: jotaiStore }, children);

const renderHooks = ({ withCurrentUser }: { withCurrentUser: boolean }) => {
  const { result } = renderHook(
    () => {
      const setCurrentUser = useSetAtomState(currentUserState);

      useEffect(() => {
        if (withCurrentUser) {
          setCurrentUser(mockedUserData);
        } else {
          setCurrentUser(null);
        }
      }, [setCurrentUser, withCurrentUser]);

      return useDefaultHomePagePath();
    },
    {
      wrapper: Wrapper,
    },
  );
  return { result };
};

describe('useDefaultHomePagePath', () => {
  afterEach(() => {
    mockIsMobile = false;
    jotaiStore.set(currentUserState.atom, null);
  });

  it('should return proper path when no currentUser', async () => {
    const { result } = renderHooks({ withCurrentUser: false });

    await waitFor(() => {
      expect(result.current.defaultHomePagePath).toEqual(AppPath.SignInUp);
    });
  });

  it('should return the business dashboard on desktop', async () => {
    const { result } = renderHooks({ withCurrentUser: true });

    await waitFor(() => {
      expect(result.current.defaultHomePagePath).toEqual(
        AppPath.BusinessDashboard,
      );
    });
  });

  it('should return the mobile home page on mobile', async () => {
    mockIsMobile = true;

    const { result } = renderHooks({ withCurrentUser: true });

    await waitFor(() => {
      expect(result.current.defaultHomePagePath).toEqual(AppPath.Home);
    });
  });

  it('should still return the sign in page on mobile when there is no currentUser', async () => {
    mockIsMobile = true;

    const { result } = renderHooks({ withCurrentUser: false });

    await waitFor(() => {
      expect(result.current.defaultHomePagePath).toEqual(AppPath.SignInUp);
    });
  });
});
