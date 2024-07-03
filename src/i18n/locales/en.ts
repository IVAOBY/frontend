import { Translations } from '../../types/Translations';

const enTranslations: { translations: Translations } = {
  translations: {
    navbar: {
      division: {
        index: 'Division',
        about: 'About us',
        faq: 'FAQ',
        staff: 'Division Staff',
        airports: 'Airports',
        discord: 'Discord',
        contact: 'Contact us',
        rules: 'IVAO rules',
        legal: 'Legal information',
      },
      atc: {
        index: 'ATC',
        start: 'First steps',
        fra: 'FRAs',
        sector: 'IvAc Sector',
        gca: 'GCA Programme',
        charts: 'Charts',
        docs: 'Documents',
        vehicles: 'Vehicles',
      },
      pilots: {
        index: 'Pilots',
        start: 'First steps',
        scenarios: 'Scenarios',
        charts: 'Charts',
        airlines: 'Virtual airlines',
        tours: 'Tours',
      },
      community: {
        index: 'Community',
        training: 'Training',
        events: 'Events',
        forum: 'BY Forum',
        webeye: 'WebEye',
        ivao: 'IVAO website',
        tracker: 'Tracker',
      },
      user: {
        login: 'Login',
        logout: 'Logout',
        profile: 'Profile',
      },
    },
    errorpage: {
      notfoundtext: 'Page not found!',
      notfoundsubtext:
        "It seems like you tried to open a page that doesn't exist. Good thing we have a cool button for you:",
      homebutton: 'Home!',
    },
    heropage: {
      title: 'Welcome to the BY Division of',
      subtitle: 'The most modern IVAO division.',
      subtitle2: 'Join now!',
      joinbutton: 'Join!',
      transfer: 'Transfer to BY',
    },
    onlinecomponent: {
      title: 'Activity of division in the Network',
      first: {
        title: 'Pilots',
      },
      second: {
        title: 'ATC',
      },
    },
    vehicles: {
      title: 'Vehicles',
      airports: 'Airports',
      description:
        'The table below describes the airports where the use of vehicles is permitted',
      airport: 'Airport',
      atcreq: 'ATC requirements',
      driverreq: 'Driver requirements',
      vids: 'Allowed VIDs',
      training: 'Training is required',
      caption: 'Active ATC position (GND+) is required for vehicle operation',
    },
    breadcrumb: {
      title: 'Home',
    },
    sector: {
      title: 'Sector file',
      text: 'On this page you can download the sector file for IvAc.',
      wtitle: 'Please pay attention!',
      warning:
        'IvAc is deprecated and no longer recommended to use! We strongly recommend using Aurora.',
      download: 'Download',
    },
    news: {
      title: 'News',
      button: 'Read more',
    },
    staff: {
      name: 'Division Staff',
      nopositions: 'No available staff positions in this department',
    },
    documents: {
      error: {
        nodoc: 'No Documents for this category',
      },
    },
    AboutUs: {
      title: 'About us',
      text: 'The International Virtual Aviation Organisation, IVAO for short, was founded in 1998 to provide an online platform for flight simulation enthusiasts to enjoy their hobby in a simulated real-world environment, in company of other people, flying or providing Air Traffic Control services.',
    },
    generic: {
      ivao: 'IVAO',
    },
    footer: {
      copyrightMessage: 'All rights reserved.',
      legal: {
        title: 'Legal information',
        privacypolicy: 'Privacy Policy',
        termsofuse: 'Terms of use',
        ipp: 'Intellectual Property Policy',
      },
      community: {
        title: 'Community',
        forum: 'IVAO Belarus Forum',
        ivao: 'IVAO Website',
        ivaofamily: 'IVAO Family',
      },
    },
    notif: {
      loading: {
        name: 'Loading data...',
        descritpion: 'Please wait while we contact the server.',
      },
      loaded: {
        name: 'Data loaded!',
        descritpion: 'Hooray! We received and processed the data.',
      },
      server: {
        name: 'Error!',
        descritpion: 'The server did not want to share data with us :(',
      },
      auth: {
        negative: {
          name: 'Error!',
          description: 'It seems you have to log into your account first.',
        },
      },
    },
    events: {
      content: {
        title: 'Events',
      },
      booking: {
        book: 'Book',
        unbook: 'Cancel',
        none: 'There are no available positions!',
      },
    },
    Scenery: {
      title: 'Sceneries',
      search: 'Enter ICAO',
      searchButton: 'Find',
      helpTitle: 'Would you like to see your own sceneries here?',
      helpText:
        'Can you help us develop scenarios for division airports? Join us!',
      helpButton: "I'm in!",
    },
    FAQ: {
      page: {
        title: 'Frequently Asked Questions',
      },
      questions: {
        1: "I was a member of IVAO, but after being inactive, I can't get online.",
        2: "I registered for the second time because I can't remember the password to my old account or I don't have access to my e-mail in my old account.",
        3: 'When registering, I entered my first and last name in Russian and they became unreadable. What should I do?',
        4: "I was supposed to get an award on my profile, but I didn't. Why?",
        5: 'I lost my password, how can I get it again?',
        6: 'How can I change my email in my profile?',
        7: 'Online hours are not updating in my account. Is it ok?',
        8: 'How can I move to the BY division?',
        9: 'Who can I contact if I have any other questions?',
        10: 'hello',
      },
      answers: {
        1: "If an IVAO user has not been active on the network for 3 months, the account becomes inactive and is marked as \"Inactive User\" in the profile. After that you will not be able to connect to the network. If you remember your VID, it is very easy to activate your account: go to the profile page of your account. <a href='https://www.ivao.aero/members/person/details.asp?ID=XXXXXX' target='_blank'>https://www.ivao.aero/members/person/details.asp?ID=XXXXXX</a> (replace XXXXX with your VID). Click the \"Click here to reactivate it\" link on the right. Activation will take place automatically within 15 minutes. If you have forgotten your password, go to the password recovery page <a href='http://www.ivao.aero/members/person/password.htm' target='_blank'>http://www.ivao.aero/members/person/password.htm</a>. If you do not remember your VID, send an email with your first name, last name, and email address provided when you registered with the BY Membership Department (<a href='mailto:by-membership@ivao.aero' target='_blank'>by-membership@ivao.aero</a>). ",
        2: "In case you have access to the mail in your old account, go to the page to recover your password <a href='https://ivao.aero/Login.aspx' target='_blank'>https://ivao.aero/Login.aspx</a>, enter the VID of your old account and click \"I forgot my password\". The password will be sent automatically to the mail in your old profile. In case you do not have access to the mail, email BY Membership Department (<a href='mailto:by-membership@ivao.aero?subject=E-mail%20change%20VID%20XXXXXX&body=%D0%A3%D0%B2%D0%B0%D0%B6%D0%B0%D0%B5%D0%BC%D1%8B%D0%B9%20Membership%20%D0%94%D0%B5%D0%BF%D0%B0%D1%80%D1%82%D0%B0%D0%BC%D0%B5%D0%BD%D1%82!%0D%0A%0D%0A%D0%9F%D1%80%D0%BE%D1%88%D1%83%20%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B8%D1%82%D1%8C%20%D0%BC%D0%BE%D1%8E%20%D0%BF%D0%BE%D1%87%D1%82%D1%83%20%D0%B2%20%D0%B0%D0%BA%D0%BA%D0%B0%D1%83%D0%BD%D1%82%D0%B5%20IVAO.%0D%0A%D0%A1%D1%82%D0%B0%D1%80%D0%B0%D1%8F%20%D0%BF%D0%BE%D1%87%D1%82%D0%B0%3A%0D%0A%D0%9D%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%BF%D0%BE%D1%87%D1%82%D0%B0%3A%0D%0A%D0%9F%D1%80%D0%B8%D1%87%D0%B8%D0%BD%D0%B0%3A%0D%0A%0D%0A%D0%A1%20%D1%83%D0%B2%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%2C%0D%0A' target='_blank'>by-membership@ivao.aero</a>) with a request to change the e-mail address in your old account. In the subject line write: E-mail change VID XXXXXX (where XXXXXX is your VID). In the text of the e-mail, please specify the reason for the change of address, and be sure to include the old and new address.",
        3: "Email the BY Membership Department (<a href='mailto:by-membership@ivao.aero' target='_blank'>by-membership@ivao.aero</a>), enter your VID and your first and last name in Latin letters. Your profile will be changed with these data.",
        4: "If you have not received an award for the IVAO World Tour, please contact <a href='mailto:members@ivao.aero' target='_blank'>members@ivao.aero</a> (in English) to clarify the issue. If you have not received an award for a divisional tourney or event, please contact <a href='mailto:xx-mc@ivao.aero' target='_blank'>xx-mc@ivao.aero</a> или <a href='mailto:xx-mac@ivao.aero' target='_blank'>xx-mac@ivao.aero</a>, where xx is the two-letter code for the division in which you were in the tourney or event.",
        5:
          'You can request password recovery on the account login page. \n' +
          'The password will be sent to the e-mail address specified in your profile during registration.',
        6: "You cannot change it yourself. If you need to change the address on your account, submit a request to BY Membership Department (<a href='mailto:members@ivao.aero' target='_blank'>members@ivao.aero</a>). In the subject line specify: E-mail change and your VID. In the body of the e-mail, indicate the reason for the change of address, as well as your old and new addresses.",
        7:
          'Changing the number of your online hours is an automatic process performed on the IVAO servers. If you find that the number of online hours does not change, make sure that you have actually connected to the network as a pilot or dispatcher. To check this, go to the IVAO Tracker page and check your online activity. If the activity is confirmed, please wait 12 to 24 hours and then check your profile again.\n' +
          '\n' +
          '\n' +
          'It is also possible that the pilot (this is for pilots only) was connected to the network, but remained stationary for a long time (for example, standing in a parking lot or pressing pause in the simulator). In this case the system considers such actions as "sandbagging" and will not increase your online hours.',
        8:
          'Based on IVAO Regulation 4.1.6, a user may request a division change at any time, however all transfers are subject to approval by division management and the IVAO User Relations Department.\n' +
          '\n' +
          '\n' +
          "Send a request for <a href='mailto:xx-hq@ivao.aero' target='_blank'>xx-hq@ivao.aero</a> and <a href='mailto:yy-hq@ivao.aero' target='_blank'>yy-hq@ivao.aero</a>, with a CC for <a href='mailto:members@ivao.aero' target='_blank'>members@ivao.aero</a> (it must be one e-mail from the e-mail address specified in your account)\n" +
          '\n' +
          '\n' +
          'Replace xx with the two-letter code for your current division (for information)\n' +
          'Replace uu with the two-letter code of the division you intend to transfer to (approval required)\n' +
          '\n' +
          'In the subject line write: Division Transfer VID 123456 (replace 123456 with your VID)\n' +
          'In the body of the letter, write: I request to transfer me from XX division to YY division\n' +
          'Please note that a transfer is possible provided you are not pending a practical exam in your current division. Please complete the exam or request a cancellation from the Training Department.\n' +
          '\n' +
          'You can also use the button on our division home page to automail.',
        9: "If you would like to contact any of the BY division coordinators, please see their e-mail address in the <a href='/staff' target= '_blank' >staff list</a>",
        10: 'hello',
      },
    },
  },
};

export default enTranslations;
