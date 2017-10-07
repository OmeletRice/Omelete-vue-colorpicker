import Vue from 'vue'
// import _ from 'lodash'
const isServer = Vue.prototype.$isServer

/* istanbul ignore next */
const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
};

export const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

export const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

export const once = function (el, event, fn) {
  var listener = function () {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};

export function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
};

export function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

export function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};

const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const ieVersion = isServer ? 0 : Number(document.documentMode);

const camelCase = function (name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};

export const getStyle = ieVersion < 9 ? function (element, styleName) {
  if (isServer) return;
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'styleFloat';
  }
  try {
    switch (styleName) {
      case 'opacity':
        try {
          return element.filters.item('alpha').opacity / 100;
        } catch (e) {
          return 1.0;
        }
      default:
        return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null);
    }
  } catch (e) {
    return element.style[styleName];
  }
} : function (element, styleName) {
  if (isServer) return;
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'cssFloat';
  }
  try {
    var computed = document.defaultView.getComputedStyle(element, '');
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    return element.style[styleName];
  }
};

/**
 * change style value
 * @param {String} styles Style...toStirng()
 * @param {String} content Repalce element string
 * @return {String} Changed element string
 */
// export function changeStrInlineStyle (styles, content) {
//   if (_.isString(styles)) {
//     let _content = content
//     const styleList = styles.split(';')
//     _.each(styleList, item => {
//       const [name, value] = item.split(':')
//       if (_content.indexOf(name) !== -1) {
//         const reg = new RegExp(`(${name}:(.*?);)+`, 'g')
//         _content = _content.replace(reg, `${name}: ${value};`)
//       } else {
//         const reg = new RegExp('((style="(.*?))")+', 'g')
//         _content = _content.replace(reg, `$2 ${name}: ${value};"`)
//       }
//     })
//     return _content
//   }
// }

/**
 * insertRule
 * @param {Element} el <style> tag to appendChild
 * @param {String} selector Style
 */
// 判断 是否有 存在的 style 标签
// 已有 style
//  遍历 style 中的 sheet.cssRules 取出 selectorText
//    判断 新插入的 style.selector === selectorText
//     如果 有,  插入 rule
//     如果 没有
// 替换 值  style.sheet.cssRules[n].

// 没有 style

// export function insertStyleTag (el, selector, ) {

//   // el
//   // { selector: '#mce_0_style', rules: "color: #fff; font-size: 12px;", index: idx }
//   const style = document.createElement('style')
//   const style_id = `${this.editorId}_style`
//   style.setAttribute('id', style_id)
//   style.type = 'text/css';
//   if (el.children[style_id]) {
//     el.children[style_id].remove()
//   }
//   el.appendChild(style);
//   const sheet = style.sheet || style.styleSheet

//   const selector = `#${this.editorId} a`

//   const rules = `color: ${color};`

//   const index = 0

//   if (sheet.insertRule) {
//     sheet.insertRule(selector + '{' + rules + '}', index);
//   } else if (sheet.addRule) {
//     sheet.addRule(selector, rules, index);
//   }
// }
