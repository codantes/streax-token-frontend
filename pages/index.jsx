import Head from 'next/head'
import Image from 'next/image'
import Web3Modal from "web3modal"
import {useState, useEffect, useRef} from 'react'
import { providers, Signer, utils, Contract } from 'ethers'
import { contractAddress, abi } from '../constant'

const Home = () => {
  const [isWalletConnected, setWalletConnected] = useState(false)
  const [publicAddress, setPublicAddress] = useState("")
  const [isLoading, setLoading] = useState(false)

  const web3ModalRef = useRef()

  const getProviderOrSigner = async(needSigner = false) => {
    const provider = await web3ModalRef.current.connect()
    const web3Provider = new providers.Web3Provider(provider)
    if(needSigner) {
      const Signer = web3Provider.getSigner()
      return Signer;
    }

    return web3Provider
  }
  

  useEffect(() => {
    if(!isWalletConnected){
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });  
    }
    connectWallet()
  }, [isWalletConnected])

  
    const connectWallet = async () => {
      try {
        await getProviderOrSigner();
        const signer = await getProviderOrSigner(true)
        const _publicAdress = await signer.getAddress()
        setPublicAddress(_publicAdress)
        setWalletConnected(true)
      } catch (error) {
        console.log(error)
      }
    }

    const mint = async () => {
      try {
        const signer = await getProviderOrSigner(true)
        const tokenContract = new Contract(  contractAddress, abi, signer)
        const tx = await tokenContract.mint(publicAddress, 10)
        console.log(tx)
        setLoading(true)
        await tx.wait();
        window.alert("your token is minted, see console for transaction details");
      } catch (error) {
        console.log(error)
      }
    }



  return (
    <div className="flex min-h-screen flex-col items-center py-2 bg-gradient-to-br from-purple-300 to-indigo-600">
      <h1 className='mt-6 mb-10 font-mono text-3xl font-extrabold text-purple-600 underline'>
        Streax Token
      </h1>
      <section className='mt-12 p-4 rounded-md bg-fuchsia-700 text-white'>
      <button onClick={mint}>
        click to mint 10 streax token
      </button>
      </section>
    </div>
  )
}

export default Home