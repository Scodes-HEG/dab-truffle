(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{1708:function(e,t,r){"use strict";r.r(t);r(25);var n=r(3),o=r(19),c=r(36),l=r(23),d={layout:"default",data:function(){return{patronyme:null,email:null,dabTotal:0,contracts:null,stepReset:1,contratsLoaded:!1}},created:function(){this.$store.state.model.requerants.read?this.init():o.a.$on("model-initialised",function(){this.init()}.bind(this))},methods:{init:function(){var e=this;return Object(n.a)(regeneratorRuntime.mark((function t(){var r,n,o;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.$store.state.user.info.is_requerant&&(e.patronyme=e.$store.state.user.info.requerant_account.patronyme,e.email=e.$store.state.user.info.requerant_account.email),t.next=3,e.$model.requerant_contract_register().getContracts(e.$store.state.web3.coinbase);case 3:for(r=(r=t.sent).reverse(),e.contracts=r,e.contratsLoaded=!0,n=0;n<e.contracts.length;n++)o=e.contracts[n],e.contracts[n].url=Object(l.a)(e.$store.state.web3.networkId,"/address/"+o.address),c.a.read(o.hash).then(function(data){data=JSON.parse(data),this.currentVue.contracts[this.j].data=data;var e=this.currentVue.$model.dab().getRemoteParcellePoolDABs(data.parcelle.uuid,data.pool.uuid);this.currentVue.dabTotal+=e,this.currentVue.contracts[this.j].data.dab=e,this.currentVue.stepReset++}.bind({currentVue:e,j:n}));case 8:case"end":return t.stop()}}),t)})))()},create:function(e){var t=this;return Object(n.a)(regeneratorRuntime.mark((function r(){var n,o;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:e.preventDefault(),n=t.patronyme,o=t.email,t.$model.requerants().setAccount(t.$store.state.web3.coinbase,o,n);case 4:case"end":return r.stop()}}),r)})))()}}},v=r(85),component=Object(v.a)(d,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return e.$store.state.model.initialised?r("div",{staticClass:"wrapper"},[e.$store.state.user.info.is_requerant?e._e():[r("h2",[e._v("Créer votre compte requérant")])],e._v(" "),e.$store.state.user.info.is_requerant?[r("h2",[e._v("Modifier votre compte requérant")])]:e._e(),e._v(" "),r("form",{on:{submit:e.create}},[r("label",[e._v("Patronyme: "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.patronyme,expression:"patronyme"}],attrs:{type:"text",name:"name",required:""},domProps:{value:e.patronyme},on:{input:function(t){t.target.composing||(e.patronyme=t.target.value)}}})]),e._v(" "),r("label",[e._v("Email: "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.email,expression:"email"}],attrs:{type:"email",name:"email",required:""},domProps:{value:e.email},on:{input:function(t){t.target.composing||(e.email=t.target.value)}}})]),e._v(" "),r("br"),e._v(" "),e._m(0)]),e._v(" "),r("hr"),e._v(" "),e.$store.state.user.info.is_requerant?[r("h2",[e._v("Mes contrats")]),e._v(" "),e.contratsLoaded?e._e():r("p",[e._v("Contrats en cours de chargement...")]),e._v(" "),e.contratsLoaded?r("div",[r("p",[e._v("Total DABs: "),r("strong",[e._v(e._s(e.dabTotal))])]),e._v(" "),r("ul",{key:e.stepReset},e._l(e.contracts,(function(t){return r("li",[r("p",[r("a",{attrs:{target:"_blank",href:t.url}},[e._v("Contrat "+e._s(t.address))])]),e._v(" "),t.data?r("div",[r("p",[e._v("Parcelle: "),r("strong",[e._v(e._s(t.data.parcelle.id))])]),e._v(" "),r("p",[e._v("Pool: "),r("strong",[e._v(e._s(t.data.pool.pool))])]),e._v(" "),r("p",[e._v("Valeur DABs: "),r("strong",[e._v(e._s(t.data.dab))])]),e._v(" "),r("pre",[e._v(e._s(t.data.info))])]):e._e()])})),0)]):e._e()]:e._e()],2):e._e()}),[function(){var e=this.$createElement,t=this._self._c||e;return t("button",{attrs:{type:"submit"}},[t("i",{staticClass:"fa fa-save"}),this._v(" Enregistrer")])}],!1,null,null,null);t.default=component.exports}}]);