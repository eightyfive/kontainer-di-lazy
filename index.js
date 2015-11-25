'use strict';

const path = require('path');

const Di = module.exports = function(kontainer, resolveFrom) {
  this.kontainer = kontainer;
  this.root = resolveFrom;

  // Sugar
  this.set('@', kontainer);
};

Di.prototype = {
  get: function(key) {
    const _modules = this.kontainer.modules;

    if (!_modules[key]) {
      const mod = require(path.resolve(this.root, key));
      const deps = mod['@inject'] || [];

      // Lazy-load dependencies
      deps.forEach(dep => {
        if (!_modules[dep]) {
          this.get(dep);
        }
      }, this);

      this.set(key, deps, mod);
    }

    return this.kontainer.get(key);
  },

  set: function(key, deps, val) {
    const _val = arguments.length === 2 ? deps : val;
    const _deps = arguments.length === 2 ? [] : deps;

    this.kontainer.register(key, _deps, _val);
  },
};
