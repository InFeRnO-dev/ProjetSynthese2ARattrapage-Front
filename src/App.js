import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Admin from "./pages/admin";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Client from "./pages/client/client";
import AjouterClient from "./pages/client/ajouterClient";
import DetailClient from "./pages/client/detailClient";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/client/ajouter" component={AjouterClient}/>
        <Route path="/client/:id_client" component={DetailClient}/>
        <Route path="/client" component={Client}/>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
        <Route component={Admin} path="/admin"/>
        <Route component={Home} path="/"/>
      </Switch>
    </Router>
    
  );
}

export default App;