import "./App.css";
import React, { useEffect, useState } from "react";
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Web3 from "web3";

function App() {
  var [wallet, setWallet] = useState(null);
  var [status, setStatus] = useState(null);
  var [file, setFile] = useState(null);
  var [hash, setHash] = useState(null);
  const [open, setOpen] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [hashArr, setHashArr] = useState(null);
  const [hashList, setHashList] = useState(null);
  const [refreshBtn, setRefreshBtn] = useState(true);

  var contract_address = "0xf2b6602Bc73D3097C0fC3f87D5ed8F407f5E7eE3";
  const contract_abi = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "indx",
          type: "uint256",
        },
      ],
      name: "remove_hash",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "addr",
          type: "string",
        },
        {
          internalType: "string",
          name: "hash_cid",
          type: "string",
        },
      ],
      name: "upload_hash",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "addr",
          type: "string",
        },
      ],
      name: "check",
      outputs: [
        {
          internalType: "string[]",
          name: "",
          type: "string[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "return_array",
      outputs: [
        {
          internalType: "string[]",
          name: "",
          type: "string[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  var api_key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEI4QjQ4MjBkNjlkNmM0YzcwZkIzZkVhNjNFNEQ0OEVjNDk4QTllNEQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDM5Njg1NDM2MzYsIm5hbWUiOiJoZWxsbyB3b3JsZCJ9.YCFQ7ZR10SABRgobzFBVllwFsF-h_BlWpp9xq25yVxI";

  const fileInput = document.querySelector('input[type="file"]');

  async function connectWallet() {
    try {
      window.ethereum.enable();
      var web_3 = new Web3(window.ethereum);
      const accounts = await web_3.eth.getAccounts();
      var str = accounts[0];
      setWallet(str);
    } catch (error) {
      alert("Cannot connect");
    }
  }

  function check() {
    if (typeof window.ethereum === "undefined") {
      setStatus("Metamask not installed");
    } else {
      setStatus("Metamask installed");
      var web_3 = new Web3(window.ethereum);
      setWeb3(web_3);
      connectWallet();
    }
  }

  function onChange(data) {
    setFile(data.target.files[0]);
  }

  async function upload_data() {
    if (file != null) {
      if (web3 != null) {
        const client = new Web3Storage({ token: api_key });
        console.log(client);
        setOpen(true);
        const cid_hash = await client.put(fileInput.files);
        setOpen(false);
        setHash(cid_hash);
        interact(cid_hash, "upload");
      } else {
        alert("Please install Metamask");
      }
    } else {
      alert("Please select file to upload");
    }
  }

  async function interact(cid_hash, func) {
    const contract = new web3.eth.Contract(contract_abi, contract_address);
    const accounts = await web3.eth.getAccounts();

    if (func === "upload") {
      setOpen(true);
      const response = await contract.methods.check(wallet).call();
      console.log(response);
      if (response[0] === "No data") {
        alert("Your are not authorized to read the data.");
      } else {
        const res = await contract.methods
          .upload_hash(wallet, cid_hash)
          .send({ from: accounts[0] });

        console.log(res);
      }

      setOpen(false);
    } else if (func === "read") {
      setOpen(true);
      const response = await contract.methods.check(wallet).call();
      console.log(response);
      if (response[0] === "No data") {
        alert("Your are not authorized to read the data.");
      } else {
        setHashArr(response);
        setRefreshBtn(false);
      }

      setOpen(false);
    }
  }

  function read_data() {
    if (web3 != null) {
      interact(hash, "read");
    } else {
      alert("Wallet not connected");
    }
  }

  async function getData(cid_hash) {
    const client = new Web3Storage({ token: api_key });
    const res = await client.get(cid_hash);
    const files = await res.files();

    const link = "https://ipfs.io/ipfs/" + cid_hash + "/" + files[0].name;

    const obj = await fetch("http://127.0.0.1:9999/setData?data=" + link);
    console.log(obj.text);
  }

  function refresh() {
    var tempMap = hashArr.map((n) => (
      <a
        href="http://localhost:3002"
        target="_blank"
        rel="noopener noreferrer"
        color="#618afb"
        onClick={() => getData(n)}
      >
        <text>{n}</text>
      </a>
    ));
    setHashList(tempMap);
  }

  useEffect(() => {
    check();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <text className="status">{status}</text>
        <text className="wallet_txt">Your wallet address:- {wallet}</text>

        <input
          type={"file"}
          name={"upload_file"}
          accept={".json"}
          onChange={(data) => onChange(data)}
          style={{ marginTop: "20px" }}
        />

        <button className="btn" onClick={upload_data}>
          <text className="btn_text">Upload Data</text>
        </button>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <text>{hash}</text>

        <button onClick={read_data} className="btn">
          <text className="btn_text">Read Data</text>
        </button>

        <button onClick={refresh} className="btn" disabled={refreshBtn}>
          <text className="btn_text">Refresh</text>
        </button>

        {hashList}
      </header>
    </div>
  );
}

export default App;
