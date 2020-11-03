# Prototype HEG/DAB utilisant Truffle et Ganache

[TOC]

## Introduction

Le but de ce projet est de proposer un exemple de projet permettant à une équipe de plusieurs personnes de développer sereinement une Dapp Ethereum (application distribuée basée sur les blockchains, le protocole Ethereum et les smart contracts) .

## Pré-requis

### git et  npm

Avant toute chose et comme pour tout projet, vérifiez que `git` et `npm` soient bien installés sur votre machine.

### Truffle

`truffle` va être l'outil vous permettant de compiler et gérer vos différents smart contracts.
[Installez Truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation) globalement sur votre machine

### Ganache

*Ganache* est le nom de l'outil permettant de gérer et de déployer des blockchains localement: ceci vous permettra de déployer et redéployer à volonté des smart contracts pour pouvoir les tester et les modifier autant que vous voudrez.
[Installez Ganache](https://www.trufflesuite.com/docs/ganache/quickstart) sur votre machine de développement

## Installer le projet localement

1. Clonez le repository Git: `$ git clone git@github.com:Scodes-HEG/dab-truffle.git`
2. Ouvrez le dossier nouvellement crée: `$ cd dab-truffle`
3. Installez le projet via npm: `$ npm install`

## Création d'une blockchain locale via Ganache

Une fois *Ganache* installé, lancez-le, nous allons créer une blockchain utilisable par notre projet.

1. Après avoir lancez Ganache, sélectionnez **New Workspace (Ethereum)**
2. Associez le fichier "*truffle-config.js*" qui se trouve à la racine du dossier à votre nouveau workspace
3. Vérifiez que dans **Accounts & Keys** le *ACCOUNT DEFAULT BALANCE* soit au moins égale à 10
4. Sauvez le workspace et lancez le
5. En image: ![ethereum](./readme/ethereum.gif?raw=true)


## Configurer votre projet pour pouvoir déployer localement

Pour que **Truffle** puisse déployer sur votre nouvel blockchain Ethereum déployée localement via **Ganache** vous devez d'abord configurer votre projet.

### Récupérer les informations

Il vous faut le **host**, le **port** et l'**identifiant** de votre blockchain. Tout ceci est visible dans l'interface de **Ganache** une fois votre blockchain locale lancée:

Dans l'image suivante, vous trouverez souligné en **rouge l'identifiant**, en **vert le host** et en **jaune le port** de votre blockchain

![infos](./readme/infos.PNG?raw=true)



## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).