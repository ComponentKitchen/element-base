import ElementBase from '../src/ElementBase';


/* Element with a simple template */
class ElementWithStringTemplate extends ElementBase {
  get template() {
    return "Hello";
  }
}
document.registerElement('element-with-string-template', ElementWithStringTemplate);


/* Element with a real template */
let template = document.createElement('template');
template.content.textContent = "Hello";
class ElementWithRealTemplate extends ElementBase {
  get template() {
    return template;
  }
}
document.registerElement('element-with-real-template', ElementWithRealTemplate);


/* Element created via ES5-compatible .compose() */
let Es5ClassViaExtend = ElementBase.compose({
  get customProperty() {
    return 'property';
  },
  method: function() {
    return 'method';
  },
  value: 'value'
});
document.registerElement('es5-class-via-extend', Es5ClassViaExtend);


/* Element with camelCase property name */
class ElementWithCamelCaseProperty extends ElementBase {
  get customProperty() {
    return this._customProperty;
  }
  set customProperty(value) {
    this._customProperty = value;
  }
}
document.registerElement('element-with-camel-case-property', ElementWithCamelCaseProperty);


/* Mixin that defines a createdCallback method. */
class CreatedMixin {
  createdCallback() {
    this.mixinCallbackInvoked = true;
  }
}
class ElementWithCreatedMixin extends ElementBase {
  get template() {
    return "Hello";
  }
}
ElementWithCreatedMixin = ElementWithCreatedMixin.compose(CreatedMixin);
document.registerElement('element-with-created-mixin', ElementWithCreatedMixin);
