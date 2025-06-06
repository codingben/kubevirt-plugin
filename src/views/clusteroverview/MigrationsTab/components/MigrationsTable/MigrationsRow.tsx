import React, { FC } from 'react';

import {
  modelToGroupVersionKind,
  NamespaceModel,
  NodeModel,
  VirtualMachineInstanceMigrationModelGroupVersionKind,
  VirtualMachineModelGroupVersionKind,
} from '@kubevirt-ui/kubevirt-api/console';
import Timestamp from '@kubevirt-utils/components/Timestamp/Timestamp';
import { getName, getNamespace } from '@kubevirt-utils/resources/shared';
import { NO_DATA_DASH } from '@kubevirt-utils/resources/vm/utils/constants';
import { vmimStatuses } from '@kubevirt-utils/resources/vmim/statuses';
import {
  GenericStatus,
  ResourceLink,
  RowProps,
  TableData,
} from '@openshift-console/dynamic-plugin-sdk';
import { Tooltip } from '@patternfly/react-core';

import MigrationPolicyTooltip from './components/MigrationPolicyTooltip/MigrationPolicyTooltip';
import { iconMapper } from './utils/statuses';
import { MigrationTableDataLayout } from './utils/utils';
import MigrationActionsDropdown from './MigrationActionsDropdown';

const MigrationsRow: FC<RowProps<MigrationTableDataLayout>> = ({ activeColumnIDs, obj }) => {
  const StatusIcon = iconMapper?.[obj?.vmim?.status?.phase];

  return (
    <>
      <TableData activeColumnIDs={activeColumnIDs} id="vm-name">
        <ResourceLink
          groupVersionKind={VirtualMachineModelGroupVersionKind}
          name={getName(obj.vmiObj)}
          namespace={getNamespace(obj.vmiObj)}
        />
      </TableData>
      <TableData
        activeColumnIDs={activeColumnIDs}
        className="pf-m-width-10 vm-column"
        id="namespace"
      >
        <ResourceLink
          groupVersionKind={modelToGroupVersionKind(NamespaceModel)}
          name={getNamespace(obj.vmiObj)}
        />
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="status">
        <Tooltip
          content={`${obj?.vmim?.status?.phase} ${
            obj?.vmiObj?.status?.migrationState?.endTimestamp || ''
          }`}
          hidden={
            obj?.vmim?.status?.phase !== vmimStatuses.Failed &&
            obj?.vmim?.status?.phase !== vmimStatuses.Succeeded
          }
        >
          <GenericStatus Icon={StatusIcon} title={obj?.vmim?.status?.phase} />
        </Tooltip>
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="source">
        {obj?.vmiObj?.status?.migrationState?.sourceNode ? (
          <ResourceLink
            groupVersionKind={modelToGroupVersionKind(NodeModel)}
            name={obj?.vmiObj?.status?.migrationState?.sourceNode}
          />
        ) : (
          NO_DATA_DASH
        )}
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="target">
        {obj?.vmiObj?.status?.migrationState?.targetNode ? (
          <ResourceLink
            groupVersionKind={modelToGroupVersionKind(NodeModel)}
            name={obj?.vmiObj?.status?.migrationState?.targetNode}
          />
        ) : (
          NO_DATA_DASH
        )}
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="migration-policy">
        <MigrationPolicyTooltip obj={obj} />
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="vmim-name">
        <ResourceLink
          groupVersionKind={VirtualMachineInstanceMigrationModelGroupVersionKind}
          name={obj?.vmim?.metadata?.name}
          namespace={obj?.vmim?.metadata?.namespace}
        />
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} id="created">
        <Timestamp timestamp={obj?.vmim?.metadata?.creationTimestamp} />
      </TableData>
      <TableData activeColumnIDs={activeColumnIDs} className="pf-v6-c-table__action" id="">
        <MigrationActionsDropdown isKebabToggle vmim={obj?.vmim} />
      </TableData>
    </>
  );
};

export default MigrationsRow;
