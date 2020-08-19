/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
//@ts-check

const Generator = require('yeoman-generator');
const fs = require('fs-extra');

module.exports = class extends Generator {
    initializing() {
        this.log(`Let's generate a Node.JS application!`);
        this.props = {};
        this.pkgs = {
            defaultPkgs: [
                'dotenv'
            ],
            expPkgs: [
                'body-parser',
                'cookie-parser',
                'cookie-session',
                'cors',
                'express',
                'express-handlebars',
                'feather-icons',
                'jsonwebtoken',
                'jwt-decode',
                'node-cache',
                'reflect-metadata',
                'typeorm',
            ],
            restPkgs: [
                'restify',
                'jsonwebtoken',
                'jwt-decode',
                'node-cache',
                'reflect-metadata',
                'typeorm'
            ],
            defaultDevPkgs: [
                '@istanbuljs/nyc-config-typescript',
                '@types/dotenv',
                '@types/mocha',
                '@types/node',
                '@typescript-eslint/eslint-plugin',
                '@typescript-eslint/parser',
                'eslint',
                'exorcist',
                'madge',
                'mocha',
                'nyc',
                'rewire',
                'ts-node',
                'typeorm-model-generator',
                'typescript'
                
            ],
            expDevPkgs: [
                '@types/body-parser',
                '@types/cookie-parser',
                '@types/cookie-session',
                '@types/cors',
                '@types/express',
                '@types/express-handlebars',
                '@types/feather-icons',
                '@types/jsonwebtoken',
                '@types/jwt-decode',
                '@types/node-cache',
                'browserify',
                'tsify'
            ],
            restDevPkgs: [
                '@types/restify',
                '@types/jsonwebtoken',
                '@types/jwt-decode',
                '@types/node-cache',
                'browserify',
                'tsify'
            ]
        };
    }
    async prompting() {
        const props = await this.prompt([{
            type: 'input',
            name: 'name',
            message: `What is your application's name?`
        },
        {
            type: 'input',
            name: 'description', 
            message: 'Please enter a description for your project:'
        },
        {
            type: 'input',
            name: 'fullname', 
            message: 'Please enter your name:'
        },
        {
            type: 'input',
            name: 'email', 
            message: 'Please enter your email address:'
        },
        {
            type: 'input',
            name: 'repo',
            message: 'Please enter the URL for the GitHub repository:'
        },
        {
            type: 'list',
            name: 'stack',
            choices: ['nodejs'],
            message: 'Which tech stack are you using?'
        },
        {
            type: 'list',
            name: 'app',
            choices: ['package', 'express web app', 'restify API'],
            message: 'What type of application are you building?'
        }]);
        this.props.name = props.name;
        this.props.description = props.description;
        this.props.fullname = props.fullname;
        this.props.email = props.email;
        this.props.repo = props.repo;
        this.props.stack = props.stack;
        this.props.app = props.app;
    }
    async configuring() {
        this.log('Started copying files...');
        try {
            await fs.copy(`${ this.sourceRoot() }`, `${ this.destinationRoot() }`);
            this.log('Finished copying template files.');
        }
        catch(e) {
            this.log(`An error has occurred copying the template files: ${ e }`);
        }
    }
    writing() {
        this.log('Writing package.json file...');
        const pkg = require('../../package.json');
        pkg.name = this.props.name;
        pkg.version = '0.1.0';
        pkg.description = this.props.description;
        pkg.dependencies = undefined;
        pkg.devDependencies = undefined;
        pkg.files = undefined;
        pkg.keywords = undefined;
        pkg.publishConfig = undefined;
        pkg.contributors = [ `${ this.props.fullname } <${ this.props.email }>` ];
        if(this.props.repo != null && this.props.repo.trim() != '') {
            pkg.repository = {
                "type": "git",
                "url": `git+${ this.props.repo }.git`
            };
            pkg.bugs = {
                "url": `${ this.props.repo }/issues`
            };
            pkg.homepage = `${ this.props.repo }#readme`;
        }
        else {
            pkg.repository = undefined;
            pkg.bugs = undefined;
            pkg.homepage = undefined;
        }
        pkg['scripts'] = {
            build: "tsc",
            test: "nyc mocha ./**/test/*.test.js --ignore ./**/node_modules/** --exit",
            eslint: "eslint ./src/*.ts ./src/**/*.ts",
            "eslint-fix": "eslint ./src/*.ts ./src/**/*.ts --fix",
        };
        this.fs.writeJSON(this.destinationPath('package.json'), pkg);
        this.log('Finished writing package.json file.');
    }
    install() {
        this.log('Installing NPM packages. Hang tight. This could take a few minutes.');
        const pkgs = this.pkgs.defaultPkgs;
        if(this.props.app === 'express web app') {
            pkgs.push(...this.pkgs.expPkgs);
        }
        if(this.props.app === 'restify API') {
            pkgs.push(...this.pkgs.restPkgs);
        }
        this.npmInstall(pkgs, { 'save': true });

        const devPkgs = this.pkgs.defaultDevPkgs;
        if(this.props.app === 'express web app') {
            devPkgs.push(...this.pkgs.expDevPkgs);
        }
        if(this.props.app === 'restify API') {
            devPkgs.push(...this.pkgs.restDevPkgs);
        }
        this.npmInstall(devPkgs, { 'save-dev': true });
    }
    end() {
        this.log('All done! Happy coding!');
    }
};
