import React, { ReactNode, useState } from "react";
import { CollapseIcon } from "src/components/Icons/Icons";

interface AccordionItemProps {
  index?: number
  title: string
  content: string | ReactNode
}

const AccordionItem = ({ index, title, content }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <h2 id={`accordion-collapse-heading-${index}`}>
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 rtl:text-right border border-b-0 border-gray-700 hover:bg-gray-800 gap-3"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-controls={`accordion-collapse-body-${index}`}
        >
          <span>{title}</span>
          <CollapseIcon up={isOpen} />
        </button>
      </h2>
      <div
        id={`accordion-collapse-body-${index}`}
        className={`${isOpen ? '' : 'hidden'}`}
        aria-labelledby={`accordion-collapse-heading-${index}`}
      >
        <div className="p-5 border border-b-0 border-gray-700 bg-gray-900">
          {content}
        </div>
      </div>
    </div>
  )
}

interface AccordionProps {
  items: AccordionItemProps[]
}

const Accordion = ({ items }: AccordionProps) => {
  return (
    <>
      <div>
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            index={index}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>
      <div className="border-b border-gray-700"></div>
    </>
  )
}

export default Accordion
