import React, { ReactNode, useState } from 'react';

interface AccordionItemProps {
  title: string;
  content: ReactNode;
  icon?: ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  content,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <h2>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 rounded-t-xl border border-b-0 border-gray-200 bg-white p-5 font-medium text-gray-500 transition hover:bg-gray-50 rtl:text-right"
          data-accordion-target={`#accordion-collapse-body-${title}`}
          aria-expanded={isOpen}
          aria-controls={`accordion-collapse-body-${title}`}
          onClick={handleToggle}
        >
          <span className={`row flex gap-2 text-atmos-700 md:text-base`}>
            <span className={`${icon ? 'hidden sm:flex' : ''}`}>{icon}</span>{' '}
            {title}
          </span>
        </button>
      </h2>
      <div
        id={`accordion-collapse-body-${title}`}
        className={`${
          isOpen ? '' : 'hidden'
        } border border-b-0 border-gray-200 bg-white p-5 dark:border-gray-700`}
        aria-labelledby={`accordion-collapse-heading-${title}`}
      >
        <p
          className={'text-gray-700'}
          dangerouslySetInnerHTML={{ __html: content || 'Failed to load' }}
        />
      </div>
    </>
  );
};

interface AccordionProps {
  items: AccordionItemProps[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  return (
    <div id="accordion-collapse" data-accordion="collapse">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          icon={item.icon}
        />
      ))}
    </div>
  );
};

export default Accordion;
