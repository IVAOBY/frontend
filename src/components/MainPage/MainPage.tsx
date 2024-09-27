import { GeneralLayout } from '../Layout';
import { AgendaNews } from './components/AgendaNews';
import { EnvAlert } from './components/EnvAlert';
import { HeroText } from './components/Heropage'; // import { OnlineInfoComponent } from './components/OnlineInfo'; // import { OnlineInfoComponent } from './components/OnlineInfo';
import { Widgets } from './components/Widgets';

export function MainPage() {
  return (
    <>
      <EnvAlert />
      <HeroText />
      <GeneralLayout>
        <Widgets />
        <AgendaNews></AgendaNews>
        {/*<OnlineInfoComponent></OnlineInfoComponent>*/}
      </GeneralLayout>
    </>
  );
}
