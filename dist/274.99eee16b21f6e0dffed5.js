"use strict";(self.webpackChunkcomplex_react_app=self.webpackChunkcomplex_react_app||[]).push([[274],{7274:(e,t,a)=>{a.r(t),a.d(t,{default:()=>i});var s=a(7294),r=a(3983),l=a(4450),c=a(9669),n=a.n(c),o=a(9711);function i(){const e=(0,s.useContext)(r.Z),[t,a]=(0,l.x)({searchTerm:"",results:[],show:"nither",requestCount:0});function c(t){27==t.keyCode&&e({type:"closeSearch"})}return(0,s.useEffect)((()=>(document.addEventListener("keyup",c),()=>document.removeEventListener("keyup",c))),[]),(0,s.useEffect)((()=>{if(t.searchTerm.trim()){a((e=>{e.show="loading"}));const e=setTimeout((()=>{a((e=>{e.requestCount++}))}),700);return()=>clearTimeout(e)}a((e=>{e.show="nither"}))}),[t.searchTerm]),(0,s.useEffect)((()=>{if(t.requestCount){const e=n().CancelToken.source();async function s(){try{const s=await n().post("/search",{searchTerm:t.searchTerm},{cancelToken:e.token});a((e=>{e.results=s.data,e.show="results"}))}catch(e){console.log("prolem")}}return s(),()=>e.cancel()}}),[t.requestCount]),s.createElement(s.Fragment,null,s.createElement("div",{className:"search-overlay-top shadow-sm"},s.createElement("div",{className:"container container--narrow"},s.createElement("label",{htmlFor:"live-search-field",className:"search-overlay-icon"},s.createElement("i",{className:"fas fa-search"})),s.createElement("input",{onChange:function(e){const t=e.target.value;a((e=>{e.searchTerm=t}))},autoFocus:!0,type:"text",autoComplete:"off",id:"live-search-field",className:"live-search-field",placeholder:"What are you interested in?"}),s.createElement("span",{onClick:function(t){t.preventDefault(),e({type:"closeSearch"})},className:"close-live-search"},s.createElement("i",{className:"fas fa-times-circle"})))),s.createElement("div",{className:"search-overlay-bottom"},s.createElement("div",{className:"container container--narrow py-3"},s.createElement("div",{className:"circle-loader "+("loading"==t.show?"circle-loader--visible":"")}),s.createElement("div",{className:"live-search-results "+("results"==t.show?"live-search-results--visible":"")},Boolean(t.results.length)&&s.createElement("div",{className:"list-group shadow-sm"},s.createElement("div",{className:"list-group-item active"},s.createElement("strong",null,"Search Results")," ",t.results.length," ",t.results.length>1?"items":"item"," Found "),t.results.map((t=>{const a=new Date(t.createdDate),r=`${a.getDate()}/${a.getMonth()+1}/${a.getFullYear()}`;return s.createElement(o.rU,{onClick:()=>e({type:"closeSearch"}),key:t._id,to:`/post/${t._id}`,className:"list-group-item list-group-item-action"},s.createElement("img",{className:"avatar-tiny",src:t.author.avatar})," ",s.createElement("strong",null,t.title),"   ",s.createElement("span",{className:"text-muted small"},"by ",t.author.username," on ",r," "))}))),!Boolean(t.results.length)&&s.createElement("p",{className:"alert alert-danger text-center shadow-sm"},"No Results")))))}}}]);