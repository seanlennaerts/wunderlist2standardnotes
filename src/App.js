import React, { Component } from 'react';
import './App.css';

var JSZip = require("jszip");

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.export = this.export.bind(this);
    this.unzip = this.unzip.bind(this);
    this.fileInput = React.createRef();

    this.state = { lists: [], titles: [], error: false };
  }

  export() {
    let sn = { items: [] };
    for (let i = 0; i < this.state.lists.length; i++) {
      if (this.state.titles[i]) {
        let list = this.state.lists[i];
        // start building standard notes json
        console.log('starting new list')
        sn.items.push(
          {
            created_at: new Date(list.createdAt),
            updated_at: this.getMostRecentDate(list.tasks),
            uuid: generateUUID(),
            content_type: "Note",
            content: {
              title: list.title,
              text: this.buildNote(list.tasks),
              references: [],
            }
          }
        );
      }
    }
    download('sn-import-file.txt', JSON.stringify(sn));
  }

  getMostRecentDate(tasks) {
    let latest = new Date(tasks[0].createdAt);
    for (let task of tasks) {
      let d = new Date(task.createdAt)
      if (d > latest) {
        console.log(`found more recent date: ${d}`)
        latest = d;
      }
    }
    return latest;
  }

  buildNote(tasks) {
    let note = '';
    for (let task of tasks) {
      if (!task.completed) {
        note = note + task.title + '\r\n\r\n';
      }
    }
    return note;
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ lists: [], titles: [], error: false });
    if (this.fileInput.current.files[0]) {
      this.unzip(this.fileInput.current.files[0]);
    }
  }

  handleCheck(event) {
    let titles = this.state.titles;
    titles[parseInt(event.target.name)] = !titles[parseInt(event.target.name)];
    this.setState({ titles });
  }

  unzip(file) {
    JSZip.loadAsync(file)
      .then(zip => {
        if (!zip.files['Tasks.json']) {
          this.setState({
            error: true
          })
          return;
        }
        zip
          .file('Tasks.json')
          .async('string')
          .then(data => {
            let lists = JSON.parse(data.trim());
            let titles = [];
            for (let i = 0; i < lists.length; i++) {
              titles.push(true);
            }
            this.setState({ lists, titles });

          });
      });
  }

  showLists() {
    return (
      <div className="previewPane">
        <h3>Found the following lists:</h3>
        <p>Unselect any lists you don't want to export.</p>
        <div className="tasks">
          {this.buildLists()}
        </div>
      </div>

    )
  }

  count() {
    let count = 0;
    for (let t of this.state.titles) {
      if (t) count++
    }
    return count;
  }

  buildLists() {
    let listDivs = [];
    for (let i = 0; i < this.state.lists.length; i++) {
      let list = this.state.lists[i];
      listDivs.push(
        <div>
          <div className="listTitle">
            <input type="checkbox" name={i} checked={this.state.titles[i]} onChange={this.handleCheck} />
            {list.title}
          </div>
          <ul>
            {this.buildTasks(list.tasks)}
          </ul>
        </div>
      );
    }
    return listDivs;
  }

  buildTasks(tasks) {
    const limit = 5;
    let taskDivs = [];
    let filteredTasks = tasks.filter(task => !task.completed);
    for (let i = 0; i < limit && i < filteredTasks.length; i++) {
      taskDivs.push(
        <li>{tasks[i].title}</li>
      );
    }
    if (filteredTasks.length > limit) {
      taskDivs.push(<li>{`...${filteredTasks.length - limit} more`}</li>)
    }
    return taskDivs;
  }

  showInstructions() {
    return (
      <div className="instructionWrapper">
        <h3>Instructions</h3>
        <div className="instructions">
          <ol>
            <li>
              <p>Go to <a href="https://www.wunderlist.com" target="_blank" rel="noopener noreferrer">wunderlist.com</a></p>
            </li>
            <li>
              <p>Click on your name and then <b>Account Settings</b></p>
              <img src="/1.png" />
            </li>
            <li>
              <p>In the <b>Account</b> tab click <b>Create Export</b></p>
              <img src="/2.png" />
            </li>
            <li>
              <p>Enter your email address so they can send you your Wunderlist data</p>
              <img src="/3.png" />
            </li>
            <li>
              <p>Wait for the email to arrive (should take a few minutes). When you get the email follow the link to download you wunderlist .zip file</p>
            </li>
            <li>
              <p>Upload the .zip file here:</p>
              <input type="file" accept=".zip" ref={this.fileInput} onChange={this.handleSubmit} />
            </li>
            <li>
              <p>Preview the lists to the right and unselect and of the lists you don't want to migrate</p>
            </li>
            <li>
              <p>Click on the blue <b>Export</b> button below. This should download a .txt file</p>
            </li>
            <li>
              <p>Now in Standard Notes, go to <b>Account</b> and click on <b>Import Backup</b></p>
              <img src="/4.png" />
            </li>
            <li>
              <p>That should be it! Let me know if anything breaks</p>
            </li>
          </ol>
        </div>
      </div>


    );
  }

  showExport() {
    return (
      <div className="export" onClick={this.export}>{`Export ${this.count()} lists`}</div>
    );
  }

  showError() {
    return (
      <div className="error">Couldn't use that file :(</div>
    )
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          <h1>Wunderlist <span role="img" aria-label="right arrow">➡️</span> Standard Notes</h1>
        </div>
        <div className="body">
          {this.state.error ? this.showError() : null}
          <div className="columns">
            {this.showInstructions()}
            {this.state.lists.length > 0 ? this.showLists() : null}
          </div>
        </div>
        {this.count() > 0 ? this.showExport() : null}
      </div>
    );
  }
}

// ============== helpers ====================

// Taken from https://github.com/standardnotes/sntools/blob/master/lib/sntools.js#L3
function generateUUID() {
  var crypto = window.crypto || window.msCrypto;
  if (crypto) {
    var buf = new Uint32Array(4);
    crypto.getRandomValues(buf);
    var idx = -1;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      idx++;
      var r = (buf[idx >> 3] >> ((idx % 8) * 4)) & 15;
      var v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  } else {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


export default App;
