import React, { useState } from 'react';

interface AccordionItemProps {
  title: string;
  content: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`mt-2 w-full max-w-screen-xl ${isOpen ? 'border border-[#D7D7DC]' : ''} rounded-xl transition-all duration-200`}
    >
      <h2>
        <button
          type="button"
          className={`flex w-full items-center justify-between break-words rounded-xl pb-[16px] pl-[28px] pr-[25px] pt-[14px] text-left font-medium text-gray-900 ${isOpen ? 'rounded-b-none bg-white' : 'bg-[#EBEBEB]'} transition-colors duration-200`}
          onClick={handleToggle}
          aria-expanded={isOpen}
        >
          {title}
          <svg
            className={`size-6${isOpen ? 'rotate-180' : ''} transition-transform duration-200`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </h2>
      <div
        className={`transition-max-height overflow-hidden duration-700 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="rounded-b-xl bg-white pb-[14px] pl-[28px] pr-[25px] pt-[5px]">
          <div
            className="break-words text-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};

interface AccordionProps {
  items: AccordionItemProps[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  return (
    <div className="mx-auto w-full">
      {items.map((item, index) => (
        <AccordionItem key={index} title={item.title} content={item.content} />
      ))}
    </div>
  );
};

export default Accordion;
