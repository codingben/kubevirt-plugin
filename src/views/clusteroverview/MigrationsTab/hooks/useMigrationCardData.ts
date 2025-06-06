import {
  VirtualMachineInstanceMigrationModelGroupVersionKind,
  VirtualMachineInstanceModelGroupVersionKind,
} from '@kubevirt-ui/kubevirt-api/console';
import {
  V1VirtualMachineInstance,
  V1VirtualMachineInstanceMigration,
} from '@kubevirt-ui/kubevirt-api/kubevirt';
import { ALL_NAMESPACES_SESSION_KEY } from '@kubevirt-utils/hooks/constants';
import useMigrationPolicies from '@kubevirt-utils/hooks/useMigrationPolicies';
import {
  OnFilterChange,
  RowFilter,
  useK8sWatchResource,
  useListPageFilter,
} from '@openshift-console/dynamic-plugin-sdk';
import { useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';

import useHyperConvergedMigrations from '../components/MigrationsLimitionsPopover/hooks/useHyperConvergedMigrations';
import {
  getSourceNodeFilter,
  getStatusFilter,
  getTargetNodeFilter,
} from '../components/MigrationsTable/utils/filters';
import {
  getMigrationsTableData,
  MigrationTableDataLayout,
} from '../components/MigrationsTable/utils/utils';

export type UseMigrationCardDataAndFiltersValues = {
  filters: RowFilter<any>[];
  loaded: boolean;
  loadErrors: any;
  migrationsTableFilteredData: MigrationTableDataLayout[];
  migrationsTableUnfilteredData: MigrationTableDataLayout[];
  onFilterChange: OnFilterChange;
  vmims: V1VirtualMachineInstanceMigration[];
};

type UseMigrationCardDataAndFilters = (duration: string) => UseMigrationCardDataAndFiltersValues;

const useMigrationCardDataAndFilters: UseMigrationCardDataAndFilters = (duration: string) => {
  const migrationsDefaultConfigurations = useHyperConvergedMigrations();
  const [activeNamespace] = useActiveNamespace();
  const namespace = activeNamespace !== ALL_NAMESPACES_SESSION_KEY ? activeNamespace : null;

  const [vmims, vmimsLoaded, vmimsErrors] = useK8sWatchResource<
    V1VirtualMachineInstanceMigration[]
  >({
    groupVersionKind: VirtualMachineInstanceMigrationModelGroupVersionKind,
    isList: true,
    namespace,
  });

  const [vmis, vmisLoaded, vmisErrors] = useK8sWatchResource<V1VirtualMachineInstance[]>({
    groupVersionKind: VirtualMachineInstanceModelGroupVersionKind,
    isList: true,
    namespace,
  });

  const [mps] = useMigrationPolicies();

  const migrationsData = getMigrationsTableData(
    vmims,
    vmis,
    mps,
    migrationsDefaultConfigurations,
    duration,
  );

  const filters = [
    ...getStatusFilter(),
    ...getSourceNodeFilter(vmis),
    ...getTargetNodeFilter(vmis),
  ];
  const [unfilteredData, data, onFilterChange] = useListPageFilter(migrationsData, filters);

  return {
    filters,
    loaded: vmimsLoaded && vmisLoaded,
    loadErrors: vmimsErrors || vmisErrors,
    migrationsTableFilteredData: data,
    migrationsTableUnfilteredData: unfilteredData,
    onFilterChange,
    vmims,
  };
};

export default useMigrationCardDataAndFilters;
