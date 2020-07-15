let input = document.querySelector(".todo");
let ul = document.querySelector(".list");
let left = document.querySelector(".itemsleft");
let all = document.querySelector(".all");
let completed = document.querySelector(".completed");
let active = document.querySelector(".active");
let clear = document.querySelector(".clear");

//Action Function

const action = (type, payload) => {
  return (obj = {
    type: type,
    payload: payload,
  });
};

//types
const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const DELETE_TODO = "DELETE_TODO";
const ALL_TODO = "ALL_TODO";
const ACTIVE_TODO = "ACTIVE_TODO";
const COMPLETED_TODO = "COMPLETED_TODO";

//Reducer Function

const INITIAL_STATE = {
  visibiltyfilter: "ALL_TODO",
  todos: [],
};

const todoReducer = (state = INITIAL_STATE, action) => {
  const { todos } = state;
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [
          ...todos,
          { text: action.payload, id: Date.now(), completed: false },
        ],
      };
    case DELETE_TODO:
      return {
        ...state,
        todos: todos.filter((todo) => todo.id !== parseInt(action.payload)),
      };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: todos.map((todo) => {
          if (todo.id == action.payload) {
            todo.completed = !todo.completed;
            return todo;
          }
          return todo;
        }),
      };
    case ALL_TODO:
      return {
        ...state,
        visibiltyfilter: ALL_TODO,
      };
    case ACTIVE_TODO:
      return {
        ...state,
        visibiltyfilter: ACTIVE_TODO,
      };

    case COMPLETED_TODO:
      return {
        ...state,
        visibiltyfilter: COMPLETED_TODO,
      };
    default:
      return state;
  }
};

//Create Store

const store = Redux.createStore(todoReducer);

//Add Todo

const addTodo = (e) => {
  if (e.keyCode === 13) {
    store.dispatch({ type: ADD_TODO, payload: input.value });
    e.target.value='';

  }
  
};

function activeTodo() {
  store.dispatch({ type: ACTIVE_TODO });
}
function allTodo() {
  store.dispatch({ type: ALL_TODO });
}
function completedTodo() {
  store.dispatch({ type: COMPLETED_TODO });
}

function handleEventOnlistitem(e) {
  // remove from the list
  if (e.target.tagName == "SPAN") {
    store.dispatch({ payload: e.target.parentElement.id, type: DELETE_TODO });
  } else if (e.target.localName == "input") {
    store.dispatch({ payload: e.target.parentElement.id, type: TOGGLE_TODO });
  }
}

function createUI() {
  const state = store.getState();
  const { todos, visibiltyfilter } = state;

  const allTodos = () => {
    switch (visibiltyfilter) {
      case ALL_TODO:
        return todos;
      case COMPLETED_TODO:
        return todos.filter((todo) => todo.completed);
      case ACTIVE_TODO:
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  };

  ul.innerHTML = "";
  allTodos().forEach((todo) => {
    var li = document.createElement("li");
    li.setAttribute("id", `${todo.id}`);
    li.addEventListener("click", handleEventOnlistitem);
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    var p = document.createElement("p");
    p.textContent = todo.text;
    var span = document.createElement("span");
    span.innerText = "X";
    li.append(checkbox, p, span);
    ul.append(li);
  });
}

//Event Listeners

input.addEventListener("keyup", addTodo);
active.addEventListener("click", activeTodo);
all.addEventListener("click", allTodo);
completed.addEventListener("click", completedTodo);

//Subscribe for listeners
store.subscribe(createUI);
