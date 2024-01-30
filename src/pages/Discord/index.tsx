import React, { useState } from 'react';

import { CustomButton } from '../../components/Button';
import { LayoutTitle } from '../../components/Layout';
import { H3 } from '../../components/Typography/H3';

export function DiscordPage() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleButtonClick = () => {
    if (isChecked) {
      window.location.href = 'https://example.com';
    } else {
      alert('Please agree to the rules by checking the checkbox.');
    }
  };

  return (
    <LayoutTitle
      title={'Division Discord'}
      description={'Официальный дискорд дивизиона'}
      descriptionStyle={'mb-5'}
      withUnderline
    >
      {/*TODO: Придумать дизайн*/}
      <div className="mx-auto max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <H3 className={'text-center text-atmos-700'}>BY Division Discord</H3>

        <p className="mt-4 text-gray-600">
          Please, use button the below to authenticate your Discord account and
          join at our server
        </p>

        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="agreeCheckbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="agreeCheckbox" className="text-sm text-gray-700">
            I have read and agree to the{' '}
            <a
              className={
                'font-semibold text-atmos-700 transition hover:text-ocean-600 hover:underline'
              }
              href="https://xr.ivao.aero/site/showDocument/151"
              target="_blank"
              rel="noopener noreferrer"
            >
              Division Discord Server Rules
            </a>{' '}
            and{' '}
            <a
              className={
                'font-semibold text-atmos-700 transition hover:text-ocean-600 hover:underline'
              }
              href="https://xr.ivao.aero/site/showDocument/158"
              target="_blank"
              rel="noopener noreferrer"
            >
              Declaration of Consent for Data Processing
            </a>
            .
          </label>
        </div>
        <CustomButton
          onClick={handleButtonClick}
          disabled={!isChecked}
          variant={'primary'}
          size={'lg'}
          title={'Присоединиться'}
        ></CustomButton>
      </div>
    </LayoutTitle>
  );
}
