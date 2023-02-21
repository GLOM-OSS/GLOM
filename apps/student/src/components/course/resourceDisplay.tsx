import { Box, Skeleton, Typography } from '@mui/material';
import { Resource } from '@squoolr/interfaces';
import { FileIcon } from 'apps/student/src/components/course/fileIcon';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';

export default function ResourceDisplay({
  areResourcesLoading,
  resources,
}: {
  areResourcesLoading: boolean;
  resources: Resource[];
}) {
  const { formatMessage } = useIntl();

  const downloadFile = (resource_id: string) => {
    //TODO: CALL API HERE TO DOWNLOAD FILE
    alert(`downloading ${resource_id}`);
  };

  return (
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
              resource_id: r_id,
            } = resource;
            return (
              <FileIcon
                key={index}
                resource_ref={rr}
                readFile={
                  // rt === 'FILE' &&
                  // readableFileFormats.includes(re as string)
                  //   ? () => setDisplayFile(index)
                  //   :
                  rt === 'FILE'
                    ? //  && downloadFormats.includes(re as string)
                      () => downloadFile(r_id)
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
  );
}
