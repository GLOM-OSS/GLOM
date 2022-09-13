import { CircularProgress } from '@mui/material';

export default function Progress({
  color,
  thickness,
  size,
}: {
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'inherit'
    | 'info'
    | 'error';
  thickness?: number;
  size?: number;
}) {
  return (
    <CircularProgress
      color={color ?? 'secondary'}
      thickness={thickness ?? 3}
      size={size ?? 25}
      sx={{ marginRight: '10px' }}
    />
  );
}
