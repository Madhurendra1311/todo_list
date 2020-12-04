import { Route, BrowserRouter, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./Component/Login"
import TodoList from './Component/TodoList';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>    
          <Route exact path="/" render={() => <Login />} />
          <Route path="/todolist" render={()=> <TodoList />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
