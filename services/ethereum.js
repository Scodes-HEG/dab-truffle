import { NETWORKS_ETHERSCAN } from '~/services/constants/ethereum_networks';

export const ETHERSCAN_URL = (network, endpoint) => {
  return NETWORKS_ETHERSCAN[network] ? 'https://'+NETWORKS_ETHERSCAN[network]+endpoint : null;
}
