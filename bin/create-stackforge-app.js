#!/usr/bin/env node

const path = require('path');

const distPath = path.join(__dirname, '..', 'dist', 'src', 'index.js');

require(distPath);
