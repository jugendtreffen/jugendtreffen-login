# Jugendtreffen login

## Setup

> **Prerequisites**
>
> - Redwood requires [Node.js](https://nodejs.org/en/) (=20.x) and [Yarn](https://yarnpkg.com/)
> - Are you on Windows? For best results, follow our [Windows development setup](https://redwoodjs.com/docs/how-to/windows-development-setup) guide

Start by installing dependencies:

```
yarn install
```

Then start the development server:

```
yarn redwood dev
```

Your browser should automatically open to [http://localhost:8910](http://localhost:8910) where you'll see the Welcome Page, which links out to many great resources.

**The Redwood CLI**

Congratulations on running your first Redwood CLI command! From dev to deploy, the CLI is with you the whole way. And there's quite a few commands at your disposal:
```
yarn redwood --help
```
For all the details, see the [CLI reference](https://redwoodjs.com/docs/cli-commands).

## Prisma and the database

The Db data model is saved in the [`schema.prisma`](api/db/schema.prisma) file in `api/db` see [Prisma Data Modelling](https://www.prisma.io/docs/orm/overview/introduction/data-modeling) and [Prisma with Supabase](https://www.prisma.io/docs/orm/overview/databases/supabase) for further expalination of how all of this works. I wont explain it here.

Redwood uses [Prisma](https://www.prisma.io/), a next-gen Node.js and TypeScript ORM, to talk to the database. Prisma's schema offers a declarative way of defining your app's data models. And Prisma [Migrate](https://www.prisma.io/migrate) uses that schema to make database migrations hassle-free:

```
yarn rw prisma migrate dev

# ...

? Enter a name for the new migration: › <YOUR_MIGRATION_NAME>
```

`rw` is short for `redwood`

### Custom SQL

> I couldn't figure out how to effectively connect the users with their personal Data so I just manually insert this foreign Key, please don't forget to run this before and after creating a new migration!
> (Otherwise you will get an error)
>
> Remove the fkey causing the trouble:
> ```
> yarn rw  prisma db execute --file=./api/db/pre_migration.sql
> ```
> Then execute your migration:
> ```
> yarn rw prisma migrate dev
> ```
>
> After that add the fkey to the db with:
> ```
> yarn rw  prisma db execute --file=./api/db/add_personalDatas_users_fkey.sql
> ```
>
> Tipp: You can also add the snippet, that creates the fkey, to your migration.sql file

The above methods can be used if you have relations to other schemas in supabase and don't want to touch them.

## UI & Storybook

Don't know what your data models look like? That's more than ok—Redwood integrates Storybook so that you can work on design without worrying about data. Mockup, build, and verify your React components, even in complete isolation from the backend:

```
yarn rw storybook
```

Seeing "Couldn't find any stories"? That's because you need a `*.stories.{tsx,jsx}` file. The Redwood CLI makes getting one easy enough—try generating a [Cell](https://redwoodjs.com/docs/cells), Redwood's data-fetching abstraction:

```
yarn rw generate cell examplePosts
```

The Storybook server should hot reload and now you'll have four stories to work with. They'll probably look a little bland since there's no styling. See if the Redwood CLI's `setup ui` command has your favorite styling library:

```
yarn rw setup ui --help
```

### UI Templates:
Most of the Blocks are borrowed from [Flowbite](https://flowbite.com/) check them out bevore designing something on your own only to find out it already exists, but better.

Also consider taking a look into the [Tailwind docs](https://tailwindcss.com/docs/) as I used Tailwind extensively.


## Testing with Jest

It'd be hard to scale from side project to startup without a few tests. Redwood fully integrates Jest with both the front- and back-ends, and makes it easy to keep your whole app covered by generating test files with all your components and services:

```
yarn rw test
```

To make the integration even more seamless, Redwood augments Jest with database [scenarios](https://redwoodjs.com/docs/testing#scenarios) and [GraphQL mocking](https://redwoodjs.com/docs/testing#mocking-graphql-calls).

## Deployment & Furhter Infos

U can use serverless deploy targets like Netlify and Vercel and serverful deploy targets like Render and AWS:

```
yarn rw setup deploy --help
```
This will help setting up the deployment.

How to handle data fetching, Cells, Scaffolds and other Concepts of [RedwoodJS](https://redwoodjs.com/docs) please read up in the documentation of Redwood, I wont explain it here.

The best way to learn Redwood is by going through the comprehensive [tutorial](https://redwoodjs.com/docs/tutorial/foreword) and joining the community (via the [Discourse forum](https://community.redwoodjs.com) or the [Discord server](https://discord.gg/redwoodjs)).
