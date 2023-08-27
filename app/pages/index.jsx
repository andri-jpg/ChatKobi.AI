import { useState, useRef, useEffect } from 'react';
import { Alert, CircularProgress, Checkbox, Button} from '@mui/material';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown'; 
import Popup from './Popup';


function Home() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const restartInput = 'restart';
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [shouldReload, setShouldReload] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: 'Halo, apa yang ingin anda tanyakan?',
      type: 'apiMessage',
    },
  ]);
  const handleRestartInput = () => {
    setUserInput(restartInput);
  };
  

  module.exports = Home;
  const [termsAccepted, setTermsAccepted] = useState(false); 
  const warnMessage = 'Harap di ingat bahwa informasi yang diberikan oleh chatbot ini hanya untuk tujuan informasi umum. Gunakan dengan tanggung jawab.';
  const restartMessage = 'Respon AI aneh terdeteksi. Aplikasi akan direstart.';
  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (userInput === 'restart' && textAreaRef.current) {
      textAreaRef.current.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
        })
      );
      window.location.reload();
      setUserInput('');
    }
  }, [userInput]);

  useEffect(() => {
    let timer;
    if (popupOpen) {
      timer = setTimeout(() => {
        setPopupOpen(false);
        setAlertMessage("");
        setSeverity("");
        if (shouldReload) {
          window.location.reload();
        }
      }, 8000);
    }
    return () => clearTimeout(timer);
  }, [popupOpen, shouldReload]);

  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);
  
  const handleError = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: 'Oops! Terjadi kesalahan. Silakan coba lagi.', type: 'apiMessage' },
    ]);
    setLoading(false);
    setUserInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!termsAccepted) {
      return;
    }
  
    if (userInput.trim() === '') {
      return;
    }
  
    setLoading(true);
    setMessages((prevMessages) => [...prevMessages, { message: userInput, type: 'userMessage' }]);


    try {
      const response = await fetch('http://127.0.0.1:8089/handleinput', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: userInput,
          history: history,
        }),
      });
  
      if (!response.ok) {
        handleError();
        return;
      }
  

      setUserInput('');
      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { message: data.result, type: 'apiMessage' }]);
      setShouldReload(data.restart)
  
      if (data.warning) {
        setSeverity("warning")
        setPopupOpen(true);
        setAlertMessage(warnMessage);
      }

      if (data.restart) {
        setSeverity("error")
        setPopupOpen(true);
        setAlertMessage(restartMessage);
      }
  
    } catch (error) {
      handleError();
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter' && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
        if (shouldReload) {
          window.location.reload();
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (messages.length >= 1) {
      setHistory([messages[messages.length - 1].message]);
    }
  }, [messages]);
  

  return (
    <>
      <Head>
        <title>ChatKobi.AI</title>
        <meta name="description" content="" />
        <meta name="viewport" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.topnav}>
        <div className={styles.navlogo}>
          <a href="https://github.com/andri-jpg/ChatKobi.AI">ChatKobi.AI</a>
        </div>
        <div className={styles.navlinks}>
        {termsAccepted && (
            <Button
              variant="text"
              onClick={handleRestartInput}
              className={styles.restartLinkButton}
            >
              Restart
            </Button>
          )}
        
  {popupOpen && (
    <div className={`alert-container ${popupOpen ? 'fade-out' : ''}`}>   
    </div>
  )}
</div>
      </div>
      <main className={styles.main}>
        {termsAccepted ? (
          <div>
            <div className={styles.cloud}>
              <div ref={messageListRef} className={styles.messagelist}>
                {messages.map((message, index) => {
                  return (
                    <div
                      key={index}
                      className={
                        message.type === "userMessage" && loading && index === messages.length - 1
                          ? styles.usermessagewaiting
                          : message.type === "apiMessage"
                          ? styles.apimessage
                          : styles.usermessage
                      }
                    >
                      {message.type === "apiMessage" ? (
                        <Image
                          src="/bot.png"
                          alt="AI"
                          width="30"
                          height="30"
                          className={styles.boticon}
                          priority={true}
                        />
                      ) : (
                        <Image
                          src="/usericon.png"
                          alt="Me"
                          width="30"
                          height="30"
                          className={styles.usericon}
                          priority={true}
                        />
                      )}
                      <div className={styles.markdownanswer}>
                        <ReactMarkdown linkTarget={"_blank"}>{message.message}</ReactMarkdown>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.center}>
              <div className={styles.cloudform}>
                <form onSubmit={handleSubmit}>
                  <textarea
                    disabled={loading}
                    onKeyDown={handleEnter}
                    ref={textAreaRef}
                    autoFocus={false}
                    rows={1}
                    maxLength={512}
                    type="text"
                    id="userInput"
                    name="userInput"
                    placeholder={loading ? "Menunggu respon..." : "Ketik Pertanyaan anda..."}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className={styles.textarea}
                  />
                  <button type="submit" disabled={loading} className={styles.generatebutton}>
                    {loading ? (
                      <div className={styles.loadingwheel}>
                        <CircularProgress color="inherit" size={20} />{" "}
                      </div>
                    ) : (
                      <svg viewBox="0 0 20 20" className={styles.svgicon}>
                        <path
                          d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
                        ></path>
                      </svg>
                    )}
                  </button>
                </form>
              </div>
              <div className={styles.footer}>
                <p>
                  Built by <a href="https://github.com/andri-jpg">Andri Lawrence</a>.
                </p>
              </div>
            </div>
          </div>
        ) : (
        <div className={styles.center}>
          <div className={styles.terms}>
          <h3>Syarat dan Ketentuan</h3>
          <br />
          <p>
          Chatbot ini menyediakan informasi kesehatan umum dan bukan pengganti konsultasi medis langsung dengan profesional kesehatan.
          <br />
          <br />
          Penting untuk selalu berkonsultasi dengan dokter atau profesional yang berwenang untuk diagnosa dan perawatan yang tepat.
          Dengan menggunakan chatbot ini, pengguna dianggap telah menyetujui dan memahami ketentuan ini.
          </p>
          <br />
          <p>
          Penggunaan chatbot ini adalah tanggung jawab pengguna sepenuhnya. Pembuat dan pengembang chatbot tidak bertanggung jawab atas akibat atau kerugian yang mungkin timbul akibat penggunaan informasi dari chatbot ini.
          </p>
          <br />
          <p>
          Informasi lebih lanjut <a href="https://github.com/andri-jpg/ChatKobi.AI#disclaimer" style={{ color: 'green' }}>Klik Disini</a>.
          </p>

          <br/>
          <h4>Contoh Prompt yang baik :</h4>
          <br />
          <ul>
          <li style={{ marginLeft: '20px' }}>Kenapa telinga saya gatal?</li>
          <li style={{ marginLeft: '20px' }}>Kalau susah buang air besar itu kenapa ya?</li>
          <li style={{ marginLeft: '20px' }}>Apa itu kolestrol?</li>
          <li style={{ marginLeft: '20px' }}>cara mencegah kolestrol tinggi gimana ya?</li>
          </ul>
    <br/>
    <Alert severity='info' style={{ backgroundColor: 'rgba(25, 25, 85, 0.2)', color: 'white' }}>
  Jika respon Chatbot sudah mulai aneh, silahkan tekan tombol{' '}
  <span
    style={{
      color: 'cyan',
      cursor: 'pointer',
    }}
    onClick={handleRestartInput}
  >
    restart
  </span>{' '}
</Alert>
    <Alert severity="success" style={{ backgroundColor: 'rgba(25, 25, 85, 0.2)', color: 'white',display: 'flex', alignItems: 'center'}}>
      Centang syarat dan ketentuan dibawah untuk melanjutkan 👇
    </Alert>
    
    <br/>
    <div className={styles.terms}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={termsAccepted}
          onChange={() => setTermsAccepted(!termsAccepted)}
          style={{ color: 'white' }}
        />
        <span style={{ width: '10px', display: 'inline-block' }}></span>
        <span style={{ color: 'white' }}>Saya Setuju dengan Syarat dan ketentuan yang berlaku.</span>
      </div>
    </div>
  </div>
</div>
        )}
        {popupOpen && ( 
          <Popup open={popupOpen} onClose={() => setPopupOpen(false)} message={alertMessage} severity={severity} />
        )}
      </main>
    </>
  );
}
export default Home;