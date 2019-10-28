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

    this.state = { lists: [], selected: [], error: '' };
  }

  export() {
    let sn = { items: [] };
    for (let i = 0; i < this.state.lists.length; i++) {
      if (this.state.selected[i]) {
        let list = this.state.lists[i];
        // start building standard notes json
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
    this.setState({ lists: [], selected: [], error: '' });
    this.unzip(this.fileInput.current.files[0])
      .then(o => this.setState(o))
      .catch(e => this.setState({error: e}));
  }

  handleCheck(event) {
    let selected = this.state.selected;
    selected[parseInt(event.target.name)] = !selected[parseInt(event.target.name)];
    this.setState({ selected });
  }

  unzip(file) {
    return new Promise((resolve, reject) => {
      JSZip.loadAsync(file)
        .then(zip => {
          if (!zip.files['Tasks.json']) {
            reject(`Couldn't use this file :(`);
            return;
          }
          zip
            .file('Tasks.json')
            .async('string')
            .then(data => {
              let lists = JSON.parse(data.trim());
              let selected = [];
              for (let i = 0; i < lists.length; i++) {
                selected.push(true);
              }
              resolve({lists, selected});
            });
        });
    });
  }

  showLists() {
    return (
      <div className="previewPane">
        <h3>Found the following lists:</h3>
        <p>Unselect any lists you don't want to export.</p>
        <div className="lists">
          {this.buildLists()}
        </div>
      </div>
    );
  }

  buildLists() {
    let listDivs = [];
    for (let i = 0; i < this.state.lists.length; i++) {
      let list = this.state.lists[i];
      listDivs.push(
        <div key={i}>
          <div className="listTitle">
            <input type="checkbox" name={i} checked={this.state.selected[i]} onChange={this.handleCheck} />
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
        <li key={i}>{tasks[i].title}</li>
      );
    }
    if (filteredTasks.length > limit) {
      taskDivs.push(<li key='more'>{`...${filteredTasks.length - limit} more`}</li>)
    }
    return taskDivs;
  }

  showInstructions() {
    return (
      <div className="instructionPane">
        <h3>Instructions</h3>
        <div className="instructions">
          <ol>
            <li>
              <p>Go to <a href="https://export.wunderlist.com/" target="_blank" rel="noopener noreferrer">https://export.wunderlist.com/</a></p>
            </li>
            <li>
              <p>Enter your email address so they can send you your Wunderlist data</p>
              <img src="/wunderlist2standardnotes/3.png" alt="screenshot of instruction" />
            </li>
            <li>
              <p>Wait for the email to arrive (should take a few minutes). When you get the email follow the link to download your Wunderlist .zip file</p>
            </li>
            <li>
              <p>Upload the .zip file here:</p>
              <input type="file" accept=".zip" ref={this.fileInput} onChange={this.handleSubmit} />
            </li>
            <li>
              <p>Preview the lists to the right and unselect any of the lists you don't want to migrate</p>
            </li>
            <li>
              <p>Click on the blue <b>Export</b> button below. This should download a .txt file</p>
            </li>
            <li>
              <p>Now in Standard Notes, go to <b>Account</b> and click on <b>Import Backup</b></p>
              <img src="/wunderlist2standardnotes/4.png" alt="screenshot of instruction" />
            </li>
            <li>
              <p>Select the <b>sn-import-file.txt</b> file that just downloaded. That should be it! Let me know if anything breaks</p>
            </li>
          </ol>
        </div>
      </div>
    );
  }

  showExport() {
    return (
      <div className="export" onClick={this.export}>{`Export ${this.state.selected.filter(title => title).length} lists`}</div>
    );
  }

  showError() {
    return (
      <div className="error">{this.state.error}</div>
    )
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          <h1>Wunderlist <span role="img" aria-label="right arrow">➡️</span> Standard Notes</h1>
        </div>
        <div className="body">
          {this.state.error.length > 0 && this.showError()}
          <div className="columns">
            {this.showInstructions()}
            {this.state.lists.length > 0 && this.showLists()}
          </div>
        </div>
        {this.state.selected.filter(title => title).length > 0 && this.showExport()}
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
