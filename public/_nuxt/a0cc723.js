(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{1709:function(t,e,n){"use strict";n.r(e);n(25);var r=n(3),o=n(19),c=n(36),_={layout:"default",data:function(){return{accounts:[],stepReset:1}},created:function(){this.$store.state.model.requerants.read?this.init():o.a.$on("model-initialised",function(){this.init()}.bind(this))},methods:{toggle:function(t){t.show=!t.show,this.stepReset++},init:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var i,n,r,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$model.requerants().getList();case 2:t.accounts=e.sent,i=0;case 4:if(!(i<t.accounts.length)){e.next=15;break}return e.next=7,t.$model.requerant_contract_register().getContracts(t.accounts[i].address);case 7:for(n=e.sent,t.accounts[i].contracts=n,t.stepReset++,t.accounts[i].dabTotal=0,r=0;r<t.accounts[i].contracts.length;r++)o=t.accounts[i].contracts[r],c.a.read(o.hash).then(function(data){data=JSON.parse(data),this.currentVue.accounts[this.i].contracts[this.j].data=data;var t=this.currentVue.$model.dab().getRemoteParcellePoolDABs(data.parcelle.uuid,data.pool.uuid);this.currentVue.accounts[this.i].dabTotal+=t,this.currentVue.accounts[this.i].contracts[this.j].data.dab=t,this.currentVue.stepReset++}.bind({currentVue:t,j:r,i:i}));case 12:i++,e.next=4;break;case 15:case"end":return e.stop()}}),e)})))()}}},l=n(85),component=Object(l.a)(_,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"wrapper"},[t.accounts.length<1?[n("h2",[t._v("Aucun compte requérant pour le moment")])]:[n("h2",[t._v("Liste des comptes requérants")]),t._v(" "),t.$store.state.model.requerants.read?t._e():n("div",[t._v("Chargement...")]),t._v(" "),t.$store.state.model.requerants.read?n("table",{key:t.stepReset},[t._m(0),t._v(" "),t._l(t.accounts,(function(e,r){return n("tr",[n("td",[t._v(t._s(e.email))]),t._v(" "),n("td",[t._v(t._s(e.patronyme))]),t._v(" "),n("td",[t._v(t._s(e.address))]),t._v(" "),n("td",[n("ul",[e.contracts?t._e():n("li",[t._v("Chargement en cours...")]),t._v(" "),e.contracts&&0==e.contracts.length?n("li",[t._v("Pas de contrat")]):t._e(),t._v(" "),t._l(e.contracts,(function(e,r){return n("li",[n("strong",[n("a",{attrs:{target:"_blank",href:e.url}},[t._v(t._s(e.address))])]),t._v(" "),e.show?t._e():n("button",{on:{click:function(n){return t.toggle(e)}}},[t._v("Voir "),n("i",{staticClass:"fa fa-eye"})]),t._v(" "),e.show?n("button",{on:{click:function(n){return t.toggle(e)}}},[t._v("Cacher "),n("i",{staticClass:"fa fa-eye-slash"})]):t._e(),t._v(" "),e.show?n("div",[e.data?t._e():[t._v("\n                hash: "+t._s(e.hash)),n("br")],t._v(" "),e.data?[n("ul",[n("li",[n("strong",[t._v("Parcelle")]),t._v(": "+t._s(e.data.parcelle.id))]),t._v(" "),n("li",[n("strong",[t._v("Pool")]),t._v(": "+t._s(e.data.pool.pool))]),t._v(" "),n("li",[n("strong",[t._v("DAB")]),t._v(": "+t._s(e.data.dab))]),t._v(" "),n("li",[n("pre",[t._v(t._s(e.data.info))])])])]:t._e()],2):t._e()])}))],2)]),t._v(" "),n("td",[t._v(t._s(e.dabTotal))])])}))],2):t._e()]],2)}),[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tr",[n("th",[t._v("Email")]),t._v(" "),n("th",[t._v("Patronyme")]),t._v(" "),n("th",[t._v("Adresse")]),t._v(" "),n("th",[t._v("Contrats")]),t._v(" "),n("th",[t._v("Somme des DABs")])])}],!1,null,null,null);e.default=component.exports}}]);