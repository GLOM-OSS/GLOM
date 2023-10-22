import { useTheme } from '@glom/theme';
import { Box, Typography } from '@mui/material';

export default function StepperItem({
  step,
  currentStep,
  activeStep,
  position,
  openStep,
}: {
  step: string;
  currentStep: number;
  activeStep: number;
  position: number;
  openStep: () => void;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'grid',
        justifyItems: 'center',
        cursor: 'pointer',
      }}
      onClick={openStep}
    >
      <Box
        sx={{
          borderRadius: '100%',
          height: '20px',
          width: '20px',
          border:
            activeStep === position
              ? `2px solid ${theme.palette.primary.main}`
              : 'none',
          backgroundColor:
            activeStep > position
              ? theme.palette.primary.main
              : activeStep === position
              ? 'transparent'
              : theme.common.label,
        }}
      />
      <Typography
        variant="overline"
        sx={{
          fontWeight: 600,
          color:
            activeStep === position || currentStep >= position
              ? theme.palette.primary.main
              : theme.common.label,
          position: 'absolute',
          top: '160%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          whiteSpace: 'nowrap',
        }}
      >
        {step}
      </Typography>
    </Box>
  );
}
