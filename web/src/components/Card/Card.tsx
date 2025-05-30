import { ReactNode } from "react";

import { Link } from "@redwoodjs/router";

import { ArrowRightIcon } from "src/components/Icons/Icons";

interface CardProps {
  title?: string
  description?: string
  button?: {
    message: string
    to: string
  }
  imgSrc?: string
  children?: ReactNode
  className?: string
}

const Card = (props: CardProps) => {
  return (
    <div
      className={`max-w-md p-6 border rounded-xl bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl ${props.className}`}
    >
      {props.title && (
        <h2 className="mb-2 text-2xl font-bold tracking-tight">
          {props.title}
        </h2>
      )}
      {props.description && (
        <p className="mb-3 font-normal text-gray-400">{props.description}</p>
      )}
      {props.children}
      {props.button && (
        <Link to={props.button.to} className="primary inline-flex items-center">
          {props.button.message}
          <ArrowRightIcon />
        </Link>
      )}
    </div>
  )
}

export default Card
