import { Route, BrowserRouter as Router, Switch } from "react-router-dom"
import MyBooks from "./pages/MyBooks.page";
import SharedShelfs from "./pages/SharedShelfs.page";
import Shelfs from "./pages/Shelfs.page";
import Signin from "./pages/Signin.page";
import Signup from "./pages/Signup.page";

import './App.css';
import Sidebar from "./components/Sidebar.component";
import SearchHeader from "./components/SearchHeader.component";
import { useState } from "react";
import CurrentFileContext from "./tools/currentFileContext";
import FileViewer from "./pages/FileViewer.page";
import Explore from "./pages/Explore.page";

function App() {
  const [currentFile, setCurrentFile] = useState({
    currentFile: {
      // file blob
      file: null,
      // file information object
      fileInfo: null
    }
  });

  console.log(process.env.REACT_APP_SERVER_URL)

  return (
    <CurrentFileContext.Provider value={ {currentFile, setCurrentFile} }>
    <div className="App relative h-screen flex overflow-hidden bg-white">
      <Router>
        <Sidebar />
        <div className="flex flex-col w-0 flex-1 overflow-hidden ">
          {/* SearchHeader is mobile only */}
          {/* <SearchHeader />  */}

          {/* Router paths */}

          <Switch>
            <Route path="/" exact component={MyBooks} />
            <Route path="/signin" component={Signin} />
            <Route path="/signup" component={Signup} />
            <Route path="/mybooks" component={MyBooks} />
            <Route path="/shelfs" component={Shelfs} />
            <Route path="/sharedshelfs" component={SharedShelfs} />
            <Route path="/fileviewer" component={FileViewer} />
            <Route path="/explore" component={Explore} />
          </Switch>
        </div>
      </Router>
    </div>
    </CurrentFileContext.Provider>
  );
}

export default App;
