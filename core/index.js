import { optionsMixin, stateMixin, renderMixin } from './instance/index.js';

function MiniVue(options) {
  this._init(options);
  window.vm = this;
  console.log('cee', this.name);

  window.testThis = this;
}

optionsMixin(MiniVue);
stateMixin(MiniVue);
renderMixin(MiniVue);

export default MiniVue;
