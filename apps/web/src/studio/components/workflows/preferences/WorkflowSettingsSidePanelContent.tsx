import { FC } from 'react';

import { Loader } from '@mantine/core';
import { Tabs, Text } from '@novu/novui';
import { IconDynamicFeed, IconManageAccounts } from '@novu/novui/icons';
import { Grid, Stack } from '@novu/novui/jsx';
import { token } from '@novu/novui/tokens';
import { Controller, useFormContext } from 'react-hook-form';
import { isBridgeWorkflow, WorkflowTypeEnum } from '@novu/shared';
import { useStudioState } from '../../../StudioStateProvider';
import { WorkflowDetailFormContext } from './WorkflowDetailFormContextProvider';
import { WorkflowGeneralSettingsFieldName, WorkflowGeneralSettingsForm } from './WorkflowGeneralSettingsForm';
import { WorkflowSubscriptionPreferences } from './WorkflowSubscriptionPreferences';

enum WorkflowSettingsPanelTab {
  GENERAL = 'general',
  PREFERENCES = 'preferences',
}

type WorkflowSettingsSidePanelContentProps = {
  isLoading?: boolean;
  workflowType?: WorkflowTypeEnum;
};

export const WorkflowSettingsSidePanelContent: FC<WorkflowSettingsSidePanelContentProps> = ({
  isLoading,
  workflowType,
}) => {
  const { isLocalStudio } = useStudioState() || {};
  const { control } = useFormContext<WorkflowDetailFormContext>();

  const checkShouldHideField = (fieldName: WorkflowGeneralSettingsFieldName) => {
    switch (fieldName) {
      case 'general.name':
        return isLocalStudio;
      case 'general.workflowId':
        return false;
      default:
        return false;
    }
  };

  const checkShouldDisableField = (fieldName: WorkflowGeneralSettingsFieldName) => {
    switch (fieldName) {
      case 'general.name':
      case 'general.workflowId':
        return isLocalStudio || isBridgeWorkflow(workflowType);
      default:
        return false;
    }
  };

  return (
    <Tabs
      defaultValue={WorkflowSettingsPanelTab.GENERAL}
      colorPalette={isLocalStudio ? 'mode.local' : 'mode.cloud'}
      tabConfigs={[
        {
          value: WorkflowSettingsPanelTab.GENERAL,
          label: 'General',
          icon: <IconDynamicFeed />,
          content: isLoading ? (
            <CenteredLoader />
          ) : (
            <WorkflowGeneralSettingsForm
              checkShouldHideField={checkShouldHideField}
              checkShouldDisableField={checkShouldDisableField}
            />
          ),
        },
        {
          value: WorkflowSettingsPanelTab.PREFERENCES,
          label: 'Preferences',
          icon: <IconManageAccounts />,
          content: isLoading ? (
            <CenteredLoader />
          ) : (
            <Stack gap="150">
              <Text color="typography.text.secondary">
                Set default notification channels for subscribers, and determine which channels they can modify
                themselves.
              </Text>
              <Controller
                name="preferences"
                control={control}
                render={({ field }) => {
                  return (
                    <WorkflowSubscriptionPreferences
                      preferences={field.value}
                      updateWorkflowPreferences={field.onChange}
                      arePreferencesDisabled={isLocalStudio}
                    />
                  );
                }}
              ></Controller>
            </Stack>
          ),
        },
      ]}
    />
  );
};

function CenteredLoader() {
  return (
    <Grid placeContent={'center'} h="full">
      <Loader color={token('colors.colorPalette.middle')} size={32} />
    </Grid>
  );
}
