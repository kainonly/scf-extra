!function(e){var t={};function s(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=t,s.d=function(e,t,r){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)s.d(r,n,function(t){return e[t]}.bind(null,n));return r},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=0)}([function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=s(1),n=s(2),i=s(3),o=s(4),a=r({logger:!!i.env.LOGGER&&i.env.LOGGER});a.register(n),a.register(o.AppModule.footRoot),a.listen(3e3,"0.0.0.0",(e,t)=>{e&&(a.log.error(e),process.exit(1)),a.log.info(`server listening on ${t}`)})},function(e,t){e.exports=require("fastify")},function(e,t){e.exports=require("fastify-compress")},function(e,t){e.exports=require("process")},function(e,t,s){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0});const r=s(5),n=s(6),i=s(9),o=s(11);class a{constructor(e){this.fastify=e}static footRoot(e,t,s){const r=new a(e);r.setProviders(),r.onInit(),r.setRoute(),s()}setProviders(){this.config=new i.ConfigService(r.join(e,"config.json")),this.client=new n.ClientService}onInit(){const e=this.config.get();for(const t in e)if(e.hasOwnProperty(t)){const s=e[t];this.client.put(t,{host:s.host,port:s.port,username:s.username,password:s.password,privateKey:Buffer.from(s.privateKey,"base64"),passphrase:s.passphrase}),this.client.tunnel(t,s.tunnels)}}setRoute(){o.api(this.fastify,this.client,this.config)}}t.AppModule=a}).call(this,"/")},function(e,t){e.exports=require("path")},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=s(7),n=s(8);t.ClientService=class{constructor(){this.clientOption=new Map,this.clientRuntime=new Map,this.clientStatus=new Map,this.serverOption=new Map,this.serverRuntime=new Map}getClientOption(){return this.clientOption}getServerOption(){return this.serverOption}async testing(e){return new Promise((t,s)=>{let n=new r.Client;n.connect(e),n.on("ready",()=>{t("ok"),n.destroy()}),n.on("error",e=>{s(e)}),n.on("close",()=>{n.removeAllListeners(),n=void 0})})}connection(e){return new Promise((t,s)=>{this.clientOption.has(e)||s("client not exists");const n=new r.Client;n.connect(this.clientOption.get(e)),n.on("ready",()=>{this.clientStatus.set(e,!0),t(n)}),n.on("error",e=>{s(e)}),n.on("close",()=>{n.removeAllListeners(),this.clientStatus.set(e,!1)}),this.clientRuntime.set(e,n)})}get(e){if(!this.clientOption.has(e))return null;const t=this.clientOption.get(e);return{identity:e,host:t.host,port:t.port,username:t.username,connected:this.clientStatus.get(e),tunnels:this.serverOption.get(e),tunnelsListening:this.serverRuntime.get(e).map(e=>e.listening)}}put(e,t){try{return this.close(e),this.clientOption.set(e,t),this.clientStatus.set(e,!1),this.serverRuntime.has(e)&&this.tunnel(e,this.serverOption.get(e)),!0}catch(e){return!1}}exec(e,t){return new Promise(async(s,r)=>{try{let n;this.clientOption.has(e)||r("client not exists"),(n=this.clientRuntime.has(e)?this.clientRuntime.get(e):await this.connection(e)).exec(t,(t,r)=>{this.clientStatus.set(e,!0),s(r)})}catch(e){r(e.message)}})}close(e){return this.clientRuntime.has(e)&&this.clientRuntime.get(e).destroy(),this.clientRuntime.delete(e)}delete(e){return this.close(e)&&this.clientOption.delete(e)&&this.clientStatus.delete(e)}tunnel(e,t){return new Promise(async(s,r)=>{try{let i;if(this.clientOption.has(e)||r("client not exists"),i=this.clientRuntime.has(e)?this.clientRuntime.get(e):await this.connection(e),this.serverRuntime.has(e)){for(const t of this.serverRuntime.get(e))t.close();this.serverRuntime.delete(e)}const o=[];for(const e of t){const t=n.createServer(t=>{i.forwardOut(e[0],e[1],e[2],e[3],(e,s)=>{e?r(e.message):(t.pipe(s).pipe(t),t.on("error",e=>{console.log(e)}))})});t.listen(e[3],()=>{s(!0),console.log("TCP::"+e[3])}),t.on("error",e=>{r(e.message)}),o.push(t)}this.serverRuntime.set(e,o),this.serverOption.set(e,t)}catch(e){r(e.message)}})}}},function(e,t){e.exports=require("ssh2")},function(e,t){e.exports=require("net")},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=s(10);t.ConfigService=class{constructor(e){this.file=e,r.existsSync(e)?this.config=JSON.parse(r.readFileSync(e).toString()):r.writeFileSync(e,JSON.stringify({}))}get(){return this.config}set(e){r.writeFileSync(this.file,JSON.stringify(e)),this.config=e}}},function(e,t){e.exports=require("fs")},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.api=(e,t,s)=>{function r(){const e={},r=t.getServerOption();t.getClientOption().forEach((t,s)=>{e[s]={host:t.host,port:t.port,username:t.username,password:t.password,privateKey:t.privateKey.toString("base64"),passphrase:t.passphrase,tunnels:r.has(s)?r.get(s):[]}}),s.set(e)}e.post("/testing",{schema:{body:{required:["host","port","username"],properties:{host:{type:"string"},port:{type:"number"},username:{type:"string"},password:{type:"string"},private_key:{type:"string"},passphrase:{type:"string"}},oneOf:[{required:["password"]},{required:["private_key"]}]}}},async(e,s)=>{try{const r=e.body;r.private_key&&(r.private_key=Buffer.from(r.private_key,"base64"));const n=await t.testing({host:r.host,port:r.port,username:r.username,password:r.password,privateKey:r.private_key,passphrase:r.passphrase});s.send({error:0,msg:n})}catch(e){s.send({error:1,msg:e.message})}}),e.post("/lists",{schema:{body:{required:["identity"],properties:{identity:{type:"array"}}}}},(e,s)=>{const r=e.body;s.send({error:0,data:r.identity.map(e=>t.get(e))})}),e.post("/get",{schema:{body:{required:["identity"],properties:{identity:{type:"string"}}}}},(e,s)=>{const r=e.body;s.send({error:0,data:t.get(r.identity)})}),e.post("/put",{schema:{body:{required:["identity","host","port","username"],properties:{identity:{type:"string"},host:{type:"string"},port:{type:"number"},username:{type:"string"},password:{type:"string"},private_key:{type:"string"},passphrase:{type:"string"}},oneOf:[{required:["password"]},{required:["private_key"]}]}}},async(e,s)=>{try{const n=e.body;n.private_key&&(n.private_key=Buffer.from(n.private_key,"base64"));const i=t.put(n.identity,{host:n.host,port:n.port,username:n.username,password:n.password,privateKey:n.private_key,passphrase:n.passphrase});r(),s.send(i?{error:0,msg:"ok"}:{error:1,msg:"failed"})}catch(e){s.send({error:1,msg:e.message})}}),e.post("/exec",{schema:{body:{required:["identity","bash"],properties:{identity:{type:"string"},bash:{type:"string"}}}}},async(e,s)=>{try{const r=e.body,n=await t.exec(r.identity,r.bash);s.send(n)}catch(e){s.send({error:1,msg:e})}}),e.post("/delete",{schema:{body:{required:["identity"],properties:{identity:{type:"string"}}}}},(e,s)=>{const r=e.body,n=t.delete(r.identity);s.send(n?{error:0,msg:"ok"}:{error:1,msg:"failed"})}),e.post("/tunnels",{schema:{body:{required:["identity","tunnels"],properties:{identity:{type:"string"},tunnels:{type:"array",items:{type:"array",maxItems:4,minItems:4,items:[{type:"string"},{type:"number"},{type:"string"},{type:"number"}]}}}}}},async(e,s)=>{try{const n=e.body,i=await t.tunnel(n.identity,n.tunnels);r(),s.send(i?{error:0,msg:"ok"}:{error:1,msg:"failed"})}catch(e){s.send({error:1,msg:e})}})}}]);