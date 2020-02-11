import React, { Component } from "react";
import TodoItems from "./TodoItems";
import "./css/index.css";
import $ from "jquery";

class TodoList extends Component {
  componentWillMount() {
    //rendering 되기 전에 서버 접속
    $.get("http://localhost:8080/", returnData => {
      console.log(returnData.message);
    });
  }

  state = {
    items: []
  };

  addItem = e => {
    e.preventDefault();
    const send_param = {
      //this.state.items.unshift 내 배열에 넣겠다는게 아니라 서버쪽에 배열을 보내겠다
      text: this.inputElement.value,
      key: Date.now()
    };
    $.post("http://localhost:8080/item/add", send_param, returnData => {
      if (returnData.message) {
        this.state.items.unshift(send_param);
        this.setState({
          items: this.state.items
        });
      } else {
        alert("일정 추가 오류");
      }

      this.inputElement.value = "";
      this.inputElement.focus();
    });
  };

  deleteItem = key => {
    const send_param = {
      key
    };
    $.post("http://localhost:8080/item/delete", send_param, returnData => {
      if (returnData.message) {
        const filteredItems = this.state.items.filter(item => {
          return item.key !== key;
        });
        this.setState({
          items: filteredItems
        });
      } else {
        alert("일정 삭제 오류");
      }
    });
  };

  render() {
    return (
      <div id="todoListMain">
        <div id="header">
          <input
            ref={ref => (this.inputElement = ref)}
            placeholder="Enter a task"
          ></input>
          <button onClick={this.addItem}>Add</button>
        </div>
        <TodoItems entries={this.state.items} superDelete={this.deleteItem} />
      </div>
    );
  }
}

export default TodoList;
