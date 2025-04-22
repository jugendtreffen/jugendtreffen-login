import { ReactNode } from "react";
import { Link } from "@redwoodjs/router";
import { ArrowRightIcon } from "src/components/Icons/Icons";

interface CardProps {
  title?: string,
  description?: string,
  button?: {
    message: string,
    to: string,
  },
  imgSrc?: string,
  children?: ReactNode,
  className?: string,
}

const Card = (props: CardProps) => {
  return (
    <div className={`max-w-md p-6 border rounded-lg shadow bg-gray-800 border-gray-700 ${props.className}`}>
      {props.title && (
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
          {props.title}
        </h5>
      )}
      {props.description && (
        <p className="mb-3 font-normal text-gray-400">
          {props.description}
        </p>
      )}
      {props.children}
      {props.button && (
        <Link to={props.button.to} className="primary inline-flex items-center">
          {props.button.message}
          <ArrowRightIcon/>
        </Link>
      )}
    </div>
  )
}

export default Card
