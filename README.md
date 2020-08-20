# Yeoman Bootstrapper

Node.JS project generator based on Quiet Math project templates. This is open source, but you'll likely never use it. It's pretty specific to Quiet Math developer flow.

## Installation

Do you have Yeoman installed?

```powershell
npm install yo -g
```

Now install the generator globally:

```powershell
npm install @quietmath/generator-yo-bootstrapper -g
```

## Usage

Since this is a scoped package, usage is a little different:

```powershell
yo @quietmath/yo-bootstrapper
```

You'll want to answer the prompted questions about:

* Application name
* Application description
* Your name
* Your email
* The repository name (essentially assumes a GitHub repo here)
* Technology stack (Node.JS is the only current option)
* Type of application (library package, ExpressJS web application, or Restify API)

Once complete, the generator will bootstrap your folder with common configuration files, and will install some default NPM packages.
