# create-dulo-app
Welcome to create-dulo-app. A starter kit for creating modular micro frontends. 

It uses [Parcel](https://github.com/parcel-bundler/parcel) to bundle your app down to a single JavaScript file artifact that can be used by consumer applications to host your micro frontend. Dulo is very unopinionated and as extensible as Parcel is for building web applications.

If something doesn’t work, [please file an issue](https://github.com/jaredtbrown/create-dulo-app/issues).

If you have questions or need help, please ask in [GitHub Discussions](https://github.com/jaredtbrown/create-dulo-app/discussions).

## Getting Started
To get started, run the following commands:

```shell
yarn
yarn start
```

And then in another terminal, run:
```shell
yarn dev
```

Go to [http://localhost:3000] and you will see a microfrontend application hosted on localhost:1234 being loaded onto the page.

Your local development is almost the same as if you were developing a web app with React and typscript. Go to `src/App.tsx` to make changes.

## How it works

In order to develop locally, the root of a dulo application is split into two primary directories: `src` and `host`.

The `src` directory is where your micro frontend application code will reside. The only requirement for the `src` directory is that there is a file that defines the entry level function(s) to your micro frontend(s).

In the `host` directory there needs to be at least one html file that is loading the artifact from the local development server and rendering it on the page. Dulo is configured out of the box that it will serve all files in the `host` directory if you run `yarn dev`. If you are defining multiple micro frontends from one artifact, you could create one html file per entry level function if that makes local development easier for you.

