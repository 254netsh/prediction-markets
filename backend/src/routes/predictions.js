// backend/src/routes/predictions.js
router.post('/', async (req, res) => {
    const { type, descriptor, duration } = req.body;
    
    // 1. Validate prediction
    const validation = PredictionValidator.validate(type, descriptor);
    
    // 2. Save to DB
    const prediction = await db.Prediction.create({
      userId: req.user.id,
      type,
      descriptor,
      expiresAt: Date.now() + duration
    });
    
    // 3. Submit to blockchain
    const tx = await contract.createPrediction(
      typeMapping[type],
      descriptor,
      duration
    );
    
    res.json({ prediction, txHash: tx.hash });
  });