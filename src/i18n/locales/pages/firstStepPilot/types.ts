/**
 * Структура текстов страницы «Первые шаги пилота».
 *
 * Разметка внутри строк (используется через <Trans>):
 *  <b>…</b>  – жирный (12pt в оригинале), <h>…</h> – выделенный жирный (13pt),
 *  <i>…</i>  – курсив, <br/> – перенос строки,
 *  <имя>…</имя> – ссылка, URL берётся из LINKS в FirstStepPilot.tsx.
 */
export interface FirstStepPilotTexts {
  title: string;
  welcome: {
    title: string;
    intro: string;
    whatIs: string;
    division: string;
  };
  community: {
    title: string;
    intro: string;
    items: string[];
  };
  tours: {
    title: string;
    intro: string;
    items: string[];
  };
  software: {
    title: string;
    intro: string;
    pilots: {
      title: string;
      text: string;
      manual: string;
    };
    atc: {
      title: string;
      text: string;
      prepare: string;
      steps: string[];
      special: string;
      specialText: string;
    };
  };
  training: {
    title: string;
    intro: string;
    ranks: string[];
    more: string;
    policy: string;
    firstControl: {
      title: string;
      intro: string;
      method1Title: string;
      method1Steps: string[];
      method2Title: string;
      method2Text: string;
      afterRequest: string;
    };
    academy: {
      title: string;
      text: string;
      go: string;
    };
    bye: string;
  };
}
