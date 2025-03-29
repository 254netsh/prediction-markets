// PredictionForm.jsx
function PredictionForm({ contract }) {
    const [crypto, setCrypto] = useState('BTC');
    const [price, setPrice] = useState('');
  
    const submit = async () => {
      await contract.methods.submitPrediction(crypto, web3.utils.toWei(price))
        .send({ from: window.ethereum.selectedAddress });
    };
  
    return (
      <div>
        <input value={price} onChange={(e) => setPrice(e.target.value)} />
        <button onClick={submit}>Submit Prediction</button>
      </div>
    );
  }