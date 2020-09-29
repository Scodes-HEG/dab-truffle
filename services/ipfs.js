import Ipfs from 'ipfs';
import { Notifier } from '~/services/notifier.js';

let ipfsObject = {};

ipfsObject.inited = false;

ipfsObject.init = async() => {
  Notifier.log('IPFS: initialising node');
  try {
    const node = await Ipfs.create({
      repo: String(Math.random() + Date.now()),
          //   config: {
    //     Addresses: {
    //       Swarm: [
    //       '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
    //       ]
    //     }
    //   }
    })
    console.log(node);
    window.ipfs = node;
    ipfsObject.inited = true;

    return node;
  } catch(e) {
    console.error(e);
  }
}

ipfsObject.getNode = async() => {
  if (ipfsObject.inited) {
    return new Promise((resolve, reject) => {
      resolve(window.ipfs);
    });
  }

  let node = await ipfsObject.init();
  return window.ipfs;
};

// *
//  * add a new post into ipfs
//  * @param  string data The data to be posted
//  * @return {
//  *         path: path of the file
//  *         hash: hash of the file
//  *         url: public url of the file
//  *         }      The file that has been posted
//  *
ipfsObject.add = async(data) => {
  if (typeof data != 'string') {
    data = JSON.stringify(data);
  }
  let node = await ipfsObject.getNode();
  const filesAdded = await node.add({
    content: Buffer.from(data)
  })
    console.log(filesAdded);

  let file = {};
  file.path = filesAdded.path;
  file.hash = filesAdded.path;
  file.url = 'https://ipfs.io/ipfs/' + filesAdded.path;
  Notifier.log('IPFS: New data created', file);

  localStorage.setItem('ipfs-'+(file.hash), data);

  console.log(file);
  return file;
};

// *
//  * read a file on ipfs
//  * @param  {string} hash Hash to read
//  * @return {string} The content to be read
//  *
ipfsObject.read = async(hash) => {
  return new Promise(async (resolve) => {
    let node = await ipfsObject.getNode();
    let data = localStorage.getItem('ipfs-'+hash);
    if (data) {
      resolve(data);
    }

    const stream = node.cat(hash)
    data = ''

    for await (const chunk of stream) {
      // chunks of data are returned as a Buffer, convert it back to a string
      data += chunk.toString()
    }

    Notifier.log('IPFS: data read', hash, data);
    localStorage.setItem('ipfs-'+hash, data);
    resolve(data);
  });
};

export const IPFS_MANAGER = ipfsObject;
