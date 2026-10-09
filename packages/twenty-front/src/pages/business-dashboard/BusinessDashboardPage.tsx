import { Box, Card, CardHeader, CardTitle, CardSection, Group, Text, Stack, SimpleGrid, Tooltip, Button, Anchor, Badge } from '@mantine/core';
import { useTasks } from '@/modules/activities/tasks/hooks/useTasks';
import { format, isToday, isPast, startOfToday, endOfToday } from 'date-fns';
import { type Task } from '@/activities/types/Task';
import { CalendarClockIcon } from '@tabler/icons-react';
import { InboxIcon } from '@tabler/icons-react';
import { FolderOpenIcon } from '@tabler/icons-react';
import { Speedometer2Icon } from '@tabler/icons-react';
import { useMemo } from 'react';

export const BusinessDashboardPage = () => {
  const { tasks: allTasks, tasksLoading } = useTasks({ targetableObjects: [] });

  const tasks = useMemo(() => {
    return allTasks.filter(task => task.__typename === 'Task') as Task[];
  }, [allTasks]);

  const overdueTasks = useMemo(() => {
    return tasks.filter(task => {
      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      return dueDate && isPast(dueDate) && !task.isCompleted;
    });
  }, [tasks]);

  const todayTasks = useMemo(() => {
    return tasks.filter(task => {
      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      return dueDate && isToday(dueDate) && !task.isCompleted;
    });
  }, [tasks]);

  // Placeholder for inquiries and cases - replace with actual data from relevant modules
  const unrespondedInquiries = []; // TODO: fetch from emails/activities module
  const pendingCases = []; // TODO: fetch from cases/objects module

  if (tasksLoading) {
    return <Box p={4}>Loading...</Box>;
  }

  return (
    <Box p={4}>
      <Stack spacing={4}>
        {/* Title */}
        <Group position="center">
          <Text size="xl" fw={700}>REALIFE 業務ダッシュボード</Text>
        </Group>

        {/* Four Cards Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
          {/* Overdue Tasks Card */}
          <Card>
            <CardHeader withBorder>
              <Group position="left">
                <CalendarClockIcon size={24} color="red" />
                <CardTitle size={4}>期限超過タスク</CardTitle>
              </Group>
            </CardHeader>
            <CardSection p={4}>
              <Text size={2xl} fw={600} color="red">
                {overdueTasks.length}
              </Text>
              <Text size={xs} color="dimmed">今日までに完了すべきタスク</Text>
            </CardSection>
          </Card>

          {/* Today's Tasks Card */}
          <Card>
            <CardHeader withBorder>
              <Group position="left">
                <CalendarClockIcon size={24} color="blue" />
                <CardTitle size={4}>本日のタスク</CardTitle>
              </Group>
            </CardHeader>
            <CardSection p={4}>
              <Text size={2xl} fw={600} color="blue">
                {todayTasks.length}
              </Text>
              <Text size={xs} color="dimmed">今日中に対応するタスク</Text>
            </CardSection>
          </Card>

          {/* Unresponded Inquiries Card */}
          <Card>
            <CardHeader withBorder>
              <Group position="left">
                <InboxIcon size={24} color="orange" />
                <CardTitle size={4}>未対応問い合わせ</CardTitle>
              </Group>
            </CardHeader>
            <CardSection p={4}>
              <Text size={2xl} fw={600} color="orange">
                {unrespondedInquiries.length}
              </Text>
              <Text size={xs} color="dimmed">返信が必要な問い合わせ</Text>
            </CardSection>
          </Card>

          {/* Pending Cases Card */}
          <Card>
            <CardHeader withBorder>
              <Group position="left">
                <FolderOpenIcon size={24} color="green" />
                <CardTitle size={4}>対応待ち案件</CardTitle>
              </Group>
            </CardHeader>
            <CardSection p={4}>
              <Text size={2xl} fw={600} color="green">
                {pendingCases.length}
              </Text>
              <Text size={xs} color="dimmed">進捗待ちの案件・プロジェクト</Text>
            </CardSection>
          </Card>
        </SimpleGrid>

        {/* Command Tower: 今すぐ対応すること */}
        <Stack spacing={3} mt={6}>
          <Text size="lg" fw={600}>今すぐ対応すること</Text>
          <Box>
            {/* Urgent tasks: overdue + today */}
            {[
              ...overdueTasks.map(task => ({ task, type: 'overdue' as const })),
              ...todayTasks.map(task => ({ task, type: 'today' as const }))
            ]
              .sort((a, b) => {
                // Sort by urgency: overdue first, then today, then by due date
                const dateA = a.task.dueDate ? new Date(a.task.dueDate) : new Date(0);
                const dateB = b.task.dueDate ? new Date(b.task.dueDate) : new Date(0);
                if (a.type === 'overdue' && b.type !== 'overdue') return -1;
                if (a.type !== 'overdue' && b.type === 'overdue') return 1;
                if (a.type === 'today' && b.type !== 'today') return -1;
                if (a.type !== 'today' && b.type === 'today') return 1;
                return dateA.getTime() - dateB.getTime();
              })
              .slice(0, 5) // Show top 5 urgent tasks
              .map(({ task, type }) => (
                <Box key={task.id} p={3} withBorder radius="md">
                  <Group position="left" align="center">
                    {type === 'overdue' && (
                      <Badge variant="light" color="red">
                        期限超過
                      </Badge>
                    )}
                    {type === 'today' && (
                      <Badge variant="light" color="blue">
                        本日
                      </Badge>
                    )}
                    <Box ml={4} grow>
                      <Text size="sm" fw={500}>{task.title ?? '(無題)'}</Text>
                      <Text size="xs" color="dimmed">
                        {task.dueDate ? format(new Date(task.dueDate), 'MM/dd HH:mm') : '日付未設定'}
                      </Text>
                    </Box>
                    <Button
                      variant="outline"
                      size="xs"
                      color={type === 'overdue' ? 'red' : 'blue'}
                      onClick={() => {
                        // TODO: navigate to task detail or open completion modal
                        alert(`タスク "${task.title}" の対応を開始します`);
                      }}
                    >
                      対応開始
                    </Button>
                  </Group>
                </Box>
              ))}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};