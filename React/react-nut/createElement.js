import ReactComponent from "react"
const RESERVED_PROPS = {
  key: true,
  ref: true,
  _self: true,
  _source: true,
}
const ReactCurrentOwner = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null,
  };
  
export function creatElement(type,config,...children){
    let propName;

    //Reserved names are extracted
    const props={}

    //第一段
    /**
     * 可以看到在 createElement 函数内部，key、ref、__self、__source 
     * 这四个参数是单独获取并处理的，key 和 ref 很好理解，__self 和 __source 是做什么用的呢？
     * 通过这个 issue，我们了解到，__self 和 __source 是 babel-preset-react注入的调试信息，
     * 可以提供更有用的错误信息。
     */
    let key = ''+config.key
    let ref = config.ref
    let self = config._self
    let source = config._source

    //第二段
    /**
     * 这段代码实现的功能很简单，就是构建一个 props 对象，去除传入的 key、ref、__self、__source属性，
     * 这就是为什么在组件中，我们明明传入了 key 和ref，但我们无法通过 this.props.key 
     * 或者 this.props.ref 来获取传入的值，就是因为在这里被去除掉了。
     */
    for(propName in config){
        if(config.hasOwnProperty(propName)&&!RESERVED_PROPS.hasOwnProperty(propName)){
            props[propName]=config[propName]
        }
    }

    //第三段
    props.children = children

    //第四段
    if(type&&type.defaultProps){
        const defaultProps = type.defaultProps
        for(propName in defaultProps){
            if(props[propName]===undefined){
                props[propName] = defaultProps[propName]
            }
        }
    }

    //第五段
    return ReactElement(
        type,key,ref,self,source,ReactCurrentOwner.current,props,
    );


    //createElement 函数主要是做了一个预处理，
    // 然后将处理好的数据传入 ReactElement 函数中
}

const ReactElement = function(type, key, ref, self, source, owner, props) {
    const element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,
  
      // Built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,
  
      // Record the component responsible for creating this element.
      _owner: owner,
    };
  
    return element;
  };
