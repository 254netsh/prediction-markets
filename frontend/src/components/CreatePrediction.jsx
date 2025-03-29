// frontend/src/components/CreatePrediction.jsx
const predictionTypes = [
    { value: 'price', label: 'Price Prediction' },
    { value: 'event', label: 'Event Prediction' }
  ];
  
  const CreatePrediction = () => {
    const [form, setForm] = useState({
      type: 'price',
      target: '',
      timeframe: 3600
    });
  
    const submit = async () => {
      await axios.post('/api/predictions', {
        type: form.type,
        descriptor: form.type === 'price' 
          ? `${form.asset}>${form.target}`
          : form.eventDescription,
        duration: form.timeframe
      });
    };
    
    return (
      <Form>
        <Select options={predictionTypes} onChange={(v) => setForm({...form, type: v})} />
        {form.type === 'price' ? (
          <PriceInputs />
        ) : (
          <EventDescriptionInput />
        )}
      </Form>
    );
  };