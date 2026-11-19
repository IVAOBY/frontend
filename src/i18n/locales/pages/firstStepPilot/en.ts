import { FirstStepPilotTexts } from './types';

const en: FirstStepPilotTexts = {
  title: 'First steps',
  welcome: {
    title: '👋 Welcome to IVAO Belarus!',
    intro:
      'Welcome to the <b>Belarus Division of IVAO</b> (International Virtual Aviation Organisation)! Our division is part of the international IVAO community and brings together members from Belarus.',
    whatIs:
      '<b>What is IVAO?</b> It is a global international network that unites thousands of aviation enthusiasts from all over the world. Everything here is the real deal: pilots fly virtual aircraft in their simulators, while controllers manage the airspace using dedicated software. We fly by real-world rules, communicate by live voice on the air and fully recreate the atmosphere of civil aviation.',
    division:
      '<b>Our division</b> is the IVAO representation in the Republic of Belarus. We are responsible for the Minsk Flight Information Region (Minsk FIR), operate the virtual sky over our country, run large-scale events and help members grow from first steps to experienced virtual pilots and controllers.',
  },
  community: {
    title: '🌐 Useful links and community',
    intro:
      'To stay up to date, coordinate flights and find friends, be sure to join our resources:',
    items: [
      '<b>Our Discord server:</b> <discord>discord.by.ivao.aero</discord> – the division’s main communication hub: get help quickly, find a crew, chat in voice channels or discuss software.',
      '<b>Our social networks:</b> <telegram>Telegram</telegram>, <instagram>Instagram</instagram>, <threads>Threads</threads>, <facebook>Facebook</facebook>, <twitter>X (Twitter)</twitter>. Follow us to stay up to date with the news and events of our division.',
      '<b>IVAO Family</b>: <family>family.ivao.aero</family> – the global hub of the whole IVAO network, uniting aviation enthusiasts from around the world and linking to the central communities and shared international resources.',
    ],
  },
  tours: {
    title: '🛫 Division and World Tours',
    intro:
      'If you don’t know where to fly this evening, the <b>IVAO tours system</b> is the perfect solution. These are chains of tasks (flights) of varying difficulty, and for completing them you receive beautiful awards on your profile.',
    items: [
      '<b>Division tours:</b> Our division regularly launches internal tours. These can be flights between Belarus’s regional centres, to interesting airports or to neighbouring countries. You can browse and pick a division tour here — <tours>tours.by.ivao.aero</tours>.',
      '<b>World Tours:</b> At the international level IVAO offers dozens of tours: from round-the-world journeys to extreme landings in the Alps. All international tours are published at — <worldtours>wt.ivao.aero</worldtours>.',
    ],
  },
  software: {
    title: '💻 Installing the software',
    intro:
      'To connect to the network you will need the official IVAO software. Choose your role and follow the links:',
    pilots: {
      title: '✈️ For pilots (Altitude client)',
      text: 'To fly you will need the <b>Altitude</b> client, which connects your simulator (MSFS, X-Plane, Prepar3D or FSX) to the IVAO server. The developers have prepared a very detailed step-by-step guide to downloading, installing and launching it for the first time.',
      manual: '👉 <altitude><b>IVAO Altitude First Step manual</b></altitude>',
    },
    atc: {
      title: '🎧 For controllers (Aurora client)',
      text: 'Air traffic control uses the <b>Aurora</b> radar client.',
      prepare: 'If you want to study and set up the program in advance:',
      steps: [
        'First, read the <aurora><b>IVAO Aurora First Step</b></aurora> manual.',
        'Then read our local guide, which describes step by step the details of configuring the program specifically for our country <br/>👉 <aurorabelarus><b>Aurora client setup manual for Minsk FIR</b></aurorabelarus>',
      ],
      special: '⚠️ <h>A feature of our division:</h>',
      specialText:
        'In the Belarus Division you <b>cannot</b> simply connect to a control position right after installing the software. First you need to obtain the appropriate clearance. How exactly to apply for training and open your first control session is described step by step below.',
    },
  },
  training: {
    title: '🎓 Training and ratings: Cornflower Academy',
    intro:
      'The IVAO network has a single rating system for pilots and controllers. By default, every new user is assigned the initial ratings after registration:',
    ranks: [
      '<b>FS1</b> (Basic Flight Student) — the initial pilot rating. It means you are taking your first steps in virtual flying and radio communication on the network.',
      '<b>AS1</b> (ATC Applicant) — the basic status for those who want to control air traffic. It is the starting point for learning controller procedures.',
    ],
    more: 'If you want to progress further through the ratings, take exams and unlock new possibilities, see the full list and description of all levels in the IVAO Wiki for <pilotranks>pilots</pilotranks> and <atcranks>controllers</atcranks>.',
    policy:
      '🔥 <h>Before you start, be sure to read our <policy>training conduct policy</policy>.</h>',
    firstControl: {
      title: '🎧 How to open your first control session?',
      intro:
        'If your goal is air traffic control, remember: in our division you <b>cannot</b> simply connect to the network on a control position right after installing the software. To be able to go online, you need to request your first training — <b>First Steps</b>. There are two ways to do it:',
      method1Title: '<b>Method 1. Step by step:</b>',
      method1Steps: [
        'Go to the main site <ivao>ivao.aero</ivao> and sign in to your profile (<b>Login</b>).',
        'In the top right corner click your identifier (<b>Name Surname VID</b>) to open your personal account.',
        'Scroll down the page and find the <b>My Personal Details</b> section.',
        'Here you will see an overview of all your trainings (at first the list will be empty). You need to find and click the following text: <b>“For more details or to request a new training check here”</b>.',
        'After that you will land on the <i>Training Request</i> page. Read the information provided and go to the <b>training status page</b>.',
        'In the <b>Air Traffic Control</b> block click the coveted <b>“Request Training”</b> button.',
      ],
      method2Title: '<b>Method 2. Direct link:</b>',
      method2Text:
        'You can go straight to the <trainingstatus>IVAO Training Status Page</trainingstatus> using the link. However, you still need to know and remember the whole path to it described above.',
      afterRequest:
        'Once the request is sent, you will receive an <b>email with detailed instructions</b> — what exactly you need to do and how your first step on the air will go.',
    },
    academy: {
      title: '🪻 For the curious: Cornflower Academy',
      text: 'Want to know more and prepare as much as possible before your training starts? Our division runs its own local learning platform — <b>Cornflower Academy</b>. It is a great place to dive into aviation theory and study the rules on your own.',
      go: '👉 Go and study the materials: <cornflower>cornflower.by.ivao.aero</cornflower>',
    },
    bye: '<h>See you in the virtual sky! 🛩️</h>',
  },
};

export default en;
