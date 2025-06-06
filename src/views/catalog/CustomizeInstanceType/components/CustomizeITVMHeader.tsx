import React, { FC } from 'react';

import { useInstanceTypeVMStore } from '@catalog/CreateFromInstanceTypes/state/useInstanceTypeVMStore';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { getName } from '@kubevirt-utils/resources/shared';
import { Content, ContentVariants, PageSection, Title } from '@patternfly/react-core';

const CutomizeITVMHeader: FC = () => {
  const { t } = useKubevirtTranslation();
  const {
    instanceTypeVMState: { selectedBootableVolume },
  } = useInstanceTypeVMStore();

  return (
    <PageSection>
      <Title headingLevel="h1">{t('Customize and create VirtualMachine')}</Title>
      <Content component={ContentVariants.small} data-test="wizard title help">
        {t('Bootable volume: {{bootableVolumeName}}', {
          bootableVolumeName: getName(selectedBootableVolume),
        })}
      </Content>
    </PageSection>
  );
};

export default CutomizeITVMHeader;
