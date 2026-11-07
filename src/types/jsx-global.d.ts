import type {JSX as ReactJSX} from 'react';

// React 19's types removed the global JSX namespace, but react-markdown 8 still
// reads it from its own source. Remove this once react-markdown is upgraded.
declare global {
    namespace JSX {
        type Element = ReactJSX.Element;
        type ElementClass = ReactJSX.ElementClass;
        type ElementAttributesProperty = ReactJSX.ElementAttributesProperty;
        type ElementChildrenAttribute = ReactJSX.ElementChildrenAttribute;
        type IntrinsicAttributes = ReactJSX.IntrinsicAttributes;
        type IntrinsicClassAttributes<T> = ReactJSX.IntrinsicClassAttributes<T>;
        type IntrinsicElements = ReactJSX.IntrinsicElements;
    }
}
