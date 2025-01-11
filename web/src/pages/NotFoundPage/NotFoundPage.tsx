import { Link, routes } from "@redwoodjs/router";

export default () => (
  <main>
    <style
      dangerouslySetInnerHTML={{
        __html: `
              html, body {
                margin: 0;
              }
              html * {
                box-sizing: border-box;
              }
              main {
                display: flex;
                align-items: center;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
                text-align: center;
                background-color: #111827;
                height: 100vh;
              }
              section {
                width: 32rem;
                padding: 1rem;
                margin: 0 auto;
              }
            `,
      }}
    />
    <section className="bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1
            className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 text-blue-600">404</h1>
          <p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl text-white">Something's
            missing.</p>
          <p className="mb-4 text-lg font-light text-gray-400">Sorry, we can't find that page. You'll
            find lots to explore on the home page. </p>
          <Link to={routes.home()} className="secondary">
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  </main>
)
