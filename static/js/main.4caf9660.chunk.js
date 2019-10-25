(this.webpackJsonpwunderlist2standardnotes=this.webpackJsonpwunderlist2standardnotes||[]).push([[0],{102:function(e,t,n){"use strict";n.r(t);var a=n(0),l=n.n(a),r=n(49),i=n.n(r),s=(n(60),n(50)),o=n(51),c=n(53),u=n(52),d=n(7),h=n(54),m=(n(61),n(62));function f(){var e=window.crypto||window.msCrypto;if(e){var t=new Uint32Array(4);e.getRandomValues(t);var n=-1;return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){var a=t[++n>>3]>>n%8*4&15;return("x"==e?a:3&a|8).toString(16)}))}var a=(new Date).getTime();return window.performance&&"function"===typeof window.performance.now&&(a+=performance.now()),"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){var t=(a+16*Math.random())%16|0;return a=Math.floor(a/16),("x"==e?t:3&t|8).toString(16)}))}var p=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(c.a)(this,Object(u.a)(t).call(this,e))).handleSubmit=n.handleSubmit.bind(Object(d.a)(n)),n.handleCheck=n.handleCheck.bind(Object(d.a)(n)),n.export=n.export.bind(Object(d.a)(n)),n.unzip=n.unzip.bind(Object(d.a)(n)),n.fileInput=l.a.createRef(),n.state={lists:[],selected:[],error:""},n}return Object(h.a)(t,e),Object(o.a)(t,[{key:"export",value:function(){for(var e={items:[]},t=0;t<this.state.lists.length;t++)if(this.state.selected[t]){var n=this.state.lists[t];e.items.push({created_at:new Date(n.createdAt),updated_at:this.getMostRecentDate(n.tasks),uuid:f(),content_type:"Note",content:{title:n.title,text:this.buildNote(n.tasks),references:[]}})}!function(e,t){var n=document.createElement("a");n.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(t)),n.setAttribute("download",e),n.style.display="none",document.body.appendChild(n),n.click(),document.body.removeChild(n)}("sn-import-file.txt",JSON.stringify(e))}},{key:"getMostRecentDate",value:function(e){var t=new Date(e[0].createdAt),n=!0,a=!1,l=void 0;try{for(var r,i=e[Symbol.iterator]();!(n=(r=i.next()).done);n=!0){var s=r.value,o=new Date(s.createdAt);o>t&&(t=o)}}catch(c){a=!0,l=c}finally{try{n||null==i.return||i.return()}finally{if(a)throw l}}return t}},{key:"buildNote",value:function(e){var t="",n=!0,a=!1,l=void 0;try{for(var r,i=e[Symbol.iterator]();!(n=(r=i.next()).done);n=!0){var s=r.value;s.completed||(t=t+s.title+"\r\n\r\n")}}catch(o){a=!0,l=o}finally{try{n||null==i.return||i.return()}finally{if(a)throw l}}return t}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),this.setState({lists:[],selected:[],error:""}),this.unzip(this.fileInput.current.files[0]).then((function(e){return t.setState(e)})).catch((function(e){return t.setState({error:e})}))}},{key:"handleCheck",value:function(e){var t=this.state.selected;t[parseInt(e.target.name)]=!t[parseInt(e.target.name)],this.setState({selected:t})}},{key:"unzip",value:function(e){return new Promise((function(t,n){m.loadAsync(e).then((function(e){e.files["Tasks.json"]?e.file("Tasks.json").async("string").then((function(e){for(var n=JSON.parse(e.trim()),a=[],l=0;l<n.length;l++)a.push(!0);t({lists:n,selected:a})})):n("Couldn't use this file :(")}))}))}},{key:"showLists",value:function(){return l.a.createElement("div",{className:"previewPane"},l.a.createElement("h3",null,"Found the following lists:"),l.a.createElement("p",null,"Unselect any lists you don't want to export."),l.a.createElement("div",{className:"lists"},this.buildLists()))}},{key:"buildLists",value:function(){for(var e=[],t=0;t<this.state.lists.length;t++){var n=this.state.lists[t];e.push(l.a.createElement("div",{key:t},l.a.createElement("div",{className:"listTitle"},l.a.createElement("input",{type:"checkbox",name:t,checked:this.state.selected[t],onChange:this.handleCheck}),n.title),l.a.createElement("ul",null,this.buildTasks(n.tasks))))}return e}},{key:"buildTasks",value:function(e){for(var t=[],n=e.filter((function(e){return!e.completed})),a=0;a<5&&a<n.length;a++)t.push(l.a.createElement("li",{key:a},e[a].title));return n.length>5&&t.push(l.a.createElement("li",{key:"more"},"...".concat(n.length-5," more"))),t}},{key:"showInstructions",value:function(){return l.a.createElement("div",{className:"instructionPane"},l.a.createElement("h3",null,"Instructions"),l.a.createElement("div",{className:"instructions"},l.a.createElement("ol",null,l.a.createElement("li",null,l.a.createElement("p",null,"Go to ",l.a.createElement("a",{href:"https://www.wunderlist.com",target:"_blank",rel:"noopener noreferrer"},"wunderlist.com"))),l.a.createElement("li",null,l.a.createElement("p",null,"Click on your name and then ",l.a.createElement("b",null,"Account Settings")),l.a.createElement("img",{src:"/wunderlist2standardnotes/1.png",alt:"screenshot of instruction"})),l.a.createElement("li",null,l.a.createElement("p",null,"In the ",l.a.createElement("b",null,"Account")," tab click ",l.a.createElement("b",null,"Create Export")),l.a.createElement("img",{src:"/wunderlist2standardnotes/2.png",alt:"screenshot of instruction"})),l.a.createElement("li",null,l.a.createElement("p",null,"Enter your email address so they can send you your Wunderlist data"),l.a.createElement("img",{src:"/wunderlist2standardnotes/3.png",alt:"screenshot of instruction"})),l.a.createElement("li",null,l.a.createElement("p",null,"Wait for the email to arrive (should take a few minutes). When you get the email follow the link to download your Wunderlist .zip file")),l.a.createElement("li",null,l.a.createElement("p",null,"Upload the .zip file here:"),l.a.createElement("input",{type:"file",accept:".zip",ref:this.fileInput,onChange:this.handleSubmit})),l.a.createElement("li",null,l.a.createElement("p",null,"Preview the lists to the right and unselect any of the lists you don't want to migrate")),l.a.createElement("li",null,l.a.createElement("p",null,"Click on the blue ",l.a.createElement("b",null,"Export")," button below. This should download a .txt file")),l.a.createElement("li",null,l.a.createElement("p",null,"Now in Standard Notes, go to ",l.a.createElement("b",null,"Account")," and click on ",l.a.createElement("b",null,"Import Backup")),l.a.createElement("img",{src:"/wunderlist2standardnotes/4.png",alt:"screenshot of instruction"})),l.a.createElement("li",null,l.a.createElement("p",null,"Select the sn-import-file.txt file that just downloaded. That should be it! Let me know if anything breaks")))))}},{key:"showExport",value:function(){return l.a.createElement("div",{className:"export",onClick:this.export},"Export ".concat(this.state.selected.filter((function(e){return e})).length," lists"))}},{key:"showError",value:function(){return l.a.createElement("div",{className:"error"},this.state.error)}},{key:"render",value:function(){return l.a.createElement("div",{className:"App"},l.a.createElement("div",{className:"header"},l.a.createElement("h1",null,"Wunderlist ",l.a.createElement("span",{role:"img","aria-label":"right arrow"},"\u27a1\ufe0f")," Standard Notes")),l.a.createElement("div",{className:"body"},this.state.error.length>0?this.showError():null,l.a.createElement("div",{className:"columns"},this.showInstructions(),this.state.lists.length>0?this.showLists():null)),this.state.selected.filter((function(e){return e})).length>0?this.showExport():null)}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(l.a.createElement(p,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},55:function(e,t,n){e.exports=n(102)},60:function(e,t,n){},61:function(e,t,n){},67:function(e,t){},69:function(e,t){}},[[55,1,2]]]);
//# sourceMappingURL=main.4caf9660.chunk.js.map