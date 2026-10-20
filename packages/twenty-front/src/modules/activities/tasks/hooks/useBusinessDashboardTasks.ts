import { BUSINESS_DASHBOARD_TASKS_LIMIT } from '@/activities/tasks/constants/BusinessDashboardTasksLimit';
import { type Task } from '@/activities/types/Task';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useMemo } from 'react';
import {
  CoreObjectNameSingular,
  type RecordGqlOperationFilter,
} from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

const getTodayBoundaries = () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return {
    startOfTodayIsoString: startOfToday.toISOString(),
    endOfTodayIsoString: endOfToday.toISOString(),
  };
};

const TASK_GQL_FIELDS = {
  id: true,
  title: true,
  status: true,
  dueAt: true,
  createdAt: true,
};

// Same scope as the mobile home: open tasks assigned to the current member or
// to nobody, since workflow-created tasks usually carry no assignee.
const useOpenTasks = (dueAtFilter: RecordGqlOperationFilter) => {
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);

  const { records, totalCount, loading } = useFindManyRecords<Task>({
    objectNameSingular: CoreObjectNameSingular.Task,
    skip: !isDefined(currentWorkspaceMember),
    filter: {
      and: [
        {
          or: [
            { assigneeId: { eq: currentWorkspaceMember?.id } },
            { assigneeId: { is: 'NULL' } },
          ],
        },
        dueAtFilter,
        {
          or: [{ status: { neq: 'DONE' } }, { status: { is: 'NULL' } }],
        },
      ],
    },
    orderBy: [{ dueAt: 'AscNullsLast' }, { createdAt: 'DescNullsLast' }],
    limit: BUSINESS_DASHBOARD_TASKS_LIMIT,
    recordGqlFields: TASK_GQL_FIELDS,
  });

  return { tasks: records, totalCount: totalCount ?? records.length, loading };
};

export const useBusinessDashboardTasks = () => {
  const { startOfTodayIsoString, endOfTodayIsoString } = useMemo(
    getTodayBoundaries,
    [],
  );

  const overdue = useOpenTasks({ dueAt: { lt: startOfTodayIsoString } });
  const today = useOpenTasks({
    and: [
      { dueAt: { gte: startOfTodayIsoString } },
      { dueAt: { lte: endOfTodayIsoString } },
    ],
  });

  return { overdue, today };
};
