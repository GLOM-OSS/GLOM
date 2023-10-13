import { Box } from '@mui/material';
import Question, { IFaqQuestion } from './Question';
import { useIntl } from 'react-intl';

export default function QuestionsSection() {
  const { formatMessage } = useIntl();

  const questions: IFaqQuestion[] = [
    {
      question: formatMessage({ id: 'howCanSquoolrHelpOurSchool' }),
      answer: formatMessage({ id: 'howCanSquoolrHelpOurSchoolAnswer' }),
    },
    {
      question: formatMessage({ id: 'whatAreSquoolrFunctionalities' }),
      answer: formatMessage({ id: 'whatAreSquoolrFunctionalitiesAnswer' }),
    },
    {
      question: formatMessage({ id: 'isSquoolrConfigurable' }),
      answer: formatMessage({ id: 'isSquoolrConfigurableAnswer' }),
    },
    {
      question: formatMessage({ id: 'howDoWeHandleDataSecurity' }),
      answer: formatMessage({ id: 'howDoWeHandleDataSecurityAnswer' }),
    },
    {
      question: formatMessage({ id: 'canSquoolrIntegrateExternally' }),
      answer: formatMessage({ id: 'canSquoolrIntegrateExternallyAnswer' }),
    },
    {
      question: formatMessage({ id: 'squoolrClientService' }),
      answer: formatMessage({ id: 'squoolrClientServiceAnswer' }),
    },
    {
      question: formatMessage({ id: 'squoolrCost' }),
      answer: formatMessage({ id: 'squoolrCostAnswer' }),
    },
    {
      question: formatMessage({ id: 'canWeTestSquoolr' }),
      answer: formatMessage({ id: 'canWeTestSquoolrAnswer' }),
    },
    {
      question: formatMessage({ id: 'canSquoolrSupportAllSchoolSizes' }),
      answer: formatMessage({ id: 'canSquoolrSupportAllSchoolSizesAnswer' }),
    },
  ];
  return (
    <Box
      sx={{
        width: { laptop: '90%', mobile: '100%' },
        margin: '0 auto',
        padding: '0 16px',
      }}
    >
      <Box sx={{ display: 'grid', rowGap: { mobile: 1.5, laptop: 2.6 } }}>
        {questions.map((question, index) => (
          <Question key={index} question={question} />
        ))}
      </Box>
    </Box>
  );
}
