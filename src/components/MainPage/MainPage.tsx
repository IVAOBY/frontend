import { GeneralLayout } from '../Layout';
import { AgendaNews } from './components/AgendaNews';
import { HeroText } from './components/Heropage';
import { OnlineInfoComponent } from './components/OnlineInfo';
import { Widgets } from './components/Widgets';

export function MainPage() {
  return (
    <GeneralLayout>
      <HeroText />
      <Widgets />
      <AgendaNews></AgendaNews>
      <OnlineInfoComponent></OnlineInfoComponent>
    </GeneralLayout>
  );
}
