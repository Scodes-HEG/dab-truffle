# Prototype HEG/DAB utilisant Truffle et Ganache

<!-- MarkdownTOC -->

1. [Introduction](#toc-introduction)
1. [Pré-requis](#toc-pr%C3%A9-requis)
    1. [git et  npm](#toc-git-et-npm)
    1. [Truffle](#toc-truffle)
    1. [Ganache](#toc-ganache)
1. [Installer le projet localement](#toc-installer-le-projet-localement)
1. [Création d'une blockchain locale via Ganache](#toc-cr%C3%A9ation-dune-blockchain-locale-via-ganache)
1. [Configurer votre projet pour pouvoir déployer localement](#toc-configurer-votre-projet-pour-pouvoir-d%C3%A9ployer-localement)
    1. [Récupérer les informations](#toc-r%C3%A9cup%C3%A9rer-les-informations)
    1. [Éditer le fichier .env](#toc-%C3%89diter-le-fichier-env)
    1. [Testez votre configuration](#toc-testez-votre-configuration)
1. [Lancez votre application en local](#toc-lancez-votre-application-en-local)
    1. [La commande de déploiement local](#toc-la-commande-de-d%C3%A9ploiement-local)
1. [Metamask](#toc-metamask)
    1. [Installation](#toc-installation)
    1. [Configuration du réseau de Ganache](#toc-configuration-du-r%C3%A9seau-de-ganache)
    1. [Importez un compte de votre Blockchain](#toc-importez-un-compte-de-votre-blockchain)
1. [Dev Local](#toc-dev-local)

<!-- /MarkdownTOC -->

<a id="toc-introduction"></a>
## Introduction

Le but de ce projet est de proposer un exemple de projet permettant à une équipe de plusieurs personnes de développer sereinement une Dapp Ethereum (application distribuée basée sur les blockchains, le protocole Ethereum et les smart contracts) .

<a id="toc-pr%C3%A9-requis"></a>
## Pré-requis

<a id="toc-git-et-npm"></a>
### git et  npm

Avant toute chose et comme pour tout projet, vérifiez que `git` et `npm` soient bien installés sur votre machine.

<a id="toc-truffle"></a>
### Truffle

`truffle` va être l'outil vous permettant de compiler et gérer vos différents smart contracts.
[Installez Truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation) globalement sur votre machine

<a id="toc-ganache"></a>
### Ganache

*Ganache* est le nom de l'outil permettant de gérer et de déployer des blockchains localement: ceci vous permettra de déployer et redéployer à volonté des smart contracts pour pouvoir les tester et les modifier autant que vous voudrez.
[Installez Ganache](https://www.trufflesuite.com/docs/ganache/quickstart) sur votre machine de développement

<a id="toc-installer-le-projet-localement"></a>
## Installer le projet localement

1. Clonez le repository Git: `$ git clone git@github.com:Scodes-HEG/dab-truffle.git`
2. Ouvrez le dossier nouvellement crée: `$ cd dab-truffle`
3. Installez le projet via npm: `$ npm install`

<a id="toc-cr%C3%A9ation-dune-blockchain-locale-via-ganache"></a>
## Création d'une blockchain locale via Ganache

Une fois *Ganache* installé, lancez-le, nous allons créer une blockchain utilisable par notre projet.

1. Après avoir lancez Ganache, sélectionnez **New Workspace (Ethereum)**
2. Associez le fichier "*truffle-config.js*" qui se trouve à la racine du dossier à votre nouveau workspace
3. Vérifiez que dans **Accounts & Keys** le *ACCOUNT DEFAULT BALANCE* soit au moins égale à 10
4. Sauvez le workspace et lancez le
5. En image: ![ethereum](./readme/ethereum.gif?raw=true)


<a id="toc-configurer-votre-projet-pour-pouvoir-d%C3%A9ployer-localement"></a>
## Configurer votre projet pour pouvoir déployer localement

Pour que **Truffle** puisse déployer sur votre nouvel blockchain Ethereum déployée localement via **Ganache** vous devez d'abord configurer votre projet.

<a id="toc-r%C3%A9cup%C3%A9rer-les-informations"></a>
### Récupérer les informations

Il vous faut le **host**, le **port** et l'**identifiant** de votre blockchain. Tout ceci est visible dans l'interface de **Ganache** une fois votre blockchain locale lancée:

Dans l'image suivante, vous trouverez souligné en **rouge l'identifiant**, en **vert le host** et en **jaune le port** de votre blockchain

![infos](./readme/infos.PNG?raw=true)

<a id="toc-%C3%89diter-le-fichier-env"></a>
### Éditer le fichier .env

À la racine du dossier se trouve un fichier .env, celui-ci doit être modifié et vous pouvez remplacer les valeurs 

- LOCAL_BLOCKCHAIN_HOST="0.0.0.0"
- LOCAL_BLOCKCHAIN_PORT="7545"
- LOCAL_BLOCKCHAIN_ID="5777"

Par celles trouvés précédemment.

<a id="toc-testez-votre-configuration"></a>
### Testez votre configuration

Rendez vous avec votre ligne de commande à la racine du dossier et lancez la commande

`$ truffle migrate`

Une compilation des smart contracts devrait se lancer et un déploiement sur votre blockchain local.

Pour vérifier que tout est bien déployé sur votre blockchain locale, vous pouvez désormais voir les smart contracts déployés directement sur l'interface de **Ganache** sous l'onglet *Contracts*

![infos](./readme/deployeds.PNG?raw=true)

<a id="toc-lancez-votre-application-en-local"></a>
## Lancez votre application en local

Une fois que tout est installé (`npm install`) et correctement déployé (`truffle migrate`) vous pouvez désormais lancer votre application en local.

<a id="toc-la-commande-de-d%C3%A9ploiement-local"></a>

<a id="toc-la-commande-de-d%C3%A9ploiement-local"></a>
### La commande de déploiement local

1. Lancez le serveur via la commande `$ npm run dev` à la racine du dossier 

2. Vous devriez voir une information du type 

   ```bash
   Listening: http://localhost:3000/ 
   ```

3. Si la compilation se fait sans erreur, bravo, l'application est déployée.

<a id="toc-metamask"></a>
## Metamask

Metamask est un plugin Firefox / Chrome permettant de gérer différents portefeuille et utilisateurs Ethereum.


<a id="toc-installation"></a>
### Installation

[Commencez par l'intaller](https://metamask.io/).

<a id="toc-configuration-du-r%C3%A9seau-de-ganache"></a>
### Configuration du réseau de Ganache

Il faut maintenant faire communiquer votre MetaMask avec votre blockchain déployé par Ganache.

1. Ouvrez MetaMask pour installer un nouveau réseau:
   

![infos](./readme/custom.gif?raw=true)

2. Entrez y les valeurs suivantes:
   

![infos](./readme/settings.jpg?raw=true)

   **ATTENTION**: l'ip peut différencier d'une installation à l'autre. Si vous faite tout en local, vous pourriez simplement utilise **0.0.0.0** (à la palce de 192.168.1.15)
   Pareil pour le **Chain ID**: la plupart du temps ça ne bouge pas et ça sera 0x539. Mais il se peut que quelque chose change dans l'algorithme de transformation de l'ID. Si 0x539 ne fonctionne pas, MetaMask vous indiquera la nouvelle ID. Dans le pire des cas, essayer **5777**

<a id="toc-importez-un-compte-de-votre-blockchain"></a>
### Importez un compte de votre Blockchain

Pour que votre application fonctionne, il faut désormais importer un compte existant sur **Ganache**. Je vous conseille donc de prendre le premier compte de votre blockchain et de l'importer dans votre MetaMask.

1. Copiez la clé:

   ![infos](./readme/privkey.gif?raw=true)

2. Importez la dans MetaMask:

    ![infos](./readme/import.gif?raw=true)

   ## Lancement de l'application

Vous pouvez désormais ouvrir la page de l'application (http://localhost:3000)
MetaMask vous demandera si il peut s'y connecter, dites lui que oui, sélectionnez le réseau Ganache puis votre compte: et c'est parti !

![infos](./readme/devlocal.gif?raw=true)

<a id="toc-dev-local"></a>
## Dev Local

Enfin: Vous êtes prêt pour développer localement votre application !