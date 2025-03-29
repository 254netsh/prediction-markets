const handleSubmit = async () => {
    await axios.post('/api/predictions', {
      walletAddress,
      cryptocurrency: 'bitcoin',
      predictedPrice: 50000
    });
  };