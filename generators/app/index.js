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
            choices: ['package', 'express', 'restify'], //Add express and restify later
            message: 'What type of application are you building?'
        }]);
        this.props.name = props.name;
        this.props.description = props.description;
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
        this.npmInstall([
            'dotenv'
        ], { 'save': true });
        this.npmInstall([
            '@istanbuljs/nyc-config-typescript',
            '@types/dotenv',
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
            'typescript'
        ], { 'save-dev': true });
    }
    end() {
        this.log('All done! Happy coding!');
    }
};
