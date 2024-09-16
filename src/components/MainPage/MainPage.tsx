import { GeneralLayout } from '../Layout';
import { AgendaNews } from './components/AgendaNews';
import { EnvAlert } from './components/EnvAlert';
import { EventTemp } from './components/EventTemp';
import { HeroText } from './components/Heropage'; // import { OnlineInfoComponent } from './components/OnlineInfo'; // import { OnlineInfoComponent } from './components/OnlineInfo';
import { Widgets } from './components/Widgets';

export function MainPage() {
  return (
    <>
      <EnvAlert />
      <HeroText />
      <GeneralLayout>
        <Widgets />
        <EventTemp />
        <AgendaNews></AgendaNews>
        {/*<OnlineInfoComponent></OnlineInfoComponent>*/}
      </GeneralLayout>
    </>
  );
}
