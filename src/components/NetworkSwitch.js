import { NETWORKS } from '../config/networks';

const NetworkSwitch = ({ onSwitch }) => {
    const switchNetwork = async (networkName) => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: NETWORKS[networkName].chainId }],
            });
            onSwitch(networkName);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <button onClick={() => switchNetwork('sepolia')}>Sepolia</button>
            <button onClick={() => switchNetwork('mumbai')}>Mumbai</button>
        </div>
    );
};

export default NetworkSwitch; 