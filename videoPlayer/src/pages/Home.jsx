import React, { useState, useRef } from 'react';
import HeaderComponent from '../components/organisms/Header';

function HomeView() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleSound = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  return (
    <>
      <HeaderComponent />
      <main className="h-screen w-full bg-[#252525] relative overflow-hidden mt-3.5 flex">
        <div className="absolute inset-0 z-0">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover absolute top-0 left-0 brightness-50"
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src="./easy.mp4" type="video/mp4"/>
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70 z-10"></div>
        </div>
        
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white">
          
          
          <div className="flex space-x-4 gap-4">
          </div>
        </div>
      </main>
    </>
  );
}

export default HomeView;