import { GeneralLayout } from '../Layout';
import { HeroText } from './components/Heropage';
import { NewsSection } from './components/NewsSection';
import { OnlineInfoComponent } from './components/OnlineInfo';

export function MainPage() {
  return (
    <GeneralLayout>
      <HeroText />
      <OnlineInfoComponent></OnlineInfoComponent>
      <NewsSection></NewsSection>
    </GeneralLayout>
  );
}
