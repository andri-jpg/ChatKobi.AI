import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown'; 
import CircularProgress from '@mui/material/CircularProgress';

function Home() {
  const [userInput, setUserInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: 'Halo, apa yang ingin anda tanyakan?',
      type: 'apiMessage',
    },
  ]);

  module.exports = Home;
  const [termsAccepted, setTermsAccepted] = useState(false); // New state for terms acceptance

  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);

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
    console.log("Data yang akan dikirim ke server:", { question: userInput, history: history });
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userInput, history: history }),
      });
  
      if (!response.ok) {
        handleError();
        return;
      }
  
      setUserInput('');
      const data = await response.json();
      console.log(data)
      setMessages((prevMessages) => [...prevMessages, { message: data.result, type: 'apiMessage' }]);
  
      if (data.warning) {
        window.alert("Harap di ingat bahwa informasi yang diberikan oleh chatbot ini hanya untuk tujuan informasi umum. Gunakan dengan tanggung jawab.");
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
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (messages.length >= 3) {
      setHistory([[messages[messages.length - 2].message, messages[messages.length - 1].message]]);
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
          <a href="/">ChatKobi.AI</a>
        </div>
        <div className={styles.navlinks}>
          {/*<a href="https://github.com/andri-jpg/ChatKobi.AI" target="_blank">GitHub</a>*/}
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
                  Built by <a href="https://github.com/andri-jpg/ChatKobi.ai" target="_blank">Andri Lawrence</a>.
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
                Informasi lebih lanjut <a href="https://github.com/andri-jpg/ChatKobi.AI#disclaimer" target="_blank" style={{ color: 'green' }}>Klik Disini</a>.
              </p>
              <br />
              <label>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
                <span style={{ width: '10px', display: 'inline-block' }}></span>
                Saya Setuju dengan Syarat dan ketentuan yang berlaku.
              </label>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
export default Home;