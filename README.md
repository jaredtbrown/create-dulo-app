# Create Dulo App
A starter kit for creating modular micro frontends. It uses [Parcel](https://github.com/parcel-bundler/parcel) to bundle your app down to a single JavaScript file artifact that can be used by consumer applications to host your micro frontend. Dulo is very unopinionated and as extensible as Parcel is for building web applications.

If something doesn’t work, [please file an issue](https://github.com/jaredtbrown/create-dulo-app/issues).

If you have questions or need help, please ask in [GitHub Discussions](https://github.com/jaredtbrown/create-dulo-app/discussions).

## Getting Started
To get started with `create-dulo-app` you can run either of the following commands:

```
npx create-dulo-app
```

or
```
yarn create dulo-app
```

After answering the prompts, it will give you the scaffolding you need to start developing your micro frontend application.

## How It Works
Dulo currently supports building micro frontends using a runtime integration approach using window level JavaScript functions.

The micro frontend artifact defines an entry function on the window that host applications can use to render that micro frontend when needed. That global function requires only one parameter, the id of a dom element to bind that micro frontend to.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My Host application</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- This attaches the entry point to the micro frontend (renderApp) to the window -->
    <script src="https://example.com/index.js"></script>

    <script>
      renderApp('app')
    </script>
  </body>
</html>
```

The entry level function can also add additional params if a micro frontend needs to support additional configuration.

```javascript
// Entry level function
window.renderApp = (rootElementId, greeting) => {
  console.log(greeting)
}

...

// Consumer application
renderApp('app', 'Hello, World!');
```

In order to develop locally, the root of a dulo application is split into two primary directories: `src` and `host`.

The `src` directory is where your micro frontend application code will reside. The only requirement for the `src` directory is that there is a file that defines the entry level function(s) to your micro frontend(s).

In the `host` directory there needs to be at least one html file that is loading the artifact from the local development server and rendering it on the page. Dulo is configured out of the box that it will serve all files in the `host` directory if you run `yarn dev`. If you are defining multiple micro frontends from one artifact, you could create one html file per entry level function if that makes local development easier for you.

