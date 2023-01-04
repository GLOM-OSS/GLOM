import DocViewer from '@cyntler/react-doc-viewer';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';
import { DialogTransition } from '@squoolr/dialogTransition';
import { Resource } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export const readableFileFormats = [
  'jpg',
  'jpeg',
  'png',
  'pdf',
  'xslx',
  'docx',
  'mp4',
  'webm',
  'csv',
  'ppt',
  'pptx',
];

export const videoFormats = ['mp4', 'webm'];

export default function FileDisplayDialog({
  isDialogOpen,
  closeDialog,
  activeResource,
  resources,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  activeResource: number;
  resources: Resource[];
}) {
  const { formatMessage } = useIntl();

  const docs = resources
    .filter(
      ({ resource_extension: re }) =>
        readableFileFormats.includes(re as string) &&
        !videoFormats.includes(re as string)
    )
    .map(({ resource_ref: rr, resource_name: rn, resource_extension: re }) => {
      return {
        uri: rr,
        fileName: rn,
        fileType: re ?? undefined,
      };
    });

  const active = resources[activeResource];
  const activeIndex = docs.map((i) => i.uri).indexOf(active.resource_ref);
  const close = () => {
    closeDialog();
  };

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={close}
      fullScreen
    >
      <DialogContent
        sx={{
          display: 'grid',
          rowGap: theme.spacing(2),
        }}
      >
        {activeIndex > -1 ? (
          <DocViewer
            documents={docs}
            initialActiveDocument={docs[activeIndex]}
          />
        ) : videoFormats.includes(active.resource_extension as string) ? (
          <video
            src={active.resource_ref}
            playsInline
            style={{
              objectFit: 'cover',
              position: 'absolute',
              height: 'inherit',
              width: 'inherit',
            }}
            poster="/video_poster.png" //TODO: MAKE AND ADD SQUOOLR VID IMAGE AS POSTER TO ALL VIDEOS
          />
        ) : (
          <Typography>
            {formatMessage({ id: 'resourceFormatNotSupportedHere' })}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: 'none' }}
          color="error"
          variant="text"
          onClick={close}
        >
          {formatMessage({ id: 'close' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
