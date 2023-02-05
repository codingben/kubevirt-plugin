import React from 'react';

import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { Label, Popover } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

const DeveloperPreviewLabel: React.FC = () => {
  const { t } = useKubevirtTranslation();

  return (
    <Popover
      bodyContent={t(
        'Developer preview features are not intended to be used in production environments. The clusters deployed with the developer preview features are considered to be development clusters and are not supported through the Red Hat Customer Portal case management system.',
      )}
    >
      <Label isCompact variant="outline" color="orange" icon={<InfoCircleIcon />}>
        {t('Developer preview')}
      </Label>
    </Popover>
  );
};

export default DeveloperPreviewLabel;
