import {
  DescriptionOutlined,
  FolderZipOutlined,
  ImageOutlined,
  InsertDriveFileOutlined,
  InsertLinkOutlined,
  MovieOutlined,
  PictureAsPdfOutlined,
  TextSnippetOutlined,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

export function FileIcon({
  name,
  resource_type: rt,
  resource_ref: rr,
  readFile,
}: {
  name: string;
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
  return (
    <Box
      component={'a'}
      // component={rt === 'LINK' ? 'a' : 'div'}
      href={rr}
      rel="noreferrer"
      target="_blank"
      sx={{
        '&:hover': { '& .delete': { visibility: 'visible' } },
        display: 'grid',
        justifyItems: 'center',
        textDecoration: 'none',
        color: 'inherit',
        height: 'fit-content',
      }}
      // onClick={
      //   deleteResource && rt === 'FILE' && readableFileFormats.includes(ext)
      //     ? readFile
      //       ? () => readFile()
      //       : () => alert('openFileFailed')
      //     : deleteResource && rt === 'FILE' && downloadFormats.includes(ext)
      //     ? readFile
      //       ? () => readFile()
      //       : () => alert('failedLoadingFileDownload')
      //     : () => null
      // }
    >
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
