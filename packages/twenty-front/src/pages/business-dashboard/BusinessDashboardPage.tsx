import { MobileHomeTaskRow } from '@/activities/tasks/components/MobileHomeTaskRow';
import { useBusinessDashboardTasks } from '@/activities/tasks/hooks/useBusinessDashboardTasks';
import { type Task } from '@/activities/types/Task';
import { PageCardHeader } from '@/modules/ui/layout/page/components/PageCardHeader';
import { PageCardLayout } from '@/modules/ui/layout/page/components/PageCardLayout';
import { PageTitle } from '@/modules/ui/utilities/page-title/components/PageTitle';
import { styled } from '@linaria/react';
import { type ReactNode } from 'react';
import {
  IconAlertTriangle,
  IconClockHour8,
  IconFolderOpen,
  IconInbox,
} from 'twenty-ui/icon';
import { Card } from 'twenty-ui/primitives/surfaces';
import { Text } from 'twenty-ui/primitives/typography';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledScrollContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  min-height: 0;
  overflow-y: auto;
  padding: ${themeCssVariables.spacing[4]};
  width: 100%;
`;

const StyledStatsGrid = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const StyledStatCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]};
`;

const StyledStatHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const StyledStatLabel = styled(Text)`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledStatValue = styled(Text)`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xxl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledStatHint = styled(Text)`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
`;

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledSectionHeader = styled.div`
  align-items: baseline;
  display: flex;
  justify-content: space-between;
  padding: 0 ${themeCssVariables.spacing[1]};
`;

const StyledSectionTitle = styled(Text)`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledSectionCount = styled(Text)`
  color: ${themeCssVariables.font.color.tertiary};
  font-weight: ${themeCssVariables.font.weight.regular};
  margin-left: ${themeCssVariables.spacing[2]};
`;

const StyledListCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  overflow: hidden;
`;

const StyledEmptyState = styled(Text)`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[4]} ${themeCssVariables.spacing[3]};
`;

const StyledIconWrap = styled.span`
  align-items: center;
  display: flex;
`;

// Keep the command tower short: overdue work first, then what is due today,
// five rows at most, the rest one click away on the tasks page.
const URGENT_TASKS_LIMIT = 5;

type BusinessDashboardStatCardProps = {
  accent: string;
  hint: string;
  icon: ReactNode;
  label: string;
  value: string;
};

const BusinessDashboardStatCard = ({
  accent,
  hint,
  icon,
  label,
  value,
}: BusinessDashboardStatCardProps) => (
  <StyledStatCard>
    <StyledStatHeader>
      <StyledIconWrap style={{ color: accent }}>{icon}</StyledIconWrap>
      <StyledStatLabel>{label}</StyledStatLabel>
    </StyledStatHeader>
    <StyledStatValue style={{ color: accent }}>{value}</StyledStatValue>
    <StyledStatHint>{hint}</StyledStatHint>
  </StyledStatCard>
);

export const BusinessDashboardPage = () => {
  const { overdue, today } = useBusinessDashboardTasks();

  const urgentTasks: Task[] = [...overdue.tasks, ...today.tasks].slice(
    0,
    URGENT_TASKS_LIMIT,
  );
  const urgentTaskCount = overdue.totalCount + today.totalCount;
  const isLoading = overdue.loading || today.loading;

  return (
    <>
      <PageTitle title="REALIFE 業務ダッシュボード" />
      <PageCardLayout
        header={<PageCardHeader title="REALIFE 業務ダッシュボード" />}
      >
        <StyledScrollContainer>
          <StyledStatsGrid>
            <BusinessDashboardStatCard
              accent={themeCssVariables.font.color.danger}
              hint="期限を过了した未完了タスク"
              icon={<IconAlertTriangle size={16} />}
              label="期限超過タスク"
              value={isLoading ? '…' : `${overdue.totalCount}`}
            />
            <BusinessDashboardStatCard
              accent={themeCssVariables.tag.text.blue}
              hint="今日中に対応するタスク"
              icon={<IconClockHour8 size={16} />}
              label="本日のタスク"
              value={isLoading ? '…' : `${today.totalCount}`}
            />
            <BusinessDashboardStatCard
              accent={themeCssVariables.tag.text.orange}
              hint="返信待ちの問い合わせ（データ連携は未設定）"
              icon={<IconInbox size={16} />}
              label="未対応問い合わせ"
              value="—"
            />
            <BusinessDashboardStatCard
              accent={themeCssVariables.tag.text.green}
              hint="進换待ちの案件（データ連携は未設定）"
              icon={<IconFolderOpen size={16} />}
              label="対応待ち案件"
              value="—"
            />
          </StyledStatsGrid>

          <StyledSection>
            <StyledSectionHeader>
              <StyledSectionTitle>
                今すぐ対応すること
                {!isLoading && urgentTaskCount > 0 && (
                  <StyledSectionCount>{urgentTaskCount}</StyledSectionCount>
                )}
              </StyledSectionTitle>
            </StyledSectionHeader>
            <StyledListCard>
              {!isLoading && urgentTasks.length === 0 && (
                <StyledEmptyState>
                  対応が必要なタスクはありません
                </StyledEmptyState>
              )}
              {urgentTasks.map((task) => (
                <MobileHomeTaskRow key={task.id} task={task} />
              ))}
            </StyledListCard>
          </StyledSection>
        </StyledScrollContainer>
      </PageCardLayout>
    </>
  );
};