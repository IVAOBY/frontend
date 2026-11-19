import beTranslations from './be';
import enTranslations from './en';
import firstStepPilot, { FIRST_STEP_PILOT_NS } from './pages/firstStepPilot';
import ruTranslations from './ru';

const resources = {
  be: { ...beTranslations, [FIRST_STEP_PILOT_NS]: firstStepPilot.be },
  en: { ...enTranslations, [FIRST_STEP_PILOT_NS]: firstStepPilot.en },
  ru: { ...ruTranslations, [FIRST_STEP_PILOT_NS]: firstStepPilot.ru },
};

export default resources;
