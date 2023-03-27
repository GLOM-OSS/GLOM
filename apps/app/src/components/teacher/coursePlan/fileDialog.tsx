import {
  CancelOutlined,
  DescriptionOutlined,
  FolderZipOutlined,
  ImageOutlined,
  InsertDriveFileOutlined,
  InsertLinkOutlined,
  MovieOutlined,
  PictureAsPdfOutlined,
  TextSnippetOutlined,
  TopicOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { DialogTransition } from '@squoolr/dialogTransition';
import { CreateFile } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import {
  acceptedFileFormats,
  downloadFormats,
  readableFileFormats,
} from './fileDisplayDialog';

export function FileIcon({
  name,
  deleteResource,
  resource_type: rt,
  resource_ref: rr,
  readFile,
}: {
  name: string;
  deleteResource?: () => void;
  resource_type?: 'FILE' | 'LINK';
  resource_ref: string;
  readFile?: () => void;
}) {
  const test = name.split('.');
  const ext = `${test[test.length - 1]}`;
  let icon: JSX.Element;
  switch (ext) {
    case 'jpg': {
      icon = <ImageOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    case 'jpeg': {
      icon = <ImageOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    case 'png': {
      icon = <ImageOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    case 'gif': {
      icon = <ImageOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    case 'bmp': {
      icon = <ImageOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    case 'pdf': {
      icon = <PictureAsPdfOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    case 'xslx': {
      icon = <TextSnippetOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    case 'docx': {
      icon = <TextSnippetOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    case 'pptx': {
      icon = <TextSnippetOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    case 'ppt': {
      icon = <TextSnippetOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    case 'mp4': {
      icon = <MovieOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    case 'webm': {
      icon = <MovieOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    case 'csv': {
      icon = <DescriptionOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    case 'zip': {
      icon = <FolderZipOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    case 'rar': {
      icon = <FolderZipOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    case '7zip': {
      icon = <FolderZipOutlined sx={{ fontSize: 50 }} />;
      break;
    }
    default: {
      icon = <InsertDriveFileOutlined sx={{ fontSize: 50 }} />;
      break;
    }
  }
  const { formatMessage } = useIntl();
  return (
    <Box
      // component={'a'}
      component={rt === 'LINK' ? 'a' : 'div'}
      href={rr}
      rel="noreferrer"
      target="_blank"
      sx={{
        '&:hover': { '& .delete': { visibility: 'visible' } },
        display: 'grid',
        justifyItems: 'center',
        position: 'relative',
        textDecoration: 'none',
        color: 'inherit',
      }}
      onClick={
        deleteResource && rt === 'FILE' && readableFileFormats.includes(ext)
          ? readFile
            ? () => readFile()
            : () => alert('openFileFailed')
          : deleteResource && rt === 'FILE' && downloadFormats.includes(ext)
          ? readFile
            ? () => readFile()
            : () => alert('failedLoadingFileDownload')
          : () => null
      }
    >
      {deleteResource && (
        <Tooltip
          className="delete"
          sx={{ position: 'absolute', top: -5, right: 3, visibility: 'hidden' }}
          arrow
          title={formatMessage({ id: 'delete' })}
        >
          <IconButton size="small" onClick={deleteResource}>
            <CancelOutlined color="error" fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {rt === 'LINK' ? <InsertLinkOutlined sx={{ fontSize: 50 }} /> : icon}
      <Typography
        variant="caption"
        sx={{
          width: '100px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
        }}
      >
        {name}
      </Typography>
    </Box>
  );
}

export default function FileDialog({
  isDialogOpen,
  handleSubmit,
  closeDialog,
  chapter_id,
  openFileDialog,
}: {
  isDialogOpen: boolean;
  handleSubmit: (value: CreateFile) => void;
  closeDialog: () => void;
  chapter_id: string | null;
  openFileDialog: () => void;
}) {
  const { formatMessage } = useIntl();
  const { annual_credit_unit_subject_id } = useParams();

  const close = () => {
    closeDialog();
    setFiles(undefined);
  };

  const [files, setFiles] = useState<FileList>();

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={close}
    >
      <Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            columnGap: theme.spacing(1),
            alignItems: 'center',
            paddingRight: theme.spacing(3),
          }}
        >
          <DialogTitle>
            {formatMessage({
              id: chapter_id ? 'chapterFileResource' : 'courseFileResource',
            })}
          </DialogTitle>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            sx={{ width: 'fit-content', textTransform: 'none' }}
            onClick={openFileDialog}
          >
            {formatMessage({ id: 'linkResource' })}
          </Button>
        </Box>
        <DialogContent
          sx={{
            display: 'grid',
            rowGap: theme.spacing(2),
          }}
        >
          <Box
            sx={{
              border: `2.5px dotted ${theme.palette.primary.main}`,
              minHeight: '100px',
              borderRadius: '5px',
              display: 'grid',
              alignItems: 'center',
              justifyItems: 'center',
              padding: '2px 4px',
              paddingTop: theme.spacing(1),
            }}
          >
            {files && files.length > 0 ? (
              <Scrollbars autoHide style={{ height: '100%' }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    columnGap: theme.spacing(2),
                  }}
                >
                  {[...new Array(files.length)].map((_, index) => {
                    return (
                      <FileIcon name={files[index].name} resource_ref="" />
                    );
                  })}
                </Box>
              </Scrollbars>
            ) : (
              <Box>
                <input
                  id="add-image-button"
                  accept={acceptedFileFormats.map((_) => `.${_}`).join(',')}
                  multiple
                  type="file"
                  hidden
                  onChange={(event) => {
                    setFiles(event.target.files as FileList);
                  }}
                />
                <label htmlFor="add-image-button">
                  <Button
                    component="span"
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: 'none' }}
                    size="large"
                    endIcon={
                      <TopicOutlined
                        sx={{
                          color: 'white',
                        }}
                      />
                    }
                  >
                    {formatMessage({ id: 'selectFiles' })}
                  </Button>
                </label>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: 'none' }}
            color="error"
            variant="text"
            onClick={close}
          >
            {formatMessage({ id: 'cancel' })}
          </Button>
          <Button
            sx={{ textTransform: 'none' }}
            color="primary"
            variant="contained"
            disabled={!files}
            onClick={() => {
              if (files) {
                handleSubmit({
                  files,
                  details: {
                    annual_credit_unit_subject_id:
                      annual_credit_unit_subject_id as string,
                    chapter_id,
                  },
                });
                close();
              }
            }}
          >
            {formatMessage({ id: 'addFiles' })}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
