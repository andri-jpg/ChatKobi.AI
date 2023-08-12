export default async function (req, res) {
  const question = req.body.question;
  const history = req.body.history;

  try {
    const response = await fetch('http://127.0.0.1:8000/handleinput', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: question,
        history: history,
      }),
    });
  
    const responseData = await response.json();
    console.log(responseData); 
    const result = responseData.result; 
    res.status(200).json({ result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}  
  
  
  