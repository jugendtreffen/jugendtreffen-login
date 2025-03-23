// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const ParticipatePage = () => {
  return (
    <>
      <Metadata title="Participate" description="Participate page" />

      <h1>ParticipatePage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/ParticipatePage/ParticipatePage.tsx</code>
      </p>
      {/*
          My default route is named `participate`, link to me with:
          `<Link to={routes.participate()}>Participate</Link>`
      */}
    </>
  )
}

export default ParticipatePage
