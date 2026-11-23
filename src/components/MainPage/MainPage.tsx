import { GeneralLayout } from '../Layout';
import { AgendaNews } from './components/AgendaNews';
import { EnvAlert } from './components/EnvAlert';
import { HeroText } from './components/Heropage';
import { Widgets } from './components/Widgets';

export function MainPage() {
  return (
    <>
      <EnvAlert />
      <HeroText />
      <GeneralLayout>
        <Widgets />
        <AgendaNews></AgendaNews>
      </GeneralLayout>
    </>
  );
}
