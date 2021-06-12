import { defineReactive } from './utils';
/*
 * @desc:
 */
const sourceObj = {
  name: 'lixingjuan',
};

defineReactive(sourceObj, 'name');

console.log(sourceObj.name);
sourceObj.name = '1000';
console.log(sourceObj.name);
sourceObj.name = 'jhha';

document.querySelector('root').innerHTML = '<div>hahahha</div>';
// console.log(sourceObj.hahah)
