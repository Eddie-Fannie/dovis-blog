# 5. React实战
## 第一部分 初识React
### 第二章 <Hello World />: 我们的第一个组件
1. 创建`React`元素
```js
ReactDOM.render( ReactElement element, DOMElement container, [function callback]) -> ReactComponent
```
`React DOM`需要一个`ReactElement`类型的元素和一个`DOM`元素。我们已经创建了一个能够使用的有效`DOM`元素，现在需要创建一个`React`元素。

::: tip
定义React元素是React中轻量，无状态，不可变的基础类型。`React`元素有`ReactComponent-Element`和`ReactDOMElement`两种类型。`ReactDOMElement`是`DOM`元素的虚拟表示。`ReactComponentElement`引用了对应着`React`组件的一个函数或类。
:::

`React.createElement`被用来创建`React`元素——想到了吧！让我们看看它的函数签名，了解应该如何使用它!

```js
React.createElement(String/ReactClass type, [object props], [children...]) -> React Element
```

::: tip
`React.createElement`接收字符串或组件（要么是扩展了`React.Component`的类，要么是一个函数）、属性（`props`）对象和子元素集合（`children`）并返回一个`React`元素。记住，`React`元素是你想让`React`渲染的东西的轻量级表示。它可以表示一个`DOM`元素或者另一个`React`组件。

基本指令：
- `type`——可以传入一个表示要创建的`HTML`元素标签名的字符串（`"div"、"span"、"a"`等）或一个`React`类
- `props——properties`（属性）的缩写。`props`对象提供了一种方法，指定`HTML`元素上会定义哪些属性（如果是在`ReactDOMElement`的上下文中）或组件类的实例可以使用哪些属性。
- `children…` ——还记得我是怎么说`React`组件是可组合的吗？这就是能够进行组合的所在。`children…`是`type`和`props`之后传入的所有参数，它让使用者能够进行嵌套、排序，甚至进一步嵌套其他`React`元素。
:::

```js
import React from "react";
import { render } from "react-dom";
const node = document.getElementById("root");

const root = React.createElement(
  "div",
  {},
  React.createElement(
    "h1",
    {},
    "Hello, world!",
    React.createElement(
      "a",
      { href: "mailto:mark@ifelse.io" },
      React.createElement("h1", {}, "React In Action"),
      React.createElement("em", {}, "...and now it really is!")
    )
  )
);
render(root, node);
```
> 现在使用嵌套可以更好地理解`React.createElement`做了什么，并且在开始大量使用`React.createElement`时，使用嵌套可能有助于你欣赏`JSX`。

2. 创建`React`组件
> 我们可以使用函数和`JavaScript`类创建两种基本类型的组件。

3. 创建`React`类
```js
class MyReactClassComponent extends Component {
  render() {

  }
}
```
> `React.Component`创建组件是通过声明一个继承自`React.Component`抽象基类的`JavaScript`类来实现的。这个继承类通常需要至少定义一个`render`方法，这个`render`方法会返回单个`React`元素或是一个`React`元素的数组。`render`方法需要只返回一个`React`元素。从这一点看来，`render`方法与`React`元素的创建方法相似——它们可以嵌套但最高层只有一个节点。然而，与`React`元素不同的是，`React`类的`render`方法可以访问内嵌数据（持久化的内部组件状态），以及组件方法和继承自`React.Component`抽象基类的其他方法。

4. `React`的状态
`React`中，那些通过扩展`React.Component`并作为`JavaScript`类创建的组件可能既有可变状态也有不可变状态，而基于函数创建的组件（无状态函数组件）则只能访问不可变状态（属性）。

::: tip
那些继承自`React.Component`的组件，可以通过类实例的`this.state`属性访问可变状态。而不可变状态则是通过`this.props`进行访问的。

`this.setState`接收一个用来更新状态的更新器函数，而且`this.setState`不返回任何东西

```js
setState( function(prevState, props) -> nextState, callback) -> void
```
> `this.setState`接收一个返回对象的更新器函数，该对象会与状态进行浅合并。事件与`React`如何协同工作？`React`实现了一个合成事件系统作为虚拟`DOM`的一部分，它会将浏览器中的事件转换为`React`应用的事件。可以设置响应浏览器事件的事件处理器，就像通常用`JavaScript`做的那样。一个区别是`React`的事件处理器是设置在`React`元素或组件自身之上的（而不是用`addEventListener`）。可以用来自这些事件（输入框的文本、单选按钮的值或事件的目标）的数据更新组件的状态。
:::

```js
class CreateComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      user: "林嘉恒"
    };
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleUserChange(event) {
    const val = event.target.value;
    this.setState((prevState, props) => ({
      user: val
    }));
  }
  handleTextChange(event) {
    const val = event.target.value;
    this.setState({
      content: val
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState(() => ({
      user: "",
      content: ""
    }));
  }
  render() {
    return React.createElement(
      "form",
      {
        className: "createComment",
        onSubmit: this.handleSubmit
      },
      React.createElement("input", {
        type: "text",
        placeholder: "Your name",
        value: this.state.user,
        onChange: this.handleUserChange
      }),
      React.createElement("input", {
        type: "text",
        placeholder: "Thoughts?",
        value: this.state.content,
        onChange: this.handleTextChange
      }),
      React.createElement("input", {
        type: "submit",
        value: "Post"
      })
    );
  }
}
```
> **如果定义了一个组件方法而它却不工作，你需要确定已经正确地绑定了方法**

```js
// 一个对属性进行验证，更新状态并能够添加新评论的组件：

import React, { Component } from "react";
import { render } from "react-dom";
import PropTypes from "prop-types";

const node = document.getElementById("root");

const data = {
  post: {
    id: 123,
    content:
      "What we hope ever to do with ease, we must first learn to do with diligence. — Samuel Johnson",
    user: "Mark Thomas"
  },
  comments: [
    {
      id: 0,
      user: "David",
      content: "such. win."
    },
    {
      id: 1,
      user: "Haley",
      content: "Love it."
    },
    {
      id: 2,
      user: "Peter",
      content: "Who was Samuel Johnson?"
    },
    {
      id: 3,
      user: "Mitchell",
      content: "@Peter get off Letters and do your homework"
    },
    {
      id: 4,
      user: "Peter",
      content: "@mitchell ok :P"
    }
  ]
};

class Post extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return React.createElement(
      "div",
      {
        className: "post"
      },
      React.createElement(
        "h2",
        {
          className: "postAuthor",
          id: this.props.id
        },
        this.props.user,
        React.createElement(
          "span",
          {
            className: "postBody"
          },
          this.props.content
        ),
        this.props.children
      )
    );
  }
}

Post.propTypes = {
  user: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired
};

class Comment extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return React.createElement(
      "div",
      {
        className: "comment"
      },
      React.createElement(
        "h2",
        {
          className: "commentAuthor"
        },
        this.props.user,
        React.createElement(
          "span",
          {
            className: "commentContent"
          },
          this.props.content
        )
      )
    );
  }
}

Comment.propTypes = {
  id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired
};

class CreateComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      user: ""
    };
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleUserChange(event) {
    const val = event.target.value;
    this.setState(() => ({
      user: val
    }));
  }
  handleTextChange(event) {
    const val = event.target.value;
    this.setState({
      content: val
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.props.onCommentSubmit({
      user: this.state.user.trim(),
      content: this.state.content.trim()
    });

    this.setState(() => ({
      user: "",
      content: ""
    }));
  }
  render() {
    return React.createElement(
      "form",
      {
        className: "createComment",
        onSubmit: this.handleSubmit
      },
      React.createElement("input", {
        type: "text",
        placeholder: "Your name",
        value: this.state.user,
        onChange: this.handleUserChange
      }),
      React.createElement("input", {
        type: "text",
        placeholder: "Thoughts?",
        value: this.state.content,
        onChange: this.handleTextChange
      }),
      React.createElement("input", {
        type: "submit",
        value: "Post"
      })
    );
  }
}
CreateComment.propTypes = {
  onCommentSubmit: PropTypes.func.isRequired,
  content: PropTypes.string
};

class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: this.props.comments
    };
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
  }
  handleCommentSubmit(comment) {
    const comments = this.state.comments;
    comment.id = Date.now();
    const newComments = comments.concat([comment]);
    this.setState({
      comments: newComments
    });
  }
  render() {
    return React.createElement(
      "div",
      {
        className: "commentBox"
      },
      React.createElement(Post, {
        id: this.props.post.id,
        content: this.props.post.content,
        user: this.props.post.user
      }),
      this.state.comments.map(function(comment) {
        return React.createElement(Comment, {
          key: comment.id,
          id: comment.id,
          content: comment.content,
          user: comment.user
        });
      }),
      React.createElement(CreateComment, {
        onCommentSubmit: this.handleCommentSubmit
      })
    );
  }
}

CommentBox.propTypes = {
  post: PropTypes.object,
  comments: PropTypes.arrayOf(PropTypes.object)
};

render(
  React.createElement(CommentBox, {
    comments: data.comments,
    post: data.post
  }),
  node
);
```

5. `jsx`创建组件
上面创建组件的方式用`jsx`来重构：
```js
// Post组件
class Post extends Component {
  render() {
    return (
      <div className="post">
        <h2 className="postAuthor">{this.props.user}</h2>
        <span className="postBody">{this.props.content}</span>
        {this.props.children}
      </div>
    );
  }
}

// Comment组件
class Comment extends Component {
  render() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">{this.props.user + " : "}</h2>
        <span className="commentContent">{this.props.content}</span>
      </div>
    );
  }
}

class CreateComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      user: ""
    };
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleUserChange(event) {
    this.setState({
      user: event.target.value
    });
  }
  handleTextChange(event) {
    this.setState({
      content: event.target.value
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.props.onCommentSubmit({
      user: this.state.user.trim(),
      content: this.state.content.trim()
    });
    this.setState({
      user: "",
      content: ""
    });
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit} className="createComment">
        <input
          value={this.state.user}
          onChange={this.handleUserChange}
          placeholder="Your name"
          type="text"
        />
        <input
          value={this.state.content}
          onChange={this.handleTextChange}
          placeholder="Thoughts?"
          type="text"
        />
        <button type="submit">Post</button>
      </form>
    );
  }
}

class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: this.props.comments
    };
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
  }
  handleCommentSubmit(comment) {
    const comments = this.state.comments;
    comment.id = Date.now();
    const newComments = comments.concat([comment]);
    this.setState({
      comments: newComments
    });
  }
  render() {
    return (
      <div className="commentBox">
        <Post
          id={this.props.post.id}
          content={this.props.post.content}
          user={this.props.post.user}
        />
        {this.state.comments.map(function(comment) {
          return (
            <Comment
              key={comment.id}
              content={comment.content}
              user={comment.user}
            />
          );
        })}
        <CreateComment onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
}

// 绑定到node节点下
render(<CommentBox comments={data.comments} post={data.post} />, node);
```