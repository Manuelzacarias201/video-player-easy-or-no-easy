import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import ReactPlayer from "react-player";

function PlayVideo() {
  const location = useLocation();
  const { movie } = location.state || {};
  const playerRef = useRef(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [videoData, setVideoData] = useState({
    url: movie?.video || "",
    playbackPosition: 0,
    lastWatched: null,
    duration: 0,
    playbackRate: 1.0
  });
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [initialSeekDone, setInitialSeekDone] = useState(false);
  const seekTimeoutRef = useRef(null);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cacheVideo = async (videoUrl) => {
    try {
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        console.log("Cannot cache YouTube videos");
        return;
      }
      
      const cache = await caches.open("video-cache");
      const response = await fetch(videoUrl, { mode: 'no-cors' });
      await cache.put(videoUrl, response.clone());
      console.log("Video successfully stored in cache");
    } catch (error) {
      console.error("Error caching video:", error);
    }
  };

  const isVideoCached = async (videoUrl) => {
    try {
      const cache = await caches.open("video-cache");
      const cachedResponse = await cache.match(videoUrl);
      return !!cachedResponse;
    } catch (error) {
      console.error("Error checking cache:", error);
      return false;
    }
  };

  useEffect(() => {
    if (!movie?.video) return;
    
    const loadSavedData = () => {
      if (movie?.id) {
        const savedData = localStorage.getItem(`video-data-${movie.id}`);
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            const playbackPosition = parsedData.playbackPosition || 0;
            const duration = parsedData.duration || 0;
            
            if (duration && (duration - playbackPosition < 20 || playbackPosition >= duration)) {
              console.log("Saved position near end, restarting");
              setVideoData(prev => ({
                ...prev,
                playbackPosition: 0,
                lastWatched: parsedData.lastWatched,
                playbackRate: parsedData.playbackRate || 1.0
              }));
            } else {
              setVideoData(prev => ({
                ...prev,
                playbackPosition: playbackPosition,
                lastWatched: parsedData.lastWatched,
                playbackRate: parsedData.playbackRate || 1.0
              }));
            }
          } catch (e) {
            console.error("Error parsing saved data:", e);
          }
        }
      }
    };
    
    const setupVideoCache = async () => {
      if (navigator.onLine) {
        const isCached = await isVideoCached(movie.video);
        if (!isCached) {
          console.log("Caching video...");
          await cacheVideo(movie.video);
        } else {
          console.log("Video is already cached");
        }
      }
    };
    
    loadSavedData();
    setupVideoCache();
    
    return () => {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
    };
  }, [movie]);

  useEffect(() => {
    if (isPlayerReady && videoData.playbackPosition > 0 && !initialSeekDone && playerRef.current) {
      console.log(`Attempting to position video at: ${videoData.playbackPosition}s`);
      
      seekTimeoutRef.current = setTimeout(() => {
        try {
          playerRef.current.seekTo(videoData.playbackPosition, 'seconds');
          console.log("Seek completed");
          setInitialSeekDone(true);
        } catch (error) {
          console.error("Error seeking initial position:", error);
        }
      }, 2000);
    }
  }, [isPlayerReady, videoData.playbackPosition, initialSeekDone]);

  const handleProgress = (progress) => {
    if (!movie?.id) return;
    
    setVideoData(prev => {
      if (Math.abs(progress.playedSeconds - prev.playbackPosition) > 5) {
        const newData = {
          url: prev.url,
          playbackPosition: progress.playedSeconds,
          lastWatched: new Date().toISOString(),
          duration: playerRef.current ? playerRef.current.getDuration() : prev.duration,
          playbackRate: prev.playbackRate
        };
        
        localStorage.setItem(`video-data-${movie.id}`, JSON.stringify(newData));
        return newData;
      }
      
      return prev;
    });
  };

  // Offline indicator
  const OfflineIndicator = () => (
    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded shadow-lg z-20">
      Sin conexión
    </div>
  );

  return (
    <section className="w-full h-screen bg-black flex flex-col relative">
      {!isOnline && <OfflineIndicator />}
      
      <ReactPlayer
        ref={playerRef}
        url={videoData.url}
        playing={true}
        controls={true}
        width="100%"
        height="100%"
        playbackRate={videoData.playbackRate}
        onProgress={handleProgress}
        progressInterval={1000}
        onDuration={(duration) => {
          console.log(`Duration detected: ${duration}s`);
          setVideoData(prev => ({ ...prev, duration }));
        }}
        config={{
          file: {
            forceVideo: true,
            attributes: {
              controlsList: 'nodownload'
            }
          }
        }}
        onReady={() => {
          console.log("Player ready");
          setIsPlayerReady(true);
        }}
        onError={(e) => {
          console.error("Playback error:", e);
          setVideoData(prev => ({ ...prev, playbackPosition: 0 }));
        }}
      />
    </section>
  );
}

export default PlayVideo;