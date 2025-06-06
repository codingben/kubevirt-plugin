import React, { FC } from 'react';

import { PersistentVolumeClaimModel } from '@kubevirt-ui/kubevirt-api/console';
import { V1beta1PersistentVolumeClaim } from '@kubevirt-ui/kubevirt-api/kubevirt';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import {
  Alert,
  AlertVariant,
  Checkbox,
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';

import { getName, getNamespace } from '../utils/selectors';
import { OperatingSystemRecord } from '../utils/types';

import UploadPVCFormPVCNamespace from './UploadPVCFormPVCNamespace';

type UploadPVCFormGoldenImageProps = {
  goldenPvcs: V1beta1PersistentVolumeClaim[];
  handleCDROMChange: (checked: boolean) => void;
  handleOs: (newOs: string) => void;
  handlePvcSizeTemplate: (checked: boolean) => void;
  isLoading: boolean;
  mountAsCDROM: boolean;
  namespace: string;
  operatingSystems: OperatingSystemRecord[];
  os: OperatingSystemRecord;
  osImageExists: boolean;
  pvcSizeFromTemplate: boolean;
};

const UploadPVCFormGoldenImage: FC<UploadPVCFormGoldenImageProps> = ({
  goldenPvcs,
  handleCDROMChange,
  handleOs,
  handlePvcSizeTemplate,
  isLoading,
  mountAsCDROM,
  namespace,
  operatingSystems,
  os,
  osImageExists,
  pvcSizeFromTemplate,
}) => {
  const { t } = useKubevirtTranslation();
  return (
    <>
      <FormGroup fieldId="golden-os-select" isRequired label={t('Operating System')}>
        <FormSelect
          id="golden-os-select"
          isDisabled={isLoading}
          isRequired
          onChange={(_, val) => handleOs(val)}
          value={os?.id || ''}
        >
          <FormSelectOption
            isDisabled={!!os}
            key="defaultValue"
            label={t('--- Pick an Operating system ---')}
            value=""
          />
          {operatingSystems.map(({ baseImageName, baseImageNamespace, id, name }) => {
            const goldenPVC = goldenPvcs?.find(
              (pvc) => getName(pvc) === baseImageName && getNamespace(pvc) === baseImageNamespace,
            );

            const labelGoldenPVC =
              goldenPVC &&
              t('{{nameOrId}} - Default data image already exists', {
                nameOrId: name || id,
              });

            const labelMissingBaseImageName =
              !baseImageName &&
              t('{{nameOrId}} - Template missing data image definition', {
                nameOrId: name || id,
              });

            const label = labelGoldenPVC || labelMissingBaseImageName || name || id;

            return <FormSelectOption key={id} label={label} value={id} />;
          })}
        </FormSelect>
        {os && (
          <>
            <Checkbox
              className="kv--create-upload__golden-switch"
              data-checked-state={pvcSizeFromTemplate}
              id="golden-os-checkbox-pvc-size-template"
              isChecked={pvcSizeFromTemplate}
              label={t('Use template size PVC')}
              onChange={(_, checked: boolean) => handlePvcSizeTemplate(checked)}
            />
            <Checkbox
              className="kv--create-upload__golden-switch"
              data-checked-state={!!mountAsCDROM}
              id="golden-os-checkbox-cdrom-boot-source-template"
              isChecked={!!mountAsCDROM}
              label={t('This is a CD-ROM boot source')}
              onChange={(_, checked: boolean) => handleCDROMChange(checked)}
            />
          </>
        )}
      </FormGroup>
      {osImageExists && (
        <FormGroup>
          <Alert
            isInline
            title={t('Operating system source already defined')}
            variant={AlertVariant.danger}
          >
            {t(
              'In order to add a new source for {{osName}} you will need to delete the following PVC:',
              { osName: os?.name },
            )}{' '}
            <ResourceLink
              hideIcon
              inline
              kind={PersistentVolumeClaimModel.kind}
              name={os?.baseImageName}
              namespace={os?.baseImageNamespace}
            />
          </Alert>
        </FormGroup>
      )}
      <UploadPVCFormPVCNamespace namespace={namespace} />
    </>
  );
};

export default UploadPVCFormGoldenImage;
