import { Box, Skeleton, Typography } from '@mui/material';
import { Resource } from '@squoolr/interfaces';
import { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { FileIcon } from './fileDialog';
import FileDisplayDialog, { readableFileFormats } from './fileDisplayDialog';
// import { FileIcon } from './fileIcon';

export default function ResourceDisplay({
  areResourcesLoading,
  resources,
}: {
  areResourcesLoading: boolean;
  resources: Resource[];
}) {
  const { formatMessage } = useIntl();

  const [displayFile, setDisplayFile] = useState<number>();

  const downloadFile = ({
    resource_name: rn,
    resource_extension: re,
    resource_ref: rr,
  }: Resource) => {
    const link = document.createElement('a');
    link.href = rr;
    link.setAttribute('download', `${rn}.${re}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  return (
    <>
      {displayFile !== undefined && (
        <FileDisplayDialog
          closeDialog={() => setDisplayFile(undefined)}
          isDialogOpen={displayFile !== undefined}
          resources={resources}
          activeResource={displayFile}
        />
      )}
      <Scrollbars autoHide>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns:
              !areResourcesLoading && resources.length === 0
                ? '1fr'
                : 'repeat(auto-fill, minmax(100px, 1fr))',
            columnGap: 3,
            rowGap: 3,
            alignContent:
              !areResourcesLoading && resources.length === 0
                ? 'center'
                : 'initial',
            justifyContent:
              !areResourcesLoading && resources.length === 0
                ? 'center'
                : 'initial',
          }}
        >
          {areResourcesLoading ? (
            [...new Array(10)].map((_, index) => (
              <Skeleton
                key={index}
                height="100px"
                width="100px"
                animation="wave"
              />
            ))
          ) : resources.length === 0 ? (
            <Typography textAlign="center">
              {formatMessage({ id: 'noRessoursesAvailable' })}
            </Typography>
          ) : (
            resources.map((resource, index) => {
              const {
                resource_name: rn,
                resource_extension: re,
                resource_type: rt,
                resource_ref: rr,
                // resource_id: r_id,
              } = resource;
              return (
                <FileIcon
                  key={index}
                  resource_ref={rr}
                  readFile={
                    rt === 'FILE'
                      ? readableFileFormats.includes(re as string)
                        ? () => setDisplayFile(index)
                        : () => downloadFile(resource)
                      : undefined
                  }
                  name={`${rn}${re ? '.' : ''}${re ?? ''}`}
                  resource_type={rt}
                />
              );
            })
          )}
        </Box>
      </Scrollbars>
    </>
  );
}
