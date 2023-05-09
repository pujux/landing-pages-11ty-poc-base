# Travel Insurance for A1 via Lamie  

Setting up this project should be fairly easy. Should you run into issues regarding the install, check to see if you are on node 16, as 17 is known to have some issues.

## Architecture

This project yields a set of static websites that are intended to be deployed as is. Each website contains a form rendered with clientside JavaScript. Two main Technologies are important to achieve this: Eleventy and Svelte. All source files are contained in `src/`.

***

### Eleventy

Eleventy is a true static site generator. Its main concern is creating static files from templates. Its main entry file is `eleventy.config.js` and its output is `site/`.

### Svelte
 
Svelte is an approach to write reactive JavaScript that utilises a compiler in order to only ship what code is necessary. Though svelte uses rollup to compile, we're using the much faster and more modern vite to achieve the same. We're also providing TypeScript support, if needed. In order to use TypesScript in a Svelte component, just use `lang="ts"` in the component's start script tag.

***

### How things are coming together

While eleventy is concerned with building the site, the actual files, svelte is only concerned with that one simple part in the website. Vite asserts a lot of control because modern JavaScript tooling asserts that all is done in JavaScript and not just part of it. For that reason, a two-step process is required:

1. Build the Static Site (Eleventy)
2. Build the JavaScript (Vite/Svelte)

Which means that there are two build destinations, one for eleventy one for vite/svelte. They can be configured in `eleventy.config.js` and `vite.config.json` respectively.

#### CSS

The main CSS is written as SCSS in `src/_scss`. In order to also import and use SCSS code from within svelte, we're using eleventy to also copy the scss code into vite's `public` folder, via `addPassthroughCopy()` from the `eleventy.config.js` config file. Svelte itself offers component scoping CSS, which also supports SCSS as a language attribute. Styling is done in both areas. Global where global is appropriate, component level where it is appropriate.

##### Typescript

Typescript is also part of this. It is also handled by vite. In order for the IDE to resolve everything correctly though, it needs to know where the files live. For that reason, **changing the output destinations will also require changing the typescript config.** Consult the config itself for this - should be very straightforward.

Typescript processing for svelte is happening as a svelte preprocess. This is enabled in the `svelte.config.json`, via the `preprocess` property. For this to work correctly though, vite needs to read this file. For that reason, the plugin that marries svelte and vite, `vite-plugin-svelte`, needs to be told where to look for, for the `svelte.config.json`. By default, it will always look for it in the vite-cofigured root (in our case, that is the eleventy output directory, so `site/`). It is configured to look in the root of the project instead. It was either that, or telling eleventy to add a copy of this file via `addPassthroughCopy()`.

#### Development

In development, the eleventy build server and vite are started in parallel. This works well enough:

```bash
$ npm run dev
```

The site is (usually) served from `localhost:3000`. Vite looks into the files in `site/`. So should you encounter issues, make sure that the output matches what you are writing.

There is one downside in this setup, which is that changes will trigger a complete reload of the site instead of just injecting the changes, as usually happens. Though vite and eleventy are very quick, it will destroy whatever state the UI shows, once saving happens. 

#### Production

In production, eleventy first builds the site, then vite builds the site into `dist/`:

```bash
$ npm run build
```

Vite doesn't really like some of the realities of this project, but it can be configured to work well. For this, take a look into the `vite.config.js`, where these decisions are documented well. TLDR, vite expects a single .html file to be an entry point, because it assumes that your output is an SPA, which, in our case, it isn't.

***

## Content & Config

We're utilizing eleventy's Data Cascade to bring data together. Please [read up on the topic](https://www.youtube.com/watch?v=Nv5i_nuZOqw) if you are not familiar with the concept of Cascades. In order to achieve what we want to achieve, we're heavily using directory data files. Data that is written there will be part of the entire directory's data cascade. For example, `serbia.11tydata.js` provides data that is available to everything inside the folder `/serbia`.

### Countries & Languages

Every country is its own folder in `src/content`. Every language is its own route and lives in folders as well `serbia/en`. Languages are extended in the cascade in a country context. Unused languages are being unset, and used languages receive an additional `dir` field, that contains information about their route. This is also how you set a default language, by setting its `dir` to the country. In each language respectively, that data is then used to set all sorts of data, related to routing and paths. Most of this should be very self-explanatory.

### Product Config

Generally, Product Config should happen on the country level, but it _can_ be overridden on a language level. That way, the config system could be utilized to provide country & language specific content, for example, translated content. But it will not use the translation system and it needs to be maintained in a deep layer. Plus, content that is translated via the config system is doing so on a deep layer of the data cascade.

#### Changing the Config

Product Config is confined to the country level. That means that you cannot make language specific changes. As in, you want one flag to be true for serbia/en, and false for serbia/sr - that is not possible.

The product config is located in `src/content/austria/austria.11tydata.js` (or `/serbia/`, `croatia`, etc.). In this directory data file, there is a json with a field called `configData`. This is where you can add and change configurations that are cascading down to the svelte code via `getSetting()`.

### Translations

All Translations are global and use a default language. We're using a custom filter to access strings from each language's translation file in `translations`. If a string is not found, it will fall back to the string itself. 

Svelte is also reading these files and providing it to the application with a function that can be accessed from a Svelte Context. It behaves identically to the eleventy filter function and will fallback to whatever string was passed. And, different from the eleventy filter, the function already uses whatever language is on the site, as this information is already available at the point where svelte comes into action. This process should be self-explanatory as well, by looking into `src/_svelte/main.ts`.

#### Replacing computed values in translations, with the `$n` syntax

Translation keys that contain strings like `$n1`, `$n2`, etc. refer to computed values that will be replaced. This is necessary when a translated text contains values that are contextual, country-specific, subject to configuration or even dependend on UI state - dynamic in that sense, that at the time of writing the message, the value cannot be static. For example, this message:

```
You can add 3 more adults, with a maximum of 5 additional adults.
```

This hypothetical message is subject to configuration and it is also subject to UI state. In order to make this message usable, we replace the values with `$n1` and `$n2`:

```
You can add $n1 more adults, with a maximum of $n2 additional adults.
```

#### Translations vs localized content

In addition to the global translation system, we've also architected some of the content to be localized from within eleventy itself. This system is only available to the static-generated part of the website, because it is generated by eleventy - though you certainly could utilize it to also make it available to svelte.

There are three main pieces of content that are currently subject to this:

+ faq's
+ why's
+ features

#### Adding & Updating FAQs, why's, and features

Within a country, in a language subdirectory (for example `src/content/serbia/en`), you can create three directories for each piece of content, `faq/`, `why/`, and `features/` respectively. You don't have to name them like that, but it certainly is easier that way.

Then, make sure you create a directory data file. It has to have the same name of the directory, so if you have called your folder `faq`, create a file named `faq.11tydata.js` inside the directory. If you have named it differently, make sure you change the name of the file too.

Whatever data you provide via this directory file will add it to the cascade and all its deeper children. Meaning, that if you create another file within this directory or any of its subdirectory, it'll have whatever data set in this file as well, by default. We're gonna utilize this behaviour by adding the necessary `tag` it needs to recognize this content as a collection and render it correctly:

```javascript
module.exports = {
    permalink: false,
    tags: ['faq']
}
```
The tag needs to be exactly `faq`, `feature` or `why`, otherwise it'll not become part of these collections and won't appear in the rendered result. `permalink: false` makes sure, that eleventy doesn't create a html file for this piece of content.

This is all that is needed to make sure that the collections are filled with the correct content. In there, write the content in the language you are in. If you are in `/en/`, write it in English, if you are in `/sr/`, write it in Serbian, etc. The text in there is not part of the global translation system. This allows you to have different content for each language and each country respectively.

##### `faq`

This is the simplest piece of content. They are unordered and they consist of a single data point `question` and just content. It's simplest to just create `.md` files for each question and answer.

Each file needs to contain yaml front matter like this:

```yaml
---
question: What do you call a drowing canatalope?
---
```

Everything after the front matter end, so the `---` can be valid markdown. For that reason, it can also be just regular HTML. And you can even access data from the data cascade with the default liquid templating syntax `{{ data }}`.

##### `why`

This piece of content is ordered, meaning that in addition to its content, you can also control the order it appears in with front matter.

Each file needs to contain yaml front matter like this:

```yaml
---
icon: 'link-to-svg-file.svg'
order: 2
headline: Some Headline about something
description: Cotton candy marzipan chocolate cake liquorice jelly-o tiramisu chocolate cake. Cake gummi bears croissant tart candy topping cookie marzipan brownie.
---
```

The `icon` will inline svg code, found in `src/assets/why-icons/`. So whatever path you write in there, is gonna resolve relative to this directory. Eleventy will also inline the svg code, so you _have_ to use an svg here.

Files don't necessarily have to me markdown files, as they have no content - or as their content is never displayed. But markdown seemed to be the most natural. It just needs to add the given data into the cascade from the front matter. It could certainly also be just json, if you preferred that, but eleventy will consider `.md` files as content by default. If you use a different format, you have to configure eleventy to consider it as content in `eleventy.config.js`.

##### `feature`

Features are a bit more complex. They are grouped by subdirectories, "Categories", by which they are then being grouped and displayed.

They are following the same principle, though documenting the complexity would be a bit out of scope here. Look for the current implementation in `src/content/serbia/en/features/` to get a starting point.
