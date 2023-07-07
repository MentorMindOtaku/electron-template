#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import createDirectoryContents from './createDirectoryContents.js';

const CURR_DIR = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));
const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const capitalizedChoices = CHOICES.map((choice) => {
  const words = choice.split('-');
  const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords.join(' ');
});

const QUESTIONS = [
  {
    name: 'project-choice',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: capitalizedChoices,
  },
  {
    name: 'project-name',
    type: 'input',
    message: 'Project name:',
    validate: function(input) {
      return /^([A-Za-z\-\\_\d])+$/.test(input) ? true : 'Project name may only include letters, numbers, underscores, and hashes.';
    },
  },
];

inquirer.prompt(QUESTIONS).then((answers) => {
  const projectChoice = CHOICES[capitalizedChoices.indexOf(answers['project-choice'])];
  const projectName = answers['project-name'];
  const templatePath = `${__dirname}/templates/${projectChoice}`;

  fs.mkdirSync(`${CURR_DIR}/${projectName}`);
  createDirectoryContents(templatePath, projectName);
});
