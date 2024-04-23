import { View, Text, StatusBar, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import TrackPlayer, { Event, State } from 'react-native-track-player';
const SongPlayer = ({
  songsList,
  currentIndex,
  progress,
  playbackState,
  isVisible,
  onClose,
  onChange
}) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(currentIndex);

  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async e => {
      setCurrentSongIndex(e.nextTrack);
      onChange(e.nextTrack)
    })
  }, []

  );

  return (
    <Modal isVisible={isVisible} style={{ margin: 0 }}>
      <LinearGradient
        colors={songsList[currentSongIndex].colors}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          style={{ marginTop: 20, marginLeft: 20 }}
          onPress={() => {
            onClose();
          }}>
          <Image
            source={require('./src/images/down-arrow.png')}
            style={{
              width: 30,
              height: 30,
              tintColor: 'white',
            }}
          />
        </TouchableOpacity>

        <Image
          source={{ uri: songsList[currentSongIndex].artwork }}
          style={{
            width: '80%',
            height: '35%',
            alignSelf: 'center',
            marginTop: 20,
            borderRadius: 5,
          }}
        />
        <Text
          style={{
            fontSize: 30,
            color: 'white',
            fontWeight: '600',
            marginLeft: 20,
            marginTop: 20,
          }}>
          {songsList[currentSongIndex].title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: 'white',
            fontWeight: '600',
            marginLeft: 20,
          }}>
          {songsList[currentSongIndex].artist}
        </Text>
        <Slider
          style={{ width: '90%', height: 40, alignSelf: 'center' }}
          minimumValue={0}
          maximumValue={progress.duration}
          value={progress.position}
          minimumTrackTintColor="white"
          maximumTrackTintColor="white"
          onSlidingComplete={async value => {
            await TrackPlayer.seekTo(value);
          }}
        />
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'center',
          }}>
          <Text style={{ color: 'white' }}>{format(progress.position)}</Text>
          <Text style={{ color: 'white' }}>{format(progress.duration)}</Text>
        </View>

        {/* volume Controlle */}
        <View style={{
          width: '90%', alignSelf: 'center', marginTop: 20, justifyContent: 'center' , height: 40,
          flexDirection: 'row'
        }}>
          <Image source={require('./src/images/low-volume.png')} style={{ width: 20, height: 20, tintColor: 'white', position: 'absolute', top: 10, left: 10 }} />
          <Slider
            minimumValue={0}
            maximumValue={1}
            value={progress.volume}
            minimumTrackTintColor="white"
            maximumTrackTintColor="white"
            onSlidingComplete={async value => {
              await TrackPlayer.setVolume(value);
            }}
            style={{ width: '80%', alignSelf: 'center',justifyContent: 'center'}}
          />
          <Image source={require('./src/images/high-volume.png')} style={{ width: 20, height: 20, tintColor: 'white', position: 'absolute', top: 10, right: 10 }} />
        </View>

        <View
          style={{
            width: '100%',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
            marginTop: 30,
          }}>
          <TouchableOpacity onPress={async () => {
            if (currentSongIndex > 0) {
              await TrackPlayer.skip(currentSongIndex - 1);
              await TrackPlayer.play();
              setCurrentSongIndex(currentSongIndex - 1);
              onChange(currentSongIndex - 1)
            }
          }}>
            <Image
              source={require('./src/images/previous.png')}
              style={{ width: 35, height: 35, tintColor: 'white' }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={async () => {
              if (State.Playing == playbackState) {
                await TrackPlayer.pause();
              } else {
                await TrackPlayer.skip(currentIndex);
                await TrackPlayer.play();
              }
            }}>
            <Image
              source={
                State.Playing == playbackState
                  ? require('./src/images/pause2.png')
                  : require('./src/images/play.png')
              }
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await TrackPlayer.skip(currentSongIndex + 1);
              await TrackPlayer.play();
              setCurrentSongIndex(currentSongIndex + 1);
              onChange(currentSongIndex + 1)
            }}>
            <Image
              source={require('./src/images/next.png')}
              style={{ width: 35, height: 35, tintColor: 'white' }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={async () => {
            await TrackPlayer.skip(currentSongIndex + 1);
            await TrackPlayer.play();
            setCurrentSongIndex(currentSongIndex + 1);
            onChange(currentSongIndex + 1)
          }}
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)', marginTop: 30, padding: 15, marginHorizontal: 20, borderRadius: 10
          }}
        >
          <Text style={{ color: 'black', fontSize: 15, color: '#fff' }} >Up Next</Text>

          <View style={{ marginTop: 10, flexDirection: 'row', gap: 10 }} >
            <Image source={{ uri: songsList[currentSongIndex + 1].artwork }} style={{ width: 50, height: 50, borderRadius: 5 }} />
            <View>
              <Text style={{ color: 'black', fontSize: 18, color: '#fff' }} >{songsList[currentSongIndex + 1].title}</Text>
              <Text style={{ color: 'black', fontSize: 13, color: '#fff' }} >{songsList[currentSongIndex + 1].artist}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </Modal>
  );
};

export default SongPlayer;
